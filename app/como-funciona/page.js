export default function ComoFuncionaPage() {
  return (
    <div className="max-w-3xl mx-auto px-6 py-16">
      <h1 className="font-display font-bold text-3xl text-ink mb-10 text-center">Cómo funciona</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        <div>
          <p className="font-mono text-xs uppercase text-ochre mb-3">Para clientes</p>
          <ol className="space-y-3 text-graphite">
            <li>1. Buscás por categoría o zona.</li>
            <li>2. Revisás perfiles verificados.</li>
            <li>3. Contactás directo — sin intermediarios.</li>
          </ol>
        </div>
        <div>
          <p className="font-mono text-xs uppercase text-ochre mb-3">Para profesionales</p>
          <ol className="space-y-3 text-graphite">
            <li>1. Creás tu cuenta y publicás tu perfil.</li>
            <li>2. Pagás la tarifa fija (sin comisión después).</li>
            <li>3. Verificamos tus datos y quedás activo en el directorio.</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
