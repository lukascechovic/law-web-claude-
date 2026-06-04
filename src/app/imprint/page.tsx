import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Imprint — Lukas Archery Works',
};

export default function ImprintPage() {
  return (
    <>
      <Navbar />
      <main
        data-testid="imprint-page"
        className="min-h-screen bg-cream-50 pt-24 pb-16 px-6"
      >
        <div className="mx-auto max-w-2xl">
          <p className="section-label mb-4">Legal</p>
          <h1 className="font-serif text-4xl text-stone-dark mb-10">Imprint</h1>

          <section className="prose prose-stone max-w-none text-stone-dark">
            <h2>Information according to § 5 TMG / applicable disclosure law</h2>

            <p>
              <strong>[PLACEHOLDER — legal entity name]</strong><br />
              [PLACEHOLDER — street address]<br />
              [PLACEHOLDER — postal code, city, country]
            </p>

            <h2>Contact</h2>
            <p>
              Email: [PLACEHOLDER — contact email]<br />
              Phone: [PLACEHOLDER — phone number, if applicable]
            </p>

            <h2>Responsible for content</h2>
            <p>[PLACEHOLDER — full name of responsible person]</p>

            <h2>EU dispute resolution</h2>
            <p>
              The European Commission provides a platform for online dispute resolution (ODR):{' '}
              <a
                href="https://ec.europa.eu/consumers/odr/"
                target="_blank"
                rel="noopener noreferrer"
              >
                https://ec.europa.eu/consumers/odr/
              </a>
              . We are not obliged to participate in dispute resolution proceedings before a
              consumer arbitration board and do not do so.
            </p>

            <h2>Liability for content</h2>
            <p>
              [PLACEHOLDER — standard liability disclaimer to be reviewed by legal counsel]
            </p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
