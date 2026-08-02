// Header con el logo de Vips para los emails transaccionales, en el mismo
// círculo donde antes iba la foto de perfil. Siempre el logo de marca (nunca
// la foto de un cliente) para que no quede un círculo en blanco.
export const LOGO_HTML = `<img src="${process.env.NEXT_PUBLIC_SITE_URL}/icon-512.png" alt="Vips" width="80" height="80" style="border-radius:50%;object-fit:cover;background:#000;display:block;margin-bottom:16px;" />`;

// Nombre completo de la marca en el remitente, para que quien recibe el email
// (y tiene que pagar) reconozca de entrada que es Vips y no algo genérico/sospechoso.
export const FROM_EMAIL = 'Vips - Directorio de Profesionales <hola@misvips.com>';

// Firma de cierre con el sitio, para reforzar que el email es legítimo.
export const FOOTER_HTML = `
  <p style="margin-top:24px;padding-top:16px;border-top:1px solid #e5e5e5;color:#666;font-size:13px;">
    El equipo de Vips<br />
    <a href="${process.env.NEXT_PUBLIC_SITE_URL}" style="color:#666;">${process.env.NEXT_PUBLIC_SITE_URL?.replace('https://', '')}</a>
  </p>
`;
