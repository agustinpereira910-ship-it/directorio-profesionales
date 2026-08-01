import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PLAN_MONTO_MERCADOPAGO } from '@/lib/planes';
import { rateLimit } from '@/lib/rateLimit';

// Crea una suscripción recurrente mensual en Mercado Pago (Preapproval API) y
// devuelve el link para que el profesional la autorice. A partir de ahí, Mercado
// Pago cobra automáticamente cada mes — ver app/api/mercadopago/webhook/route.js
// para cómo se procesan esos cobros.
export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'sin-ip';
  if (!rateLimit(`mercadopago-suscripcion:${ip}`, { limite: 10, ventanaMs: 60_000 })) {
    return NextResponse.json({ error: 'Demasiados intentos, esperá un momento.' }, { status: 429 });
  }

  const { profesional_id } = await request.json();
  const authHeader = request.headers.get('authorization');

  if (!profesional_id || !authHeader) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Cliente con la sesión del usuario que llama: bajo RLS solo puede ver este
  // perfil si es el dueño (o si ya está activo), así nadie activa el perfil de otro.
  const supabaseUser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: profesional } = await supabaseUser
    .from('profesionales')
    .select('id')
    .eq('id', profesional_id)
    .single();

  if (!profesional) {
    return NextResponse.json({ error: 'Perfil no encontrado' }, { status: 404 });
  }

  const { data: userData } = await supabaseUser.auth.getUser();
  const payerEmail = userData?.user?.email;

  if (!payerEmail) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const response = await fetch('https://api.mercadopago.com/preapproval', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      reason: 'Publicación en Vips — suscripción mensual',
      external_reference: profesional_id,
      payer_email: payerEmail,
      back_url: `${process.env.NEXT_PUBLIC_SITE_URL}/panel?pago=exitoso`,
      status: 'pending',
      auto_recurring: {
        frequency: 1,
        frequency_type: 'months',
        transaction_amount: PLAN_MONTO_MERCADOPAGO,
        currency_id: 'UYU',
      },
    }),
  });

  const data = await response.json();

  if (!response.ok) {
    return NextResponse.json({ error: 'No pudimos crear la suscripción.' }, { status: 502 });
  }

  return NextResponse.json({ init_point: data.init_point });
}
