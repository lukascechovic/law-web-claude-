import type { Metadata } from 'next';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export const metadata: Metadata = {
  title: 'Privacy Policy — Lukas Archery Works',
};

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main
        data-testid="privacy-page"
        className="min-h-screen bg-cream-50 pt-24 pb-16 px-6"
      >
        <div className="mx-auto max-w-2xl">
          <p className="section-label mb-4">Legal</p>
          <h1 className="font-serif text-4xl text-stone-dark mb-4">Privacy Policy</h1>
          <p className="text-sm text-bark-500 mb-10">Last updated: [PLACEHOLDER — date]</p>

          <div className="prose prose-stone max-w-none text-stone-dark">
            <p>
              [PLACEHOLDER — opening paragraph: identity of data controller, jurisdiction, scope]
            </p>

            <section data-testid="privacy-section-llm">
              <h2>Chatbot — Third-party LLM processing</h2>
              <p>
                This website includes an AI-powered chatbot. When you interact with the chatbot,
                your messages are transmitted to a third-party large language model (LLM) provider
                for processing.
              </p>
              <p>
                [PLACEHOLDER — name of LLM provider, link to their privacy policy, data retention
                period, transfers outside EEA if applicable, legal basis for processing]
              </p>
            </section>

            <section data-testid="privacy-section-contact-form">
              <h2>Contact form</h2>
              <p>
                If you contact us via the contact form or by email, the data you provide (name,
                email address, message content) is stored in order to handle your enquiry and for
                follow-up questions.
              </p>
              <p>
                [PLACEHOLDER — form handler / email provider name, data retention period, legal
                basis (Art. 6(1)(b) or (f) GDPR), right to request deletion]
              </p>
            </section>

            <section data-testid="privacy-section-analytics">
              <h2>Analytics — cookieless</h2>
              <p>
                This website uses cookieless, privacy-friendly analytics. No tracking cookies are
                set. Aggregated, anonymised usage data (page views, referrer) may be collected
                without identifying individual visitors.
              </p>
              <p>
                [PLACEHOLDER — analytics provider name (e.g. Vercel Analytics), link to their
                privacy policy, confirm no personal data stored, no consent required]
              </p>
            </section>

            <section data-testid="privacy-section-hosting">
              <h2>Hosting and server logs</h2>
              <p>
                This website is hosted by a third-party hosting provider. When you access the site,
                your browser automatically transmits data to our server including your IP address,
                browser type, and the page requested. This data is stored in server log files for
                security and operational purposes.
              </p>
              <p>
                [PLACEHOLDER — hosting provider name, log retention period, legal basis
                (Art. 6(1)(f) GDPR — legitimate interest in security), whether logs are
                anonymised or deleted after X days]
              </p>
            </section>

            <section>
              <h2>Your rights</h2>
              <p>
                [PLACEHOLDER — rights under GDPR: access, rectification, erasure, restriction,
                portability, objection; right to lodge complaint with supervisory authority;
                contact details for exercising rights]
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
