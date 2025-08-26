import type { Metadata } from 'next';
import './globals.css';
import { Inter } from 'next/font/google';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { AuthProvider } from '@/contexts/AuthContext';

const inter = Inter({ subsets: ['latin'], weight: ['400', '500', '700'] });

export const metadata: Metadata = {
  title: 'AskPiko – Smartphone diagnostics for trusted resales',
  description:
    "Check a phone's condition in minutes and generate a shareable report. We're seeking a partner to support the launch.",
  metadataBase: new URL('https://example.com'),
  openGraph: {
    title: 'AskPiko – Smartphone diagnostics',
    description: 'Shareable diagnostic reports for second‑hand phone sales.',
    images: ['/og.jpg'],
    type: 'website',
    locale: 'en_US',
  },
  twitter: { card: 'summary_large_image', images: ['/og.jpg'] },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.className}>
      <body className="min-h-screen bg-light-surface text-light-text dark:bg-dark-surface dark:text-dark-text">
        <AuthProvider>
          <Header />
          <main>{children}</main>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
