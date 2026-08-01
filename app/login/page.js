'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) { setError('Email o contraseña incorrectos.'); return; }
    router.push('/panel');
  }

  return (
    <div className="max-w-sm mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-2xl text-ink mb-6">Ingresar</h1>
      <form onSubmit={onSubmit} className="space-y-4 bg-card border-2 border-ink rounded-sm p-6">
        <input type="email" required placeholder="Email" value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-paper text-graphite border-2 border-line rounded-sm px-3 py-2 focus:outline-none focus:border-ink" />
        <input type="password" required placeholder="Contraseña" value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-paper text-graphite border-2 border-line rounded-sm px-3 py-2 focus:outline-none focus:border-ink" />
        {error && <p className="text-alert text-sm">{error}</p>}
        <button type="submit" className="w-full bg-ink text-paper font-medium py-3 rounded-sm hover:bg-graphite transition">
          Ingresar
        </button>
        <p className="text-sm text-graphite text-center">
          ¿No tenés cuenta? <Link href="/registro" className="text-ink underline">Registrate</Link>
        </p>
      </form>
    </div>
  );
}
