import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import RegistrarServiceWorker from '@/components/RegistrarServiceWorker';

export const metadata = {
  title: 'Vips — Directorio de Profesionales Independientes',
  description: 'Encontrá profesionales verificados cerca tuyo, sin intermediarios.',
  manifest: '/manifest.webmanifest',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Vips',
  },
  icons: {
    icon: [
      { url: '/favicon.ico' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
};

export const viewport = {
  themeColor: '#0B0A08',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-body">
        <RegistrarServiceWorker />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
