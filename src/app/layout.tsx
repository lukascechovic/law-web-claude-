import type { Metadata } from 'next';
import { Playfair_Display, Inter } from 'next/font/google';
import { Analytics } from '@vercel/analytics/next';
import CookieBanner from '@/components/CookieBanner';
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
      <body>
        {children}
        <CookieBanner />
        {/* Cookieless analytics — loads regardless of consent because it sets
            no tracking cookies; the banner is informational only. */}
        <Analytics />
      </body>
    </html>
  );
}
