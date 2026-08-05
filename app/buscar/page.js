import { supabase } from '@/lib/supabaseClient';
import ProfesionalCard from '@/components/ProfesionalCard';
import SearchBar from '@/components/SearchBar';

export const revalidate = 60;

const RESULTADOS_POR_PAGINA = 24;

async function getResultados(q, zonaId, page) {
  let query = supabase
    .from('profesionales')
    .select('*, categorias(nombre), zonas(nombre)', { count: 'exact' })
    .eq('estado', 'activo');

  if (q) {
    // Escapamos , ( ) que son caracteres de sintaxis en el filtro .or() de PostgREST,
    // para que el texto de búsqueda no pueda alterar la estructura del filtro.
    const safeQ = q.replace(/[,()]/g, '');
    query = query.or(`nombre.ilike.%${safeQ}%,descripcion.ilike.%${safeQ}%`);
  }

  if (zonaId) {
    query = query.eq('zona_id', zonaId);
  }

  const from = (page - 1) * RESULTADOS_POR_PAGINA;
  const to = from + RESULTADOS_POR_PAGINA - 1;
  const { data, count } = await query
    .order('fecha_alta', { ascending: false })
    .range(from, to);

  const resultados = (data || []).map((p) => ({
    ...p,
    categoria_nombre: p.categorias?.nombre,
    zona_nombre: p.zonas?.nombre,
  }));

  return { resultados, total: count || 0 };
}

async function getFiltros() {
  const [{ data: categorias }, { data: zonas }] = await Promise.all([
    supabase.from('categorias').select('*').order('orden'),
    supabase.from('zonas').select('*'),
  ]);
  return { categorias: categorias || [], zonas: zonas || [] };
}

export default async function BuscarPage({ searchParams }) {
  const q = searchParams?.q || '';
  const zona = searchParams?.zona || '';
  const page = Math.max(1, parseInt(searchParams?.page, 10) || 1);
  const { resultados, total } = await getResultados(q, zona, page);
  const { categorias, zonas } = await getFiltros();
  const totalPaginas = Math.max(1, Math.ceil(total / RESULTADOS_POR_PAGINA));
  const qParam = q ? `&q=${encodeURIComponent(q)}` : '';
  const zonaParam = zona ? `&zona=${zona}` : '';

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl text-ink mb-6">Buscar profesionales</h1>

      <div className="mb-8">
        <SearchBar />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Filtros */}
        <aside className="md:col-span-1 space-y-6">
          <div>
            <p className="font-mono text-xs uppercase text-graphite mb-2">Categoría</p>
            <ul className="space-y-1 text-sm">
              {categorias.map((c) => (
                <li key={c.id}>
                  <a href={`/categorias/${c.slug}`} className="text-ink hover:underline">
                    {c.icono} {c.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="font-mono text-xs uppercase text-graphite">Zona</p>
              {zona && (
                <a href={`/buscar?${qParam.replace(/^&/, '')}`} className="text-xs text-alert hover:underline">
                  Quitar
                </a>
              )}
            </div>
            <ul className="space-y-1 text-sm">
              {zonas.map((z) => (
                <li key={z.id}>
                  <a
                    href={`/buscar?zona=${z.id}${qParam}`}
                    className={zona === z.id ? 'text-ink font-semibold underline' : 'text-graphite hover:text-ink'}
                  >
                    {z.nombre}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </aside>

        {/* Resultados */}
        <div className="md:col-span-3">
          {resultados.length === 0 ? (
            <p className="text-graphite">
              No encontramos profesionales{q ? ` para "${q}"` : ''} todavía. Volvé a intentar
              con otra búsqueda o categoría.
            </p>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                {resultados.map((p) => (
                  <ProfesionalCard key={p.id} profesional={p} />
                ))}
              </div>

              {totalPaginas > 1 && (
                <div className="flex items-center justify-center gap-4 mt-10 font-mono text-sm">
                  {page > 1 ? (
                    <a href={`/buscar?page=${page - 1}${qParam}${zonaParam}`} className="text-ink hover:underline">
                      ← Anterior
                    </a>
                  ) : (
                    <span className="text-line">← Anterior</span>
                  )}
                  <span className="text-graphite">Página {page} de {totalPaginas}</span>
                  {page < totalPaginas ? (
                    <a href={`/buscar?page=${page + 1}${qParam}${zonaParam}`} className="text-ink hover:underline">
                      Siguiente →
                    </a>
                  ) : (
                    <span className="text-line">Siguiente →</span>
                  )}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
