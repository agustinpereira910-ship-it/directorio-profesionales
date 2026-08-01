export const metadata = {
  title: 'Política de Privacidad — Vips',
};

export default function PrivacidadPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Política de Privacidad</h1>
      <p className="text-graphite text-sm mb-10">Última actualización: agosto de 2026</p>

      <div className="space-y-8 text-graphite text-sm leading-relaxed">
        <section>
          <p>
            Esta política explica qué datos personales recolecta Vips (misvips.com), para qué los
            usa, y qué derechos tenés sobre ellos, conforme a la Ley N.º 18.331 de Protección de
            Datos Personales de Uruguay.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">1. Qué datos recolectamos</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Datos de cuenta: email y contraseña (la contraseña se almacena de forma encriptada).</li>
            <li>Datos de perfil profesional: nombre, descripción, teléfono, WhatsApp, email de contacto, sitio web, foto, categoría y zona.</li>
            <li>Datos de pago: método elegido, monto, y comprobante de transferencia si aplica. Los pagos con Mercado Pago los procesa Mercado Pago directamente — Vips no almacena números de tarjeta.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">2. Para qué usamos tus datos</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>Mostrar tu perfil público en el directorio (si sos profesional).</li>
            <li>Verificar tu identidad y activar tu publicación.</li>
            <li>Procesar pagos y confirmar tu suscripción.</li>
            <li>Comunicarnos con vos por email (confirmación de cuenta, estado de tu publicación).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">3. Con quién compartimos datos</h2>
          <p>
            No vendemos tus datos a terceros. Usamos los siguientes proveedores para operar el
            sitio, quienes procesan datos en nuestro nombre bajo sus propias políticas de
            seguridad:
          </p>
          <ul className="list-disc pl-5 space-y-1 mt-2">
            <li><strong>Supabase</strong> — base de datos, autenticación y almacenamiento de archivos.</li>
            <li><strong>Mercado Pago</strong> — procesamiento de pagos online.</li>
            <li><strong>Resend</strong> — envío de emails transaccionales (confirmación de cuenta).</li>
            <li><strong>Vercel</strong> — alojamiento del sitio web.</li>
          </ul>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">4. Tus derechos</h2>
          <p>
            Podés acceder, rectificar o solicitar la eliminación de tus datos personales en
            cualquier momento escribiendo a{' '}
            <a href="mailto:hola@misvips.com" className="text-ink underline">hola@misvips.com</a>.
            Los datos de perfiles públicos se eliminan del directorio público al eliminar tu
            cuenta, aunque algunos registros (como historial de pagos) pueden conservarse por
            obligaciones legales o contables.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">5. Seguridad</h2>
          <p>
            Aplicamos controles de acceso a nivel de base de datos (cada usuario solo puede ver y
            modificar sus propios datos, salvo la información pública del directorio) y
            almacenamos las contraseñas de forma encriptada. Ningún sistema es 100% infalible;
            si detectás un problema de seguridad, avisanos a{' '}
            <a href="mailto:hola@misvips.com" className="text-ink underline">hola@misvips.com</a>.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">6. Cookies y sesión</h2>
          <p>
            Usamos almacenamiento local del navegador (no cookies de terceros con fines
            publicitarios) para mantener tu sesión iniciada mientras navegás el sitio.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">7. Contacto</h2>
          <p>
            Para cualquier consulta sobre esta política, escribinos a{' '}
            <a href="mailto:hola@misvips.com" className="text-ink underline">hola@misvips.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
