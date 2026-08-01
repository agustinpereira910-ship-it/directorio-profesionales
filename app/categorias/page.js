import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export const revalidate = 60;

export default async function CategoriasPage() {
  const { data: categorias } = await supabase.from('categorias').select('*').order('orden');

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl text-ink mb-8">Categorías</h1>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {(categorias || []).map((cat) => (
          <Link
            key={cat.id}
            href={`/categorias/${cat.slug}`}
            className="relative border-2 border-ink rounded-sm p-6 bg-card hover:bg-paper transition-colors flex items-center gap-3"
          >
            {cat.orden <= 6 && (
              <span className="absolute -top-2 -right-2 bg-ochre text-paper text-[10px] font-mono font-bold uppercase px-2 py-0.5 rounded-sm">
                Destacado
              </span>
            )}
            <span className="text-2xl">{cat.icono}</span>
            <span className="font-medium text-ink">{cat.nombre}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
