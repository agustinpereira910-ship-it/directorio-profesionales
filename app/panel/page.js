'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

const ESTADO_LABEL = {
  pendiente_verificacion: 'Pendiente de verificación',
  activo: 'Activo',
  vencido: 'Vencido',
  rechazado: 'Rechazado',
};

export default function PanelPage() {
  const [perfil, setPerfil] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { setLoading(false); return; }
      const { data } = await supabase
        .from('profesionales')
        .select('*')
        .eq('user_id', user.id)
        .single();
      setPerfil(data);
      setLoading(false);
    }
    cargar();
  }, []);

  if (loading) return <div className="max-w-2xl mx-auto px-6 py-12 text-graphite">Cargando...</div>;

  if (!perfil) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-12 text-center">
        <p className="text-graphite mb-4">Todavía no publicaste tu perfil.</p>
        <Link href="/publicar" className="bg-ink text-paper px-5 py-3 rounded-sm inline-block">
          Publicar mi perfil
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl text-ink mb-6">Mi panel</h1>

      <div className="bg-card border-2 border-ink rounded-sm p-6">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-14 h-14 rounded-full bg-line flex items-center justify-center overflow-hidden shrink-0">
            {perfil.foto_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={perfil.foto_url} alt={perfil.nombre} className="w-full h-full object-cover" />
            ) : (
              <span className="text-ink font-display font-bold text-xl">{perfil.nombre?.charAt(0)}</span>
            )}
          </div>
          <div className="flex-1 flex items-center justify-between">
            <p className="font-display font-semibold text-xl text-ink">{perfil.nombre}</p>
            <span className="font-mono text-xs uppercase px-3 py-1 rounded-sm border-2 border-ink">
              {ESTADO_LABEL[perfil.estado]}
            </span>
          </div>
        </div>
        <p className="text-graphite mb-6">{perfil.descripcion}</p>

        <div className="flex gap-3 flex-wrap">
          {perfil.estado === 'pendiente_verificacion' && (
            <Link href="/panel/pago" className="bg-ochre text-paper font-medium px-5 py-3 rounded-sm inline-block">
              Completar pago para activar
            </Link>
          )}
          <Link href="/panel/editar" className="border-2 border-ink text-ink font-medium px-5 py-3 rounded-sm inline-block hover:bg-paper transition">
            Editar mi perfil
          </Link>
        </div>
      </div>
    </div>
  );
}
