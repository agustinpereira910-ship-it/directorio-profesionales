import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';

export const metadata = {
  title: 'Directorio de Profesionales Independientes',
  description: 'Encontrá profesionales verificados cerca tuyo, sin intermediarios.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="es">
      <body className="font-body">
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
