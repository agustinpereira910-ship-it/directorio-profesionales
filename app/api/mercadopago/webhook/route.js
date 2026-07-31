import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { rateLimit } from '@/lib/rateLimit';

// Mercado Pago llama a esta URL cuando cambia el estado de un pago.
// Configurarla en Mercado Pago → Developers → Tu app → Webhooks, o queda
// seteada automáticamente por notification_url en route.js.
// Nunca confiamos en el estado que venga en la notificación: siempre volvemos
// a consultar el pago directo a la API de Mercado Pago con el access token.
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
  const paymentId =
    body?.data?.id ||
    searchParams.get('data.id') ||
    (searchParams.get('topic') === 'payment' ? searchParams.get('id') : null);

  const tipo = body?.type || searchParams.get('type') || searchParams.get('topic');

  if (tipo !== 'payment' || !paymentId) {
    return NextResponse.json({ received: true });
  }

  const pagoResponse = await fetch(`https://api.mercadopago.com/v1/payments/${paymentId}`, {
    headers: { Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}` },
  });

  if (!pagoResponse.ok) {
    return NextResponse.json({ received: true });
  }

  const pago = await pagoResponse.json();
  const profesionalId = pago.external_reference;

  if (pago.status !== 'approved' || !profesionalId) {
    return NextResponse.json({ received: true });
  }

  // Idempotencia: Mercado Pago puede reenviar la misma notificación varias veces,
  // y hasta puede llegar más de una en simultáneo. El índice único en
  // pagos.referencia_externa (ver supabase/schema.sql) es quien decide de verdad:
  // si ya existe, el insert falla con 23505 y no volvemos a activar el perfil.
  const { error: insertError } = await supabaseAdmin.from('pagos').insert({
    profesional_id: profesionalId,
    metodo: 'mercado_pago',
    monto: pago.transaction_amount,
    moneda: pago.currency_id || 'UYU',
    estado: 'aprobado',
    referencia_externa: String(paymentId),
  });

  if (insertError) {
    // 23505 = unique_violation: esta notificación ya se había procesado antes.
    if (insertError.code === '23505') {
      return NextResponse.json({ received: true });
    }
    return NextResponse.json({ received: true }, { status: 500 });
  }

  await supabaseAdmin
    .from('profesionales')
    .update({ estado: 'activo' })
    .eq('id', profesionalId);

  return NextResponse.json({ received: true });
}

// Mercado Pago a veces valida la URL con un GET antes de guardarla.
export async function GET() {
  return NextResponse.json({ ok: true });
}
