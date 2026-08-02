// Header con el logo de Vips para los emails transaccionales, en el mismo
// círculo donde antes iba la foto de perfil. Siempre el logo de marca (nunca
// la foto de un cliente) para que no quede un círculo en blanco.
export const LOGO_HTML = `<img src="${process.env.NEXT_PUBLIC_SITE_URL}/icon-512.png" alt="Vips" width="80" height="80" style="border-radius:50%;object-fit:cover;background:#000;display:block;margin-bottom:16px;" />`;
