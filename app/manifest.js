export default function manifest() {
  return {
    name: 'Vips — Directorio de Profesionales Independientes',
    short_name: 'Vips',
    description: 'Encontrá profesionales verificados cerca tuyo, sin intermediarios.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0B0A08',
    theme_color: '#0B0A08',
    icons: [
      { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
      { src: '/icon-512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
    ],
  };
}
