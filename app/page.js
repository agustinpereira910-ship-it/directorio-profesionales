import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import { supabase } from '@/lib/supabaseClient';
import ProfesionalCard from '@/components/ProfesionalCard';

async function getCategorias() {
  const { data } = await supabase.from('categorias').select('*').limit(6);
  return data || [];
}

async function getDestacados() {
  const { data } = await supabase
    .from('profesionales')
    .select('*, categorias(nombre), zonas(nombre)')
    .eq('estado', 'activo')
    .limit(3);

  return (data || []).map((p) => ({
    ...p,
    categoria_nombre: p.categorias?.nombre,
    zona_nombre: p.zonas?.nombre,
  }));
}

export default async function Home() {
  const categorias = await getCategorias();
  const destacados = await getDestacados();

  return (
    <div>
      {/* HERO */}
      <section className="border-b-2 border-ink bg-paper">
        <div className="max-w-6xl mx-auto px-6 py-20 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-ochre mb-4">
            Sin comisión · Tarifa fija · Profesionales verificados
          </p>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-ink leading-tight mb-6">
            Encontrá al profesional
            <br /> que necesitás, hoy.
          </h1>
          <p className="text-graphite max-w-xl mx-auto mb-8">
            Un directorio de profesionales independientes verificados. Contactás directo,
            sin intermediarios ni comisiones sobre tu trabajo.
          </p>
          <div className="flex justify-center">
            <SearchBar />
          </div>
        </div>
      </section>

      {/* CATEGORIAS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <h2 className="font-display font-semibold text-2xl text-ink mb-6">Categorías</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categorias.map((cat) => (
            <Link
              key={cat.id}
              href={`/categorias/${cat.slug}`}
              className="border-2 border-ink rounded-sm p-5 bg-card hover:bg-paper transition-colors flex items-center gap-3"
            >
              <span className="text-2xl">{cat.icono}</span>
              <span className="font-medium text-ink">{cat.nombre}</span>
            </Link>
          ))}
        </div>
      </section>

      {/* DESTACADOS */}
      {destacados.length > 0 && (
        <section className="max-w-6xl mx-auto px-6 py-16">
          <h2 className="font-display font-semibold text-2xl text-ink mb-6">Profesionales destacados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {destacados.map((p) => (
              <ProfesionalCard key={p.id} profesional={p} />
            ))}
          </div>
        </section>
      )}

      {/* CTA profesionales */}
      <section className="border-t-2 border-ink bg-ink">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center">
          <h2 className="font-display font-bold text-2xl md:text-3xl text-paper mb-4">
            ¿Sos profesional independiente?
          </h2>
          <p className="text-paper/80 mb-8 max-w-lg mx-auto">
            Publicá tu perfil por una tarifa fija. Sin comisión sobre lo que ganes.
          </p>
          <Link
            href="/publicar"
            className="inline-block bg-ochre text-paper font-medium px-6 py-3 rounded-sm hover:brightness-95 transition"
          >
            Publicar mi perfil
          </Link>
        </div>
      </section>
    </div>
  );
}
