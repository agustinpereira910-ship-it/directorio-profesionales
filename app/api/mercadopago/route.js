import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { PLAN_MONTO_MERCADOPAGO } from '@/lib/planes';
import { rateLimit } from '@/lib/rateLimit';

// Crea una "preferencia de pago" en Mercado Pago y devuelve el link de checkout.
// Requiere MERCADOPAGO_ACCESS_TOKEN en .env.local (Mercado Pago → Developers → Credenciales).
export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'sin-ip';
  if (!rateLimit(`mercadopago:${ip}`, { limite: 10, ventanaMs: 60_000 })) {
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

  const response = await fetch('https://api.mercadopago.com/checkout/preferences', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`,
    },
    body: JSON.stringify({
      items: [
        {
          title: 'Publicación en Vips',
          quantity: 1,
          currency_id: 'UYU',
          unit_price: PLAN_MONTO_MERCADOPAGO,
        },
      ],
      external_reference: profesional_id,
      notification_url: `${process.env.NEXT_PUBLIC_SITE_URL}/api/mercadopago/webhook`,
      back_urls: {
        success: `${process.env.NEXT_PUBLIC_SITE_URL}/panel?pago=exitoso`,
        failure: `${process.env.NEXT_PUBLIC_SITE_URL}/panel/pago?pago=error`,
      },
      auto_return: 'approved',
    }),
  });

  const data = await response.json();
  return NextResponse.json({ init_point: data.init_point });
}
