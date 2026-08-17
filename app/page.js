import Link from 'next/link';
import SearchBar from '@/components/SearchBar';
import { supabase } from '@/lib/supabaseClient';
import ProfesionalCard from '@/components/ProfesionalCard';

export const revalidate = 60;

async function getCategorias() {
  const { data } = await supabase.from('categorias').select('*').order('orden').limit(6);
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
        <div className="max-w-6xl mx-auto px-6 py-16 md:py-20 grid md:grid-cols-[1.2fr_1fr] gap-12 items-center">
          <div className="text-center md:text-left">
            <p className="font-mono text-xs uppercase tracking-widest text-ochre mb-4">
              Sin comisión · Tarifa fija · Profesionales verificados
            </p>
            <h1 className="font-display font-bold text-4xl md:text-6xl text-ink leading-tight mb-6">
              Encontrá al profesional
              <br /> que necesitás, hoy.
            </h1>
            <p className="text-graphite max-w-xl mx-auto md:mx-0 mb-8">
              Un directorio de profesionales independientes verificados. Contactás directo,
              sin intermediarios ni comisiones sobre tu trabajo.
            </p>
            <div className="flex justify-center md:justify-start">
              <SearchBar />
            </div>
          </div>

          <div className="hidden md:block">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/hero-directorio.jpg"
              alt="Acuerdo profesional"
              className="w-full rounded-sm border-2 border-ink object-cover"
            />
          </div>
        </div>
      </section>

      {/* CATEGORIAS DESTACADAS */}
      <section className="max-w-6xl mx-auto px-6 py-16">
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display font-semibold text-2xl text-ink">Categorías destacadas</h2>
          <Link href="/categorias" className="text-sm text-graphite hover:text-ink">Ver todas →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {categorias.map((cat) => (
            <Link
              key={cat.id}
              href={`/categorias/${cat.slug}`}
              className="relative border-2 border-ink rounded-sm p-5 bg-card hover:bg-paper transition-colors flex items-center gap-3"
            >
              <span className="absolute -top-2 -right-2 bg-ochre text-paper text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm">
                Destacado
              </span>
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
        <div className="max-w-6xl mx-auto px-6 py-16 grid md:grid-cols-2 gap-10 items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/corporativa.jpg"
            alt="Equipo de profesionales trabajando"
            className="w-full rounded-sm border-2 border-paper/30 object-cover"
          />
          <div className="text-center md:text-left">
            <h2 className="font-display font-bold text-2xl md:text-3xl text-paper mb-4">
              ¿Sos profesional independiente?
            </h2>
            <p className="text-paper/80 mb-8 max-w-lg mx-auto md:mx-0">
              Publicá tu perfil por una tarifa fija. Sin comisión sobre lo que ganes.
            </p>
            <Link
              href="/publicar"
              className="inline-block bg-ochre text-paper font-medium px-6 py-3 rounded-sm hover:brightness-95 transition"
            >
              Publicar mi perfil
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
