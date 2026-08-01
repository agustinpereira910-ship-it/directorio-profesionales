'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function RegistroPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [enviado, setEnviado] = useState(false);

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) { setError(error.message); return; }
    setEnviado(true);
  }

  if (enviado) {
    return (
      <div className="max-w-sm mx-auto px-6 py-16 text-center">
        <p className="text-verified font-medium">
          Revisá tu email para confirmar tu cuenta y después iniciá sesión.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Crear cuenta</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-card border-2 border-ink rounded-sm p-6">
        <input type="email" required placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-paper text-graphite border-2 border-line rounded-sm px-3 py-2 focus:outline-none focus:border-ink" />
        <input type="password" required placeholder="Contraseña" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-paper text-graphite border-2 border-line rounded-sm px-3 py-2 focus:outline-none focus:border-ink" />
        {error && <p className="text-alert text-sm">{error}</p>}
        <button type="submit" className="w-full bg-ink text-paper font-medium py-3 rounded-sm hover:bg-graphite transition">
          Crear cuenta
        </button>
        <p className="text-sm text-graphite text-center">
          ¿Ya tenés cuenta? <Link href="/login" className="text-ink underline">Ingresá</Link>
        </p>
      </form>
    </div>
  );
}
