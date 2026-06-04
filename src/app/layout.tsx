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

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://lukasarcheryworks.com';

const DESCRIPTION =
  'Handcrafted horseback archery equipment from Slovakia. WINGS nocking aids, ARC quivers, and HORIZON quivers — built for performance and personalization.';

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: 'Lukas Archery Works',
  description: DESCRIPTION,
  keywords: ['horseback archery', 'HBA', 'quiver', 'archery equipment', 'Slovakia'],
  openGraph: {
    type: 'website',
    url: SITE_URL,
    title: 'Lukas Archery Works',
    description: DESCRIPTION,
    images: [{ url: '/images/brand/logo-light.png', width: 1200, height: 630, alt: 'Lukas Archery Works' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Lukas Archery Works',
    description: DESCRIPTION,
    images: ['/images/brand/logo-light.png'],
  },
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
