import { supabase } from '@/lib/supabaseClient';
import ProfesionalCard from '@/components/ProfesionalCard';

const RESULTADOS_POR_PAGINA = 24;

async function getCategoria(slug) {
  const { data } = await supabase.from('categorias').select('*').eq('slug', slug).single();
  return data;
}

async function getProfesionales(categoriaId, page) {
  const from = (page - 1) * RESULTADOS_POR_PAGINA;
  const to = from + RESULTADOS_POR_PAGINA - 1;

  const { data, count } = await supabase
    .from('profesionales')
    .select('*, categorias(nombre), zonas(nombre)', { count: 'exact' })
    .eq('categoria_id', categoriaId)
    .eq('estado', 'activo')
    .order('fecha_alta', { ascending: false })
    .range(from, to);

  const profesionales = (data || []).map((p) => ({
    ...p,
    categoria_nombre: p.categorias?.nombre,
    zona_nombre: p.zonas?.nombre,
  }));

  return { profesionales, total: count || 0 };
}

export default async function CategoriaPage({ params, searchParams }) {
  const page = Math.max(1, parseInt(searchParams?.page, 10) || 1);
  const categoria = await getCategoria(params.categoria);
  const { profesionales, total } = categoria
    ? await getProfesionales(categoria.id, page)
    : { profesionales: [], total: 0 };
  const totalPaginas = Math.max(1, Math.ceil(total / RESULTADOS_POR_PAGINA));

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl text-ink mb-8">
        {categoria?.icono} {categoria?.nombre || 'Categoría'}
      </h1>
      {profesionales.length === 0 ? (
        <p className="text-graphite">Todavía no hay profesionales activos en esta categoría.</p>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {profesionales.map((p) => <ProfesionalCard key={p.id} profesional={p} />)}
          </div>

          {totalPaginas > 1 && (
            <div className="flex items-center justify-center gap-4 mt-10 font-mono text-sm">
              {page > 1 ? (
                <a href={`/categorias/${params.categoria}?page=${page - 1}`} className="text-ink hover:underline">
                  ← Anterior
                </a>
              ) : (
                <span className="text-line">← Anterior</span>
              )}
              <span className="text-graphite">Página {page} de {totalPaginas}</span>
              {page < totalPaginas ? (
                <a href={`/categorias/${params.categoria}?page=${page + 1}`} className="text-ink hover:underline">
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
  );
}
