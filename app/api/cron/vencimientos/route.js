import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabaseAdmin';
import { LOGO_HTML, FROM_EMAIL, FOOTER_HTML } from '@/lib/emailLogo';

const DIAS_AVISO_PREVIO = 3;

// Corre una vez por día (ver vercel.json). Vercel manda un header
// "Authorization: Bearer <CRON_SECRET>" automáticamente cuando CRON_SECRET
// está seteado como variable de entorno — así nadie más puede disparar esto.
export async function GET(request) {
  const authHeader = request.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 401 });
  }

  const ahora = new Date();
  const limiteAviso = new Date(ahora.getTime() + DIAS_AVISO_PREVIO * 24 * 60 * 60 * 1000);

  const resultados = { avisados: 0, vencidos: 0, errores: 0 };

  // 1) Perfiles activos que vencen pronto y todavía no recibieron el aviso.
  const { data: porVencer } = await supabaseAdmin
    .from('profesionales')
    .select('id, nombre, user_id, fecha_vencimiento')
    .eq('estado', 'activo')
    .lte('fecha_vencimiento', limiteAviso.toISOString())
    .gt('fecha_vencimiento', ahora.toISOString())
    .is('recordatorio_enviado_at', null);

  for (const p of porVencer || []) {
    const email = await emailDeUsuario(p.user_id);
    if (!email) continue;

    const ok = await enviarEmail({
      to: email,
      subject: 'Tu publicación en Vips vence pronto',
      html: `
        ${LOGO_HTML}
        <p>Hola ${p.nombre},</p>
        <p>Tu publicación en Vips vence el ${new Date(p.fecha_vencimiento).toLocaleDateString('es-UY')}.</p>
        <p>Para seguir activo en el directorio, renová tu pago (transferencia o Mercado Pago) antes de esa fecha desde tu panel: <a href="${process.env.NEXT_PUBLIC_SITE_URL}/panel/pago">${process.env.NEXT_PUBLIC_SITE_URL}/panel/pago</a></p>
        <p>Si ya pagás con Mercado Pago de forma automática, no necesitás hacer nada — este aviso es solo por las dudas.</p>
        ${FOOTER_HTML}
      `,
    });

    if (ok) {
      await supabaseAdmin
        .from('profesionales')
        .update({ recordatorio_enviado_at: ahora.toISOString() })
        .eq('id', p.id);
      resultados.avisados++;
    } else {
      resultados.errores++;
    }
  }

  // 2) Perfiles activos que ya vencieron: pasan a "vencido" y desaparecen del directorio.
  const { data: vencidos } = await supabaseAdmin
    .from('profesionales')
    .select('id, nombre, user_id')
    .eq('estado', 'activo')
    .lt('fecha_vencimiento', ahora.toISOString());

  for (const p of vencidos || []) {
    await supabaseAdmin.from('profesionales').update({ estado: 'vencido' }).eq('id', p.id);
    resultados.vencidos++;

    const email = await emailDeUsuario(p.user_id);
    if (email) {
      await enviarEmail({
        to: email,
        subject: 'Tu publicación en Vips venció',
        html: `
          ${LOGO_HTML}
          <p>Hola ${p.nombre},</p>
          <p>Tu publicación en Vips venció y dejó de aparecer en el directorio.</p>
          <p>Para reactivarla, entrá a tu panel y renová el pago: <a href="${process.env.NEXT_PUBLIC_SITE_URL}/panel/pago">${process.env.NEXT_PUBLIC_SITE_URL}/panel/pago</a></p>
          ${FOOTER_HTML}
        `,
      });
    }
  }

  return NextResponse.json(resultados);
}

async function emailDeUsuario(userId) {
  if (!userId) return null;
  const { data } = await supabaseAdmin.auth.admin.getUserById(userId);
  return data?.user?.email || null;
}

async function enviarEmail({ to, subject, html }) {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.RESEND_API_KEY}`,
    },
    body: JSON.stringify({
      from: FROM_EMAIL,
      to: [to],
      subject,
      html,
    }),
  });
  return res.ok;
}
