'use client';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SearchBar() {
  const router = useRouter();
  const [q, setQ] = useState('');

  function onSubmit(e) {
    e.preventDefault();
    router.push(`/buscar?q=${encodeURIComponent(q)}`);
  }

  return (
    <form onSubmit={onSubmit} className="flex flex-col sm:flex-row gap-3 w-full max-w-xl">
      <input
        type="text"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        placeholder="¿Qué necesitás? Ej: electricista en Punta del Este"
        className="flex-1 border-2 border-ink rounded-sm px-4 py-3 font-body text-graphite focus:outline-none focus:ring-2 focus:ring-ochre"
      />
      <button
        type="submit"
        className="bg-ink text-paper font-medium px-6 py-3 rounded-sm hover:bg-graphite transition-colors"
      >
        Buscar
      </button>
    </form>
  );
}
