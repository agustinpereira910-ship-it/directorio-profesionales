/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#D4AF37',      // dorado — color primario, títulos, bordes, CTA
        paper: '#0B0A08',    // negro cálido — fondo general
        card: '#151310',     // negro carbón — fondo de tarjetas/paneles
        ochre: '#F0C674',    // dorado claro — acento secundario, sellos
        graphite: '#D8D2C2', // beige claro — texto principal sobre fondo oscuro
        verified: '#4FB37E', // verde sello de verificación
        alert: '#E2665C',    // coral — vencimientos/alertas
        line: '#3A3226',     // líneas divisoras sutiles sobre negro
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        perforation: 'radial-gradient(circle, transparent 4px, #0B0A08 4px)',
      },
    },
  },
  plugins: [],
};
