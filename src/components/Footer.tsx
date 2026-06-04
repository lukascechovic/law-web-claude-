import Image from 'next/image';
import { Instagram, Youtube } from 'lucide-react';
import RevealOnScroll from '@/components/RevealOnScroll';

export default function Footer() {
  return (
    <footer className="bg-forest-950 text-cream-200 py-16 px-6">
      <RevealOnScroll repeat>
      <div className="mx-auto max-w-7xl grid grid-cols-1 md:grid-cols-3 gap-12">
        {/* Brand */}
        <div className="flex flex-col gap-4">
          <Image
            src="/images/brand/logo-light.png"
            alt="Lukas Archery Works logo"
            width={140}
            height={48}
            className="h-10 w-auto object-contain"
          />
          <p className="text-sm text-cream-300 leading-relaxed max-w-xs">
            Handcrafted horseback archery equipment designed for performance,
            personalization, and ease of use.
          </p>
        </div>

        {/* Quick links */}
        <div>
          <h3 className="font-sans font-medium tracking-widest uppercase text-xs text-bark-500 mb-4">
            Navigate
          </h3>
          <ul className="flex flex-col gap-2">
            {[
              { href: '#about', label: 'About' },
              { href: '#products', label: 'Products' },
            ].map(({ href, label }) => (
              <li key={href}>
                <a
                  href={href}
                  className="text-sm text-cream-300 hover:text-cream-50 transition-colors"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="font-sans font-medium tracking-widest uppercase text-xs text-bark-500 mb-4">
            Follow
          </h3>
          <div className="flex gap-4">
            <a
              href="https://www.instagram.com/lukas.archery.works"
              aria-label="Instagram"
              className="text-cream-300 hover:text-cream-50 transition-colors"
            >
              <Instagram size={20} aria-hidden="true" />
            </a>
            <a
              href="https://www.youtube.com/@lukasarcheryworks"
              aria-label="YouTube"
              className="text-cream-300 hover:text-cream-50 transition-colors"
            >
              <Youtube size={20} aria-hidden="true" />
            </a>
          </div>
        </div>
      </div>
      </RevealOnScroll>

      <div className="mx-auto max-w-7xl mt-12 pt-8 border-t border-forest-800 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-cream-300">
        <span>Lukas Archery Works — Slovakia</span>
        <div className="flex gap-4">
          <a href="/imprint" className="hover:text-cream-50 transition-colors">Imprint</a>
          <a href="/privacy" className="hover:text-cream-50 transition-colors">Privacy Policy</a>
        </div>
        <span>© {new Date().getFullYear()} All rights reserved.</span>
      </div>
    </footer>
  );
}
