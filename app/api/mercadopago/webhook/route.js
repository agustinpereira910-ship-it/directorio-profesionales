import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { rateLimit } from '@/lib/rateLimit';

// Mercado Pago llama a esta URL cuando cambia el estado de un pago o de una
// suscripción. Nunca confiamos en el estado que venga en la notificación:
// siempre volvemos a consultar el recurso directo a la API de Mercado Pago.
export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'sin-ip';
  if (!rateLimit(`mp-webhook:${ip}`, { limite: 60, ventanaMs: 60_000 })) {
    return NextResponse.json({ received: true }, { status: 429 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // algunas notificaciones llegan sin body (formato IPN viejo, solo query params)
  }

  const { searchParams } = new URL(request.url);
  const dataId =
    body?.data?.id ||
    searchParams.get('data.id') ||
    searchParams.get('id');
  const tipo = body?.type || searchParams.get('type') || searchParams.get('topic');

  if (tipo === 'payment' && dataId) {
    return manejarPagoUnico(dataId);
  }

  if (tipo === 'subscription_authorized_payment' && dataId) {
    return manejarCobroSuscripcion(dataId);
  }

  if (tipo === 'subscription_preapproval' && dataId) {
    return manejarCambioSuscripcion(dataId);
  }

  return NextResponse.json({ received: true });
}

// Pago único (flujo anterior a las suscripciones, se deja por compatibilidad).
async function manejarPagoUnico(paymentId) {
  const pagoResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
  });

  if (!pagoResponse.ok) return NextResponse.json({ received: true });

  const pago = await pagoResponse.json();
  const profesionalId = pago.external_reference;

  if (pago.status !== 'approved' || !profesionalId) {
    return NextResponse.json({ received: true });
  }

  const inserted = await registrarPagoAprobado({
    profesionalId,
    monto: pago.transaction_amount,
    moneda: pago.currency_id,
    referenciaExterna: paymentId,
  });

  if (inserted) {
    await supabaseAdmin.from('profesionales').update({ estado: 'activo' }).eq('id', profesionalId);
  }

  return NextResponse.json({ received: true });
}

// Cobro recurrente de una suscripción (se dispara cada mes).
async function manejarCobroSuscripcion(authorizedPaymentId) {
  const res = await fetch(`https://api.mercadopago.com/authorized_payments/${authorizedPaymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
  });

  if (!res.ok) return NextResponse.json({ received: true });

  const cobro = await res.json();

  if (cobro.status !== 'approved' || !cobro.preapproval_id) {
    return NextResponse.json({ received: true });
  }

  // El cobro no trae el profesional directo: hay que consultar la suscripción
  // (guardamos el profesional_id en external_reference al crearla).
  const preRes = await fetch(`https://api.mercadopago.com/preapproval/${cobro.preapproval_id}`, {
    headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
  });

  if (!preRes.ok) return NextResponse.json({ received: true });

  const preapproval = await preRes.json();
  const profesionalId = preapproval.external_reference;

  if (!profesionalId) return NextResponse.json({ received: true });

  const inserted = await registrarPagoAprobado({
    profesionalId,
    monto: cobro.transaction_amount,
    moneda: cobro.currency_id,
    referenciaExterna: `suscripcion-${authorizedPaymentId}`,
  });

  if (inserted) {
    const fechaVencimiento = new Date();
    fechaVencimiento.setMonth(fechaVencimiento.getMonth() + 1);

    await supabaseAdmin
      .from('profesionales')
      .update({
        estado: 'activo',
        mp_preapproval_id: cobro.preapproval_id,
        fecha_vencimiento: fechaVencimiento.toISOString(),
        recordatorio_enviado_at: null,
      })
      .eq('id', profesionalId);
  }

  return NextResponse.json({ received: true });
}

// Cambios en el estado de la suscripción en sí (cancelada, pausada, autorizada).
async function manejarCambioSuscripcion(preapprovalId) {
  const res = await fetch(`https://api.mercadopago.com/preapproval/${preapprovalId}`, {
    headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
  });

  if (!res.ok) return NextResponse.json({ received: true });

  const preapproval = await res.json();
  const profesionalId = preapproval.external_reference;

  if (!profesionalId) return NextResponse.json({ received: true });

  // El profesional canceló o se pausó el cobro: el perfil deja de estar activo.
  // (El primer cobro exitoso, que activa el perfil, lo maneja manejarCobroSuscripcion.)
  if (preapproval.status === 'cancelled' || preapproval.status === 'paused') {
    await supabaseAdmin
      .from('profesionales')
      .update({ estado: 'vencido' })
      .eq('id', profesionalId);
  }

  return NextResponse.json({ received: true });
}

// Idempotencia: Mercado Pago puede reenviar la misma notificación varias veces,
// y hasta puede llegar más de una en simultáneo. El índice único en
// pagos.referencia_externa (ver supabase/schema.sql) es quien decide de verdad:
// si ya existe, el insert falla con 23505 y no volvemos a procesar.
// Devuelve true si el pago se registró ahora (recién procesado).
async function registrarPagoAprobado({ profesionalId, monto, moneda, referenciaExterna }) {
  const { error } = await supabaseAdmin.from('pagos').insert({
    profesional_id: profesionalId,
    metodo: 'mercado_pago',
    monto,
    moneda: moneda || 'UYU',
    estado: 'aprobado',
    referencia_externa: referenciaExterna,
  });

  if (error && error.code !== '23505') {
    throw new Error(`No se pudo registrar el pago: ${error.message}`);
  }

  return !error;
}

// Mercado Pago a veces valida la URL con un GET antes de guardarla.
export async function GET() {
  return NextResponse.json({ ok: true });
}
