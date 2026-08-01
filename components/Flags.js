export function FlagPY({ className }) {
  return (
    <svg viewBox="0 0 30 20" className={className} role="img" aria-label="Paraguay">
      <rect width="30" height="20" fill="#0038A8" />
      <rect width="30" height="13.34" fill="#FFFFFF" />
      <rect width="30" height="6.67" fill="#D52B1E" />
      <circle cx="15" cy="10" r="3.4" fill="#FFFFFF" stroke="#0038A8" strokeWidth="0.4" />
      <path
        d="M15 7.6l0.62 1.9h2l-1.62 1.18 0.62 1.9-1.62-1.18-1.62 1.18 0.62-1.9-1.62-1.18h2z"
        fill="#FFCE00"
      />
    </svg>
  );
}

export function FlagUY({ className }) {
  const stripeH = 20 / 9;
  return (
    <svg viewBox="0 0 30 20" className={className} role="img" aria-label="Uruguay">
      <rect width="30" height="20" fill="#FFFFFF" />
      {[1, 3, 5, 7].map((i) => (
        <rect key={i} y={i * stripeH} width="30" height={stripeH} fill="#0038A8" />
      ))}
      <rect width="11" height={stripeH * 5} fill="#FFFFFF" />
      <circle cx="5.5" cy={stripeH * 2.5} r="2.3" fill="#FCD116" />
      {Array.from({ length: 8 }).map((_, i) => {
        const angle = (i * 45 * Math.PI) / 180;
        const x1 = 5.5 + Math.cos(angle) * 2.6;
        const y1 = stripeH * 2.5 + Math.sin(angle) * 2.6;
        const x2 = 5.5 + Math.cos(angle) * 3.6;
        const y2 = stripeH * 2.5 + Math.sin(angle) * 3.6;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#FCD116" strokeWidth="0.5" />;
      })}
    </svg>
  );
}

export function FlagAR({ className }) {
  return (
    <svg viewBox="0 0 30 20" className={className} role="img" aria-label="Argentina">
      <rect width="30" height="20" fill="#FFFFFF" />
      <rect width="30" height="6.67" fill="#75AADB" />
      <rect y="13.33" width="30" height="6.67" fill="#75AADB" />
      <circle cx="15" cy="10" r="2.4" fill="#F6B40E" stroke="#85340A" strokeWidth="0.3" />
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 22.5 * Math.PI) / 180;
        const x1 = 15 + Math.cos(angle) * 2.9;
        const y1 = 10 + Math.sin(angle) * 2.9;
        const x2 = 15 + Math.cos(angle) * 4;
        const y2 = 10 + Math.sin(angle) * 4;
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#F6B40E" strokeWidth="0.5" />;
      })}
    </svg>
  );
}

export function FlagBR({ className }) {
  return (
    <svg viewBox="0 0 30 20" className={className} role="img" aria-label="Brasil">
      <rect width="30" height="20" fill="#009B3A" />
      <polygon points="15,2.5 27.5,10 15,17.5 2.5,10" fill="#FEDD00" />
      <circle cx="15" cy="10" r="5.2" fill="#002776" />
      <path
        d="M9.8 8.3a10 10 0 0 1 10.4 3.4"
        fill="none"
        stroke="#FFFFFF"
        strokeWidth="0.6"
      />
      {[[12.5, 7.5], [15.5, 6.6], [18, 8], [11, 11], [17, 12], [13.5, 12.8]].map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="0.35" fill="#FFFFFF" />
      ))}
    </svg>
  );
}
