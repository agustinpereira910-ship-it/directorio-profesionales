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
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  function onFotoChange(e) {
    const file = e.target.files[0] || null;
    setFoto(file);
    setFotoPreview(file ? URL.createObjectURL(file) : null);
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

    let foto_url = null;
    if (foto) {
      const path = `${user.id}/${Date.now()}-${foto.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fotos-perfil')
        .upload(path, foto);

      if (uploadError) {
        setLoading(false);
        setError('No pudimos subir la foto. Probá de nuevo o continuá sin foto.');
        return;
      }

      foto_url = supabase.storage.from('fotos-perfil').getPublicUrl(uploadData.path).data.publicUrl;
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
      foto_url,
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

      <form onSubmit={onSubmit} className="space-y-5 bg-card border-2 border-ink rounded-sm p-6">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Foto de perfil (opcional)</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-line flex items-center justify-center overflow-hidden shrink-0">
              {fotoPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fotoPreview} alt="Vista previa" className="w-full h-full object-cover" />
              ) : (
                <span className="text-ink font-display font-bold text-xl">?</span>
              )}
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={onFotoChange}
              className="w-full text-sm text-graphite"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Nombre completo</label>
          <input
            required
            value={form.nombre}
            onChange={(e) => update('nombre', e.target.value)}
            className="w-full bg-paper text-graphite border-2 border-line rounded-sm px-3 py-2 focus:outline-none focus:border-ink"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Descripción de tu servicio</label>
          <textarea
            required
            rows={4}
            value={form.descripcion}
            onChange={(e) => update('descripcion', e.target.value)}
            className="w-full bg-paper text-graphite border-2 border-line rounded-sm px-3 py-2 focus:outline-none focus:border-ink"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-ink mb-1">Teléfono</label>
            <input
              value={form.telefono}
              onChange={(e) => update('telefono', e.target.value)}
              className="w-full bg-paper text-graphite border-2 border-line rounded-sm px-3 py-2 focus:outline-none focus:border-ink"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-ink mb-1">WhatsApp</label>
            <input
              value={form.whatsapp}
              onChange={(e) => update('whatsapp', e.target.value)}
              placeholder="099 123 456"
              className="w-full bg-paper text-graphite border-2 border-line rounded-sm px-3 py-2 focus:outline-none focus:border-ink"
            />
            <p className="text-xs text-graphite mt-1">Con o sin 598, lo normalizamos solos.</p>
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-ink mb-1">Email de contacto</label>
          <input
            type="email"
            value={form.email}
            onChange={(e) => update('email', e.target.value)}
            className="w-full bg-paper text-graphite border-2 border-line rounded-sm px-3 py-2 focus:outline-none focus:border-ink"
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
