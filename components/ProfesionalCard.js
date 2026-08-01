import Link from 'next/link';

export default function ProfesionalCard({ profesional }) {
  const {
    slug, nombre, descripcion, verificado, categoria_nombre, zona_nombre, foto_url,
  } = profesional;

  return (
    <Link
      href={`/profesional/${slug}`}
      className="block bg-card border-2 border-ink rounded-sm overflow-hidden hover:-translate-y-1 transition-transform relative"
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex gap-3 items-center">
            <div className="w-12 h-12 rounded-full bg-line flex items-center justify-center font-display font-bold text-ink overflow-hidden">
              {foto_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={foto_url} alt={nombre} className="w-full h-full object-cover" />
              ) : (
                nombre?.charAt(0)
              )}
            </div>
            <div>
              <p className="font-display font-semibold text-ink leading-tight">{nombre}</p>
              <p className="text-xs text-graphite font-mono">{categoria_nombre} · {zona_nombre}</p>
            </div>
          </div>

          {verificado && (
            <div className="stamp border-2 border-verified text-verified text-[10px] font-mono font-bold uppercase px-2 py-1 rounded-sm">
              Verificado
            </div>
          )}
        </div>

        <p className="text-sm text-graphite mt-3 line-clamp-2">{descripcion}</p>
      </div>
      <div className="ticket-edge border-t-2 border-dashed border-line" />
    </Link>
  );
}
