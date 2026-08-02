import Link from 'next/link';
import { PLAN_MONTO } from '@/lib/planes';
import { LogoMercadoPago, LogoScotiabank, LogoItau } from '@/components/LogosPago';

export default function PreciosPage() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-16 text-center">
      <h1 className="font-display font-bold text-3xl text-ink mb-4">Precios</h1>
      <p className="text-graphite mb-10">Sin comisión sobre tus trabajos. Pagás una tarifa fija y listo.</p>

      <div className="bg-card border-2 border-ink rounded-sm p-8 inline-block">
        <p className="font-mono text-xs uppercase text-ochre mb-2">Publicación mensual</p>
        <p className="font-display font-bold text-4xl text-ink mb-4">${PLAN_MONTO} <span className="text-base font-body text-graphite">UYU / mes</span></p>
        <ul className="text-left text-graphite text-sm space-y-2 mb-6">
          <li>✓ Perfil verificado en el directorio</li>
          <li>✓ Contacto directo por WhatsApp, teléfono o email</li>
          <li>✓ Aparecés en búsquedas por categoría y zona</li>
          <li>✓ 0% de comisión sobre lo que factures</li>
        </ul>
        <Link href="/publicar" className="bg-ink text-paper font-medium px-6 py-3 rounded-sm inline-block hover:bg-graphite transition">
          Publicar mi perfil
        </Link>

        <div className="mt-6 pt-6 border-t border-line">
          <p className="font-mono text-xs uppercase text-graphite mb-3">Medios de pago aceptados</p>
          <div className="flex justify-center gap-3">
            <LogoMercadoPago className="w-9 h-9 rounded-sm" />
            <LogoScotiabank className="w-9 h-9 rounded-sm" />
            <LogoItau className="w-9 h-9 rounded-sm" />
          </div>
        </div>
      </div>
    </div>
  );
}
