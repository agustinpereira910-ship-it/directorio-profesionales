/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx}',
    './components/**/*.{js,jsx}',
  ],
  theme: {
    extend: {
      colors: {
        ink: '#1B2A4A',      // azul tinta — color primario, confianza/formalidad
        paper: '#F7F4EE',    // papel/ficha — fondo
        ochre: '#D4A017',    // ocre — acento, evoca herramienta/sello
        graphite: '#22252B', // texto principal
        verified: '#2F6B4F', // verde sello de verificación
        alert: '#C1524A',    // coral — vencimientos/alertas, uso puntual
        line: '#D9D3C4',     // líneas divisoras tipo ticket perforado
      },
      fontFamily: {
        display: ['"Space Grotesk"', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['"IBM Plex Mono"', 'monospace'],
      },
      backgroundImage: {
        perforation: 'radial-gradient(circle, transparent 4px, #F7F4EE 4px)',
      },
    },
  },
  plugins: [],
};
