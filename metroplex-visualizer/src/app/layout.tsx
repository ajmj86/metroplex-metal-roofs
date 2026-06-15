import type { Metadata } from 'next';
import { Cormorant_Garamond, Outfit } from 'next/font/google';
import './globals.css';

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-cormorant',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Metal Roof Visualizer | Metroplex Metal Roofs',
  description: 'See your home with a new metal roof before you buy.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${outfit.variable}`}>
      <body className="bg-background text-foreground font-body antialiased">
        {children}
      </body>
    </html>
  );
}
