'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

function slugify(text) {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

export default function PublicarPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    nombre: '', descripcion: '', telefono: '', whatsapp: '', email: '',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      setError('Necesitás crear una cuenta antes de publicar tu perfil.');
      setLoading(false);
      router.push('/registro');
      return;
    }

    const slug = `${slugify(form.nombre)}-${Math.random().toString(36).slice(2, 6)}`;

    const { error: insertError } = await supabase.from('profesionales').insert({
      user_id: user.id,
      nombre: form.nombre,
      slug,
      descripcion: form.descripcion,
      telefono: form.telefono,
      whatsapp: form.whatsapp,
      email: form.email,
      estado: 'pendiente_verificacion',
    });

    setLoading(false);

    if (insertError) {
      setError('Ocurrió un error al guardar tu perfil. Probá de nuevo.');
      return;
    }

    router.push('/panel/pago');
  }

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl text-ink mb-2">Publicá tu perfil</h1>
      <p className="text-graphite mb-8">
        Completá tus datos. Tu perfil queda pendiente de verificación hasta que confirmemos
        el pago y tus datos.
      </p>

      <form onSubmit={onSubmit} className="space-y-5 bg-white border-2 border-ink rounded-sm p-6">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Nombre completo</label>
          <input
            required
            value={form.nombre}
            onChange={(e) => update('nombre', e.target.value)}
            className="w-full border-2 border-line rounded-sm px-3 py-2 focus:outline-none focus:border-ink"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Descripción de tu servicio</label>
          <textarea
            required
            rows={4}
            value={form.descripcion}
            onChange={(e) => update('descripcion', e.target.value)}
            className="w-full border-2 border-line rounded-sm px-3 py-2 focus:outline-none focus:border-ink"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Teléfono</label>
            <input
              value={form.telefono}
              onChange={(e) => update('telefono', e.target.value)}
              className="w-full border-2 border-line rounded-sm px-3 py-2 focus:outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">WhatsApp</label>
            <input
              value={form.whatsapp}
              onChange={(e) => update('whatsapp', e.target.value)}
              className="w-full border-2 border-line rounded-sm px-3 py-2 focus:outline-none focus:border-ink"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Email de contacto</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="w-full border-2 border-line rounded-sm px-3 py-2 focus:outline-none focus:border-ink"
          />
        </div>

        {error && <p className="text-alert text-sm">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-ink text-paper font-medium py-3 rounded-sm hover:bg-graphite transition disabled:opacity-50"
        >
          {loading ? 'Guardando...' : 'Continuar al pago'}
        </button>
      </form>
    </div>
  );
}
