import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { rateLimit } from '@/lib/rateLimit';
import { LOGO_HTML, FROM_EMAIL, FOOTER_HTML } from '@/lib/emailLogo';

// Se dispara automáticamente apenas alguien publica su perfil (ver app/publicar/page.js).
// Le manda un email invitándolo a completar el pago — no depende de que un admin
// revise el contenido primero.
export async function POST(request) {
  const ip = request.headers.get('x-forwarded-for') || 'sin-ip';
  if (!rateLimit(`notificar-registro:${ip}`, { limite: 10, ventanaMs: 60_000 })) {
    return NextResponse.json({ error: 'Demasiados intentos' }, { status: 429 });
  }

  let body = {};
  try {
    body = await request.json();
  } catch {
    // cuerpo vacío o inválido
  }
  const { profesional_id, nombre } = body;
  const authHeader = request.headers.get('authorization');

  if (!profesional_id || !authHeader) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  // Cliente con la sesión del usuario que llama: bajo RLS solo puede ver este
  // perfil si es el dueño, así nadie dispara esto para el perfil de otro.
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

  const { data: userData } = await supabaseUser.auth.getUser();
  const email = userData?.user?.email;

  if (!profesional || !email) {
    return NextResponse.json({ received: true });
  }

  await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [email],
      subject: 'Ya casi — completá el pago para activar tu perfil en Vips',
      html: `
        ${LOGO_HTML}
        <p>Hola ${nombre || ''},</p>
        <p>Guardamos tu perfil en Vips. Para que se active y empieces a aparecer en el
        directorio, completá el pago (Mercado Pago o transferencia):</p>
        <p><a href="${process.env.NEXT_PUBLIC_SITE_URL}/panel/pago">${process.env.NEXT_PUBLIC_SITE_URL}/panel/pago</a></p>
        ${FOOTER_HTML}
      `,
    }),
  });

  return NextResponse.json({ received: true });
}
