'use client';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { PLAN_MONTO, PLAN_MONTO_MERCADOPAGO } from '@/lib/planes';
import { LogoMercadoPago, LogoScotiabank, LogoItau } from '@/components/LogosPago';

const LOGOS = {
  mercado_pago: LogoMercadoPago,
  scotiabank: LogoScotiabank,
  itau: LogoItau,
};

const ETIQUETAS = {
  mercado_pago: 'Mercado Pago',
  scotiabank: 'Scotiabank',
  itau: 'Itaú',
};

export default function PagoPage() {
  const [metodo, setMetodo] = useState('mercado_pago');
  const [comprobante, setComprobante] = useState(null);
  const [enviado, setEnviado] = useState(false);
  const [loading, setLoading] = useState(false);
  const [profesionalId, setProfesionalId] = useState(null);
  const [errorComprobante, setErrorComprobante] = useState('');

  useEffect(() => {
    async function cargarProfesional() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;
      const { data } = await supabase
        .from('profesionales')
        .select('id')
        .eq('user_id', user.id)
        .single();
      setProfesionalId(data?.id || null);
    }
    cargarProfesional();
  }, []);

  async function pagarConMercadoPago() {
    if (!profesionalId) return;
    setLoading(true);
    // Crea una suscripción mensual recurrente en Mercado Pago (Preapproval API).
    // Ver app/api/mercadopago/suscripcion/route.js — necesita MERCADOPAGO_ACCESS_TOKEN.
    const { data: { session } } = await supabase.auth.getSession();
    const res = await fetch('/api/mercadopago/suscripcion', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session?.access_token}`,
      },
      body: JSON.stringify({ profesional_id: profesionalId }),
    });
    const { init_point } = await res.json();
    setLoading(false);
    if (init_point) window.location.href = init_point;
  }

  async function enviarComprobante(e) {
    e.preventDefault();
    setLoading(true);
    setErrorComprobante('');

    const { data: { user } } = await supabase.auth.getUser();
    const { data: profesional } = await supabase
      .from('profesionales')
      .select('id')
      .eq('user_id', user.id)
      .single();

    const path = `${user.id}/${Date.now()}-${comprobante.name}`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('comprobantes')
      .upload(path, comprobante);

    if (uploadError) {
      setLoading(false);
      setErrorComprobante('No pudimos subir el comprobante. Probá de nuevo en unos minutos.');
      return;
    }

    const { error: insertError } = await supabase.from('pagos').insert({
      profesional_id: profesional.id,
      metodo,
      monto: PLAN_MONTO,
      estado: 'pendiente',
      comprobante_url: uploadData.path,
    });

    setLoading(false);

    if (insertError) {
      setErrorComprobante('No pudimos registrar el pago. Probá de nuevo.');
      return;
    }

    setEnviado(true);
  }

  const cuentaTexto = metodo === 'scotiabank'
    ? process.env.NEXT_PUBLIC_SCOTIA_CUENTA
    : process.env.NEXT_PUBLIC_ITAU_CUENTA;

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Activar publicación</h1>
      <p className="text-graphite mb-8">
        Tarifa fija: <strong>${metodo === 'mercado_pago' ? PLAN_MONTO_MERCADOPAGO : PLAN_MONTO} UYU</strong>
        {' '}— sin comisión sobre tus trabajos.
        {metodo === 'mercado_pago' && (
          <span className="block text-xs mt-1">
            Incluye el recargo de Mercado Pago (${PLAN_MONTO} + 10%). Pagando por transferencia
            el monto es ${PLAN_MONTO} UYU.
          </span>
        )}
      </p>

      <div className="flex gap-3 mb-6">
        {['mercado_pago', 'scotiabank', 'itau'].map((m) => {
          const Logo = LOGOS[m];
          return (
            <button
              key={m}
              onClick={() => setMetodo(m)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm border-2 text-sm font-medium transition ${
                metodo === m ? 'border-ink bg-ink text-paper' : 'border-line text-graphite'
              }`}
            >
              <Logo className="h-6" />
              {ETIQUETAS[m]}
            </button>
          );
        })}
      </div>

      <div className="bg-card border-2 border-ink rounded-sm p-6">
        {metodo === 'mercado_pago' && (
          <div>
            <p className="text-graphite mb-4">
              Autorizás una suscripción mensual: se te cobra automáticamente cada mes y tu
              publicación se activa sola. Podés cancelarla cuando quieras desde tu cuenta de
              Mercado Pago.
            </p>
            <button
              onClick={pagarConMercadoPago}
              disabled={loading || !profesionalId}
              className="w-full flex items-center justify-center gap-2 bg-ink text-paper font-medium py-3 rounded-sm hover:bg-graphite transition disabled:opacity-50"
            >
              <LogoMercadoPago className="h-7" />
              {loading ? 'Redirigiendo...' : 'Suscribirme con Mercado Pago'}
            </button>
          </div>
        )}

        {(metodo === 'scotiabank' || metodo === 'itau') && !enviado && (
          <form onSubmit={enviarComprobante}>
            <p className="text-graphite mb-4">
              Transferí a la siguiente cuenta y subí el comprobante. Tu publicación se activa
              cuando lo revisemos (normalmente en el día). Como no es un cobro automático, te
              vamos a avisar por email unos días antes de que venza el mes para que renueves.
            </p>
            <div className="bg-paper border-2 border-dashed border-line rounded-sm p-4 font-mono text-sm mb-4">
              {cuentaTexto}
            </div>
            <label className="block text-sm font-medium text-ink mb-1">Subir comprobante</label>
            <input
              type="file"
              accept="image/*,application/pdf"
              onChange={(e) => setComprobante(e.target.files[0])}
              required
              className="w-full mb-4 text-sm"
            />
            {errorComprobante && <p className="text-alert text-sm mb-4">{errorComprobante}</p>}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-ink text-paper font-medium py-3 rounded-sm hover:bg-graphite transition disabled:opacity-50"
            >
              {loading ? 'Enviando...' : 'Enviar comprobante'}
            </button>
          </form>
        )}

        {enviado && (
          <p className="text-verified font-medium">
            Recibimos tu comprobante. Te avisamos por email cuando tu publicación quede activa.
          </p>
        )}
      </div>
    </div>
  );
}
