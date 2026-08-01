import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t-2 border-ink mt-20 bg-paper">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
        <div>
          <p className="font-display font-bold text-ink mb-2">Vips.</p>
          <p className="text-graphite">
            Profesionales verificados, tarifa fija, sin comisión sobre tus trabajos.
          </p>
        </div>
        <div>
          <p className="font-medium text-ink mb-2">Para clientes</p>
          <ul className="space-y-1 text-graphite">
            <li><Link href="/buscar" className="hover:text-ink">Buscar un profesional</Link></li>
            <li><Link href="/categorias" className="hover:text-ink">Ver categorías</Link></li>
          </ul>
        </div>
        <div>
          <p className="font-medium text-ink mb-2">Para profesionales</p>
          <ul className="space-y-1 text-graphite">
            <li><Link href="/publicar" className="hover:text-ink">Publicar mi perfil</Link></li>
            <li><Link href="/precios" className="hover:text-ink">Ver precios</Link></li>
            <li><Link href="/contacto" className="hover:text-ink">Contacto</Link></li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
