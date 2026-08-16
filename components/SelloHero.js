// Ilustracion decorativa del hero: un sello circular de "verificado" con
// iconos de oficios alrededor, en la paleta dorado/negro del sitio. No es
// una foto de stock a proposito -- evita licencias y encaja mejor con la
// estetica de sello/certificado que ya usa el resto del diseño.
export default function SelloHero() {
  return (
    <svg viewBox="0 0 360 360" className="w-full max-w-sm" role="img" aria-label="Sello de profesionales verificados">
      <circle cx="180" cy="180" r="172" fill="none" stroke="#3A3226" strokeWidth="1" />
      <circle
        cx="180" cy="180" r="150"
        fill="none" stroke="#D4AF37" strokeWidth="2"
        strokeDasharray="2 10" strokeLinecap="round"
      />
      <circle cx="180" cy="180" r="128" fill="#151310" stroke="#D4AF37" strokeWidth="1.5" />

      <text
        x="180" y="108" textAnchor="middle"
        fill="#F0C674" fontSize="13" letterSpacing="3" fontFamily="'IBM Plex Mono', monospace"
      >
        PROFESIONALES
      </text>
      <text
        x="180" y="266" textAnchor="middle"
        fill="#F0C674" fontSize="13" letterSpacing="3" fontFamily="'IBM Plex Mono', monospace"
      >
        VERIFICADOS
      </text>

      <g transform="translate(180,195)">
        <circle r="46" fill="#0B0A08" stroke="#4FB37E" strokeWidth="2" />
        <path
          d="M -20,0 L -6,16 L 22,-16"
          fill="none" stroke="#4FB37E" strokeWidth="6"
          strokeLinecap="round" strokeLinejoin="round"
        />
      </g>

      {/* iconos de oficios alrededor del sello */}
      <g stroke="#D4AF37" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* llave inglesa */}
        <g transform="translate(180,72)">
          <path d="M -10,-8 a8,8 0 1 1 0,16 a8,8 0 0 1 0,-16 z" />
          <path d="M -4,6 L 12,22" />
        </g>
        {/* pincel */}
        <g transform="translate(272,140)">
          <path d="M -8,-10 L 8,6 L 2,12 L -14,-4 Z" />
          <path d="M 2,12 L -6,20" />
        </g>
        {/* lamparita */}
        <g transform="translate(272,220)">
          <circle cx="0" cy="-4" r="10" />
          <path d="M -5,6 L 5,6 M -3,11 L 3,11" />
        </g>
        {/* pala/destornillador */}
        <g transform="translate(180,288)">
          <path d="M 0,-14 L 0,10" />
          <path d="M -7,-14 L 7,-14" />
          <path d="M -5,14 L 5,18" />
        </g>
        {/* balde */}
        <g transform="translate(88,220)">
          <path d="M -9,-6 L 9,-6 L 6,10 L -6,10 Z" />
          <path d="M -9,-6 a 9,5 0 0 1 18,0" />
        </g>
        {/* casco */}
        <g transform="translate(88,140)">
          <path d="M -10,4 a 10,10 0 0 1 20,0 Z" />
          <path d="M -12,4 L 12,4" />
        </g>
      </g>
    </svg>
  );
}
