import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { rateLimit } from '@/lib/rateLimit';

// Le avisa por email a un profesional que su perfil fue revisado y ya puede
// pagar para activarse. Solo lo puede disparar el admin.
export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'sin-ip';
  if (!rateLimit(`notificar-verificado:${ip}`, { limite: 20, ventanaMs: 60_000 })) {
    return NextResponse.json({ error: 'Demasiados intentos' }, { status: 429 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // cuerpo vacío o inválido
  }
  const { profesional_id } = body;
  const authHeader = request.headers.get('authorization');

  if (!profesional_id || !authHeader) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const supabaseUser = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    { global: { headers: { Authorization: authHeader } } }
  );

  const { data: userData } = await supabaseUser.auth.getUser();
  if (userData?.user?.email !== process.env.ADMIN_EMAIL) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
  }

  const { data: profesional } = await supabaseAdmin
    .from('profesionales')
    .select('nombre, user_id')
    .eq('id', profesional_id)
    .single();

  if (!profesional?.user_id) {
    return NextResponse.json({ received: true });
  }

  const { data: usuario } = await supabaseAdmin.auth.admin.getUserById(profesional.user_id);
  const email = usuario?.user?.email;
  if (!email) return NextResponse.json({ received: true });

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: 'Vips <hola@misvips.com>',
      to: [email],
      subject: 'Revisamos tu perfil en Vips — ya podés activarlo',
      html: `
        <p>Hola ${profesional.nombre},</p>
        <p>Revisamos tu perfil en Vips y quedó confirmado. Ya podés completar el pago para
        activarlo y empezar a aparecer en el directorio.</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/panel/pago">${process.env.NEXT_PUBLIC_SITE_URL}/panel/pago</a></p>
      `,
    }),
  });

  return NextResponse.json({ received: true });
}
