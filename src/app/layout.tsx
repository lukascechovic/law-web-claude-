import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Lukas Archery Works',
  description:
    'Handcrafted horseback archery equipment from Slovakia. WINGS nocking aids, ARC quivers, and HORIZON quivers — built for performance and personalization.',
  keywords: ['horseback archery', 'HBA', 'quiver', 'archery equipment', 'Slovakia'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`}>
      <body>{children}</body>
    </html>
  );
}
