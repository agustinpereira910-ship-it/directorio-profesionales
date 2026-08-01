export const metadata = {
  title: 'Términos y Condiciones — Vips',
};

export default function TerminosPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Términos y Condiciones</h1>
      <p className="text-graphite text-sm mb-10">Última actualización: agosto de 2026</p>

      <div className="space-y-8 text-graphite text-sm leading-relaxed">
        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">1. Qué es Vips</h2>
          <p>
            Vips (misvips.com) es un directorio en línea que conecta a personas que buscan
            servicios profesionales con profesionales independientes verificados. Vips no presta
            los servicios listados en la plataforma: actúa únicamente como intermediario de
            contacto entre el cliente y el profesional.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">2. Cuentas de usuario</h2>
          <p>
            Para publicar un perfil o gestionar tu publicación necesitás crear una cuenta con un
            email válido. Sos responsable de mantener la confidencialidad de tu contraseña y de
            toda la actividad que ocurra bajo tu cuenta. La información que proporciones (nombre,
            descripción, datos de contacto) debe ser veraz y actualizada.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">3. Publicación de perfiles</h2>
          <p>
            Todo perfil nuevo queda en estado &quot;pendiente de verificación&quot; hasta que Vips
            revise los datos y confirme el pago correspondiente. Vips se reserva el derecho de
            rechazar, suspender o eliminar cualquier perfil que contenga información falsa,
            incompleta, o que infrinja estos Términos o la legislación uruguaya vigente.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">4. Pagos y tarifas</h2>
          <p>
            La publicación de un perfil profesional tiene una tarifa fija mensual, sin comisión
            sobre los trabajos que el profesional realice a través de contactos generados en la
            plataforma. El pago puede hacerse por Mercado Pago o por transferencia bancaria
            (Scotiabank o Itaú, sujeto a revisión manual del comprobante). Los pagos no son
            reembolsables una vez que el perfil fue activado, salvo error atribuible a Vips.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">5. Responsabilidad</h2>
          <p>
            Vips no garantiza la calidad, idoneidad, legalidad ni resultado de los servicios
            prestados por los profesionales listados. La verificación de perfiles es un control
            razonable, no una certificación profesional ni una garantía de resultado. Cualquier
            acuerdo, pago o disputa entre cliente y profesional es responsabilidad exclusiva de
            ambas partes; Vips no interviene en esa relación ni es parte de esos contratos.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">6. Uso aceptable</h2>
          <p>
            No está permitido usar la plataforma para publicar información falsa, suplantar la
            identidad de terceros, ofrecer servicios ilegales, ni intentar vulnerar la seguridad
            del sitio. Vips puede suspender cuentas que incumplan esto sin previo aviso.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">7. Modificaciones</h2>
          <p>
            Vips puede modificar estos Términos, la tarifa o las funcionalidades del servicio en
            cualquier momento. Los cambios relevantes se comunicarán a través del sitio o por
            email.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">8. Ley aplicable</h2>
          <p>
            Estos Términos se rigen por las leyes de la República Oriental del Uruguay.
          </p>
        </section>

        <section>
          <h2 className="font-display font-semibold text-lg text-ink mb-2">9. Contacto</h2>
          <p>
            Para consultas sobre estos Términos, escribinos a{' '}
            <a href="mailto:hola@misvips.com" className="text-ink underline">hola@misvips.com</a>.
          </p>
        </section>
      </div>
    </div>
  );
}
