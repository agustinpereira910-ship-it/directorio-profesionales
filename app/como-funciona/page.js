import Link from 'next/link';

const PASOS_CLIENTES = [
  { icono: '🔍', titulo: 'Buscás', texto: 'Por categoría o zona, en segundos.' },
  { icono: '✅', titulo: 'Revisás', texto: 'Perfiles verificados por nosotros, con reseñas y datos reales.' },
  { icono: '💬', titulo: 'Contactás', texto: 'Directo por WhatsApp, teléfono o email — sin intermediarios.' },
];

const PASOS_PROFESIONALES = [
  { icono: '📝', titulo: 'Publicás', texto: 'Creás tu cuenta y cargás tu perfil con tus datos y foto.' },
  { icono: '💳', titulo: 'Pagás', texto: 'Una tarifa fija mensual. Sin comisión sobre lo que factures después.' },
  { icono: '🏅', titulo: 'Quedás activo', texto: 'Verificamos tus datos y aparecés en el directorio.' },
];

const VENTAJAS = [
  { icono: '🚫💰', titulo: '0% de comisión', texto: 'Lo que cobrás por tu trabajo es todo tuyo. Nunca te descontamos nada de tus ingresos.' },
  { icono: '🛡️', titulo: 'Perfiles verificados', texto: 'Revisamos cada perfil antes de activarlo, para que los clientes contacten con confianza.' },
  { icono: '⚡', titulo: 'Contacto directo', texto: 'Sin chats intermediarios ni comisiones por mensaje — hablás directo con la persona.' },
];

export default function ComoFuncionaPage() {
  return (
    <div>
      {/* HERO */}
      <section className="border-b-2 border-ink bg-paper">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ochre mb-4">
            Simple, directo, sin vueltas
          </p>
          <h1 className="font-display font-bold text-4xl md:text-5xl text-ink leading-tight mb-4">
            Cómo funciona Vips
          </h1>
          <p className="text-graphite max-w-xl mx-auto">
            Un directorio pensado para que clientes y profesionales se encuentren rápido,
            sin intermediarios y sin comisiones ocultas.
          </p>
        </div>
      </section>

      {/* PASOS */}
      <section className="max-w-5xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          <div>
            <p className="font-mono text-xs uppercase text-ochre mb-4">Para clientes</p>
            <div className="space-y-4">
              {PASOS_CLIENTES.map((p, i) => (
                <div key={i} className="flex gap-4 bg-card border-2 border-ink rounded-sm p-4">
                  <span className="text-3xl leading-none">{p.icono}</span>
                  <div>
                    <p className="font-display font-semibold text-ink mb-1">{i + 1}. {p.titulo}</p>
                    <p className="text-graphite text-sm">{p.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div>
            <p className="font-mono text-xs uppercase text-ochre mb-4">Para profesionales</p>
            <div className="space-y-4">
              {PASOS_PROFESIONALES.map((p, i) => (
                <div key={i} className="flex gap-4 bg-card border-2 border-ink rounded-sm p-4">
                  <span className="text-3xl leading-none">{p.icono}</span>
                  <div>
                    <p className="font-display font-semibold text-ink mb-1">{i + 1}. {p.titulo}</p>
                    <p className="text-graphite text-sm">{p.texto}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* VENTAJAS */}
      <section className="border-y-2 border-ink bg-card">
        <div className="max-w-5xl mx-auto px-6 py-16">
          <h2 className="font-display font-semibold text-2xl text-ink text-center mb-10">
            ¿Por qué Vips?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {VENTAJAS.map((v, i) => (
              <div key={i} className="text-center">
                <div className="text-4xl mb-3">{v.icono}</div>
                <p className="font-display font-semibold text-ink mb-2">{v.titulo}</p>
                <p className="text-graphite text-sm">{v.texto}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-ink">
        <div className="max-w-4xl mx-auto px-6 py-16 text-center flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/buscar"
            className="bg-paper text-ink font-medium px-6 py-3 rounded-sm hover:brightness-95 transition"
          >
            Buscar un profesional
          </Link>
          <Link
            href="/publicar"
            className="bg-ochre text-paper font-medium px-6 py-3 rounded-sm hover:brightness-95 transition"
          >
            Publicar mi perfil
          </Link>
        </div>
      </section>
    </div>
  );
}
