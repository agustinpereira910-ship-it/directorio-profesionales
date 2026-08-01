'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';

export default function AdminPage() {
  const [pendientes, setPendientes] = useState([]);
  const [pagosPendientes, setPagosPendientes] = useState([]);

  async function cargar() {
    const { data: profs } = await supabase
      .from('profesionales')
      .select('*')
      .eq('estado', 'pendiente_verificacion');
    setPendientes(profs || []);

    const { data: pagos } = await supabase
      .from('pagos')
      .select('*, profesionales(nombre)')
      .eq('estado', 'pendiente');

    const conComprobanteUrl = await Promise.all((pagos || []).map(async (pago) => {
      if (!pago.comprobante_url) return pago;
      const { data } = await supabase.storage
        .from('comprobantes')
        .createSignedUrl(pago.comprobante_url, 60 * 10);
      return { ...pago, comprobante_link: data?.signedUrl || null };
    }));
    setPagosPendientes(conComprobanteUrl);
  }

  useEffect(() => { cargar(); }, []);

  async function aprobarProfesional(id) {
    await supabase.from('profesionales')
      .update({ estado: 'activo', verificado: true })
      .eq('id', id);
    cargar();
  }

  async function rechazarProfesional(id) {
    await supabase.from('profesionales').update({ estado: 'rechazado' }).eq('id', id);
    cargar();
  }

  async function aprobarPago(id, profesionalId) {
    await supabase.from('pagos').update({ estado: 'aprobado' }).eq('id', id);
    await supabase.from('profesionales')
      .update({ estado: 'activo' })
      .eq('id', profesionalId);
    cargar();
  }

  async function rechazarPago(id) {
    await supabase.from('pagos').update({ estado: 'rechazado' }).eq('id', id);
    cargar();
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl text-ink mb-8">Panel de administración</h1>

      <section className="mb-12">
        <h2 className="font-display font-semibold text-xl text-ink mb-4">
          Profesionales pendientes de verificación ({pendientes.length})
        </h2>
        <div className="space-y-3">
          {pendientes.map((p) => (
            <div key={p.id} className="bg-card border-2 border-ink rounded-sm p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-ink">{p.nombre}</p>
                <p className="text-sm text-graphite">{p.descripcion}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => aprobarProfesional(p.id)} className="bg-verified text-white text-sm px-3 py-1 rounded-sm">Aprobar</button>
                <button onClick={() => rechazarProfesional(p.id)} className="bg-alert text-white text-sm px-3 py-1 rounded-sm">Rechazar</button>
              </div>
            </div>
          ))}
          {pendientes.length === 0 && <p className="text-graphite text-sm">No hay pendientes.</p>}
        </div>
      </section>

      <section>
        <h2 className="font-display font-semibold text-xl text-ink mb-4">
          Pagos por transferencia pendientes ({pagosPendientes.length})
        </h2>
        <div className="space-y-3">
          {pagosPendientes.map((pago) => (
            <div key={pago.id} className="bg-card border-2 border-ink rounded-sm p-4 flex items-center justify-between">
              <div>
                <p className="font-medium text-ink">{pago.profesionales?.nombre}</p>
                <p className="text-sm text-graphite font-mono">
                  {pago.metodo} · ${pago.monto}
                </p>
                {pago.comprobante_link ? (
                  <a
                    href={pago.comprobante_link}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs text-ink underline"
                  >
                    Ver comprobante
                  </a>
                ) : pago.comprobante_url ? (
                  <p className="text-xs text-alert">No se pudo generar el link del comprobante.</p>
                ) : null}
              </div>
              <div className="flex gap-2">
                <button onClick={() => aprobarPago(pago.id, pago.profesional_id)} className="bg-verified text-white text-sm px-3 py-1 rounded-sm">Aprobar</button>
                <button onClick={() => rechazarPago(pago.id)} className="bg-alert text-white text-sm px-3 py-1 rounded-sm">Rechazar</button>
              </div>
            </div>
          ))}
          {pagosPendientes.length === 0 && <p className="text-graphite text-sm">No hay pagos pendientes.</p>}
        </div>
      </section>
    </div>
  );
}
