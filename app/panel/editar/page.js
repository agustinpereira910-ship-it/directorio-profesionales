'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';

export default function EditarPerfilPage() {
  const router = useRouter();
  const [userId, setUserId] = useState(null);
  const [form, setForm] = useState({
    nombre: '', descripcion: '', telefono: '', whatsapp: '', email: '',
  });
  const [fotoActual, setFotoActual] = useState(null);
  const [foto, setFoto] = useState(null);
  const [fotoPreview, setFotoPreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState('');
  const [guardado, setGuardado] = useState(false);

  useEffect(() => {
    async function cargar() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) { router.push('/login'); return; }
      setUserId(user.id);

      const { data } = await supabase
        .from('profesionales')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (data) {
        setForm({
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          telefono: data.telefono || '',
          whatsapp: data.whatsapp || '',
          email: data.email || '',
        });
        setFotoActual(data.foto_url || null);
      }
      setLoading(false);
    }
    cargar();
  }, [router]);

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
    setGuardando(true);
    setError('');
    setGuardado(false);

    let foto_url = fotoActual;
    if (foto) {
      const path = `${userId}/${Date.now()}-${foto.name}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('fotos-perfil')
        .upload(path, foto);

      if (uploadError) {
        setGuardando(false);
        setError('No pudimos subir la foto. Probá de nuevo.');
        return;
      }

      foto_url = supabase.storage.from('fotos-perfil').getPublicUrl(uploadData.path).data.publicUrl;
    }

    const { error: updateError } = await supabase
      .from('profesionales')
      .update({
        nombre: form.nombre,
        descripcion: form.descripcion,
        telefono: form.telefono,
        whatsapp: form.whatsapp,
        email: form.email,
        foto_url,
      })
      .eq('user_id', userId);

    setGuardando(false);

    if (updateError) {
      setError('Ocurrió un error al guardar los cambios. Probá de nuevo.');
      return;
    }

    setFotoActual(foto_url);
    setFoto(null);
    setFotoPreview(null);
    setGuardado(true);
  }

  if (loading) return <div className="max-w-xl mx-auto px-6 py-12 text-graphite">Cargando...</div>;

  return (
    <div className="max-w-xl mx-auto px-6 py-12">
      <h1 className="font-display font-bold text-3xl text-ink mb-8">Editar mi perfil</h1>

      <form onSubmit={onSubmit} className="space-y-5 bg-card border-2 border-ink rounded-sm p-6">
        <div>
          <label className="block text-sm font-medium text-ink mb-1">Foto de perfil</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-line flex items-center justify-center overflow-hidden shrink-0">
              {fotoPreview || fotoActual ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={fotoPreview || fotoActual} alt="Vista previa" className="w-full h-full object-cover" />
              ) : (
                <span className="text-ink font-display font-bold text-xl">{form.nombre?.charAt(0)}</span>
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
        {guardado && <p className="text-verified text-sm">Cambios guardados correctamente.</p>}

        <button
          type="submit"
          disabled={guardando}
          className="w-full bg-ink text-paper font-medium py-3 rounded-sm hover:bg-graphite transition disabled:opacity-50"
        >
          {guardando ? 'Guardando...' : 'Guardar cambios'}
        </button>
      </form>
    </div>
  );
}
