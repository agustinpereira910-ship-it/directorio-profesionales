import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';

export const revalidate = 60;

// Normaliza números de WhatsApp uruguayos al formato internacional que
// entiende wa.me (598XXXXXXXX), sin importar cómo lo haya escrito el
// profesional (con 0 inicial, con o sin 598, con espacios/guiones).
function normalizarWhatsapp(numero) {
  let digitos = numero.replace(/\D/g, '');
  if (digitos.startsWith('598')) return digitos;
  if (digitos.startsWith('0')) digitos = digitos.slice(1);
  return `598${digitos}`;
}

async function getProfesional(slug) {
  const { data } = await supabase
    .from('profesionales')
    .select('*, categorias(nombre), zonas(nombre)')
    .eq('slug', slug)
    .eq('estado', 'activo')
    .single();

  return data;
}

export default async function PerfilProfesional({ params }) {
  const profesional = await getProfesional(params.slug);
  if (!profesional) notFound();

  const { nombre, descripcion, telefono, whatsapp, email, sitio_web, verificado, categorias, zonas, foto_url } = profesional;

  return (
    <div className="max-w-3xl mx-auto px-6 py-12">
      <div className="border-2 border-ink rounded-sm bg-card overflow-hidden">
        <div className="p-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-full bg-line flex items-center justify-center font-display font-bold text-xl text-ink overflow-hidden">
              {foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={foto_url} alt={nombre} className="w-full h-full object-cover" />
              ) : nombre?.charAt(0)}
            </div>
            <div>
              <h1 className="font-display font-bold text-2xl text-ink">{nombre}</h1>
              <p className="font-mono text-xs text-graphite">
                {categorias?.nombre} · {zonas?.nombre}
              </p>
            </div>
            {verificado && (
              <span className="stamp ml-auto border-2 border-verified text-verified text-xs font-mono font-bold uppercase px-3 py-1 rounded-sm">
                Verificado
              </span>
            )}
          </div>

          <p className="text-graphite mb-8">{descripcion}</p>

          <div className="ticket-edge border-t-2 border-dashed border-line mb-6" />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
            {telefono && <p><span className="font-mono text-xs text-graphite">TEL</span> {telefono}</p>}
            {whatsapp && <p><span className="font-mono text-xs text-graphite">WHATSAPP</span> {whatsapp}</p>}
            {email && <p><span className="font-mono text-xs text-graphite">EMAIL</span> {email}</p>}
            {sitio_web && <p><span className="font-mono text-xs text-graphite">WEB</span> {sitio_web}</p>}
          </div>

          {whatsapp && (
            <a
              href={`https://wa.me/${normalizarWhatsapp(whatsapp)}?text=${encodeURIComponent(
                `Hola ${nombre}, te encontré en Vips y quería consultarte por tus servicios.`
              )}`}
              target="_blank"
              rel="noreferrer"
              className="flex items-center justify-center gap-2 w-full bg-[#25D366] text-[#0B0A08] font-medium py-3 rounded-sm hover:brightness-95 transition"
            >
              <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2 22l5.29-1.39a9.9 9.9 0 0 0 4.75 1.21h.01c5.46 0 9.9-4.45 9.9-9.91C21.96 6.45 17.5 2 12.04 2zm5.8 14.02c-.24.68-1.4 1.3-1.93 1.38-.5.08-1.12.11-1.8-.11-.42-.13-.95-.31-1.64-.6-2.88-1.24-4.76-4.14-4.9-4.34-.14-.2-1.17-1.56-1.17-2.98s.75-2.12 1.02-2.41c.27-.29.58-.36.78-.36.2 0 .39 0 .56.01.18.01.42-.07.65.5.24.58.82 2 .89 2.15.07.15.12.32.02.52-.1.2-.15.32-.29.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.61.17.3.76 1.25 1.63 2.02 1.12 1 2.06 1.31 2.36 1.46.3.15.48.13.65-.08.18-.2.75-.87.95-1.17.2-.3.4-.25.68-.15.28.1 1.78.84 2.08.99.3.15.5.23.58.35.08.13.08.72-.16 1.4z"/>
              </svg>
              Escribir por WhatsApp
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
