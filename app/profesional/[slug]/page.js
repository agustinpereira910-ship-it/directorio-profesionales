import { supabase } from '@/lib/supabaseClient';
import { notFound } from 'next/navigation';

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
      <div className="border-2 border-ink rounded-sm bg-white overflow-hidden">
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

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
            {telefono && <p><span className="font-mono text-xs text-graphite">TEL</span> {telefono}</p>}
            {whatsapp && <p><span className="font-mono text-xs text-graphite">WHATSAPP</span> {whatsapp}</p>}
            {email && <p><span className="font-mono text-xs text-graphite">EMAIL</span> {email}</p>}
            {sitio_web && <p><span className="font-mono text-xs text-graphite">WEB</span> {sitio_web}</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
