export function LogoMercadoPago({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Mercado Pago">
      <rect width="40" height="40" rx="8" fill="#00AAEF" />
      <circle cx="20" cy="17" r="9" fill="#FFE600" />
      <path d="M11 17a9 9 0 0 1 18 0" fill="none" stroke="#2D3277" strokeWidth="2" />
      <path d="M14 29c1.5-2 4-3 6-3s4.5 1 6 3" fill="none" stroke="#FFFFFF" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

export function LogoScotiabank({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Scotiabank">
      <rect width="40" height="40" rx="8" fill="#EC111A" />
      <path
        d="M20 8c3 4-3 6-3 10 0 3 2.5 5 5.5 5-1.5 3-4.5 5-8 5-5 0-9-4-9-9 0-8 9-9 14.5-11z"
        fill="#FFFFFF"
      />
    </svg>
  );
}

export function LogoItau({ className }) {
  return (
    <svg viewBox="0 0 40 40" className={className} role="img" aria-label="Itaú">
      <rect width="40" height="40" rx="20" fill="#EC7000" />
      <rect x="4" y="4" width="32" height="32" rx="16" fill="none" stroke="#003DA5" strokeWidth="3" />
      <text
        x="20" y="26"
        fontFamily="Georgia, serif"
        fontSize="13"
        fontWeight="bold"
        fill="#FFFFFF"
        textAnchor="middle"
      >itaú</text>
    </svg>
  );
}
