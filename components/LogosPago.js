// Logos oficiales de cada marca (descargados de Wikimedia Commons, fuente libre
// para uso de identificación). Los tres van en una tarjeta blanca chica y pareja
// (mismo alto, mismo padding) para que se vean prolijos y consistentes entre sí,
// sin importar que el archivo original de cada uno tenga una forma distinta.

function Chip({ src, alt, className, padX = 'px-3' }) {
  return (
    <div className={`bg-white rounded-md ${padX} py-2 flex items-center justify-center shrink-0 ${className || ''}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="h-full w-auto max-w-full object-contain" />
    </div>
  );
}

export function LogoMercadoPago({ className }) {
  return <Chip src="/logo-mercadopago.svg" alt="Mercado Pago" className={className} />;
}

export function LogoScotiabank({ className }) {
  return <Chip src="/logo-scotiabank.svg" alt="Scotiabank" className={className} />;
}

export function LogoItau({ className }) {
  return <Chip src="/logo-itau.svg" alt="Itaú" className={className} padX="px-2" />;
}
