'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function Header() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      setUser(data.user);
      setCargando(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function cerrarSesion() {
    await supabase.auth.signOut();
    setUser(null);
    router.push('/');
    router.refresh();
  }

  return (
    <header className="border-b-2 border-ink bg-paper">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="font-display font-bold text-xl text-ink tracking-tight">
          Directorio<span className="text-ochre">.</span>
        </Link>
        <nav className="hidden md:flex gap-6 font-body text-sm text-graphite">
          <Link href="/buscar" className="hover:text-ink">Buscar profesionales</Link>
          <Link href="/categorias" className="hover:text-ink">Categorías</Link>
          <Link href="/como-funciona" className="hover:text-ink">Cómo funciona</Link>
          <Link href="/precios" className="hover:text-ink">Precios</Link>
        </nav>
        <div className="flex gap-3 items-center">
          {cargando ? null : user ? (
            <>
              <Link href="/panel" className="text-sm text-graphite hover:text-ink">Mi panel</Link>
              <button
                onClick={cerrarSesion}
                className="text-sm text-graphite hover:text-ink"
              >
                Cerrar sesión
              </button>
            </>
          ) : (
            <Link href="/login" className="text-sm text-graphite hover:text-ink">Ingresar</Link>
          )}
          <Link
            href="/publicar"
            className="bg-ink text-paper text-sm font-medium px-4 py-2 rounded-sm hover:bg-graphite transition-colors"
          >
            Publicar mi perfil
          </Link>
        </div>
      </div>
    </header>
  );
}
