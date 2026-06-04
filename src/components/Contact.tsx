'use client';

import { useState } from 'react';
import { Mail, MapPin, Instagram, Youtube, Send } from 'lucide-react';

type FormState = 'idle' | 'sending' | 'success' | 'error';

export default function Contact() {
  const [state, setState] = useState<FormState>('idle');
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [website, setWebsite] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setState('sending');
    setErrorMsg('');
    try {
      const res = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, message, website }),
      });
      if (res.ok) {
        setState('success');
      } else {
        const data = (await res.json().catch(() => ({}))) as { error?: string };
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        setState('error');
      }
    } catch {
      setErrorMsg('Could not reach the server. Please check your connection.');
      setState('error');
    }
  }

  return (
    <section
      id="contact"
      data-testid="contact-section"
      className="py-24 px-6 bg-forest-900 text-cream-100"
    >
      <div className="mx-auto max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Contact info */}
        <div>
          <p className="section-label mb-3">Get in Touch</p>
          <h2 className="font-serif text-3xl md:text-4xl text-cream-50 mb-8">Contact</h2>
          <ul className="flex flex-col gap-5 text-cream-200">
            <li className="flex items-center gap-3">
              <Mail size={18} aria-hidden="true" className="text-bark-500 shrink-0" />
              <a
                href="mailto:lukas@lukasarcheryworks.com"
                className="hover:text-cream-50 transition-colors"
                data-testid="contact-email"
              >
                lukas@lukasarcheryworks.com
              </a>
            </li>
            <li className="flex items-center gap-3">
              <MapPin size={18} aria-hidden="true" className="text-bark-500 shrink-0" />
              <span data-testid="contact-location">Slovakia</span>
            </li>
            <li className="flex items-center gap-4 mt-2">
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
            </li>
          </ul>
        </div>

        {/* Form */}
        <div>
          {state === 'success' ? (
            <div data-testid="contact-success" className="flex flex-col gap-4">
              <p className="font-serif text-xl text-cream-50">Message sent!</p>
              <p className="text-cream-200">
                Thank you for reaching out. I&apos;ll get back to you soon.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} noValidate data-testid="contact-form">
              {/* Honeypot — hidden from real users, filled only by bots */}
              <div aria-hidden="true" className="hidden">
                <label htmlFor="website">Website</label>
                <input
                  id="website"
                  name="website"
                  type="text"
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={e => setWebsite(e.target.value)}
                />
              </div>

              <div className="flex flex-col gap-5">
                <div>
                  <label
                    htmlFor="contact-name"
                    className="block text-sm text-cream-300 mb-1.5"
                  >
                    Name
                  </label>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    required
                    value={name}
                    onChange={e => setName(e.target.value)}
                    disabled={state === 'sending'}
                    className="w-full rounded-md bg-forest-800 border border-forest-700 text-cream-50 placeholder-cream-300/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bark-500 disabled:opacity-50 transition"
                    placeholder="Your name"
                  />
                </div>

                <div>
                  <label
                    htmlFor="contact-message"
                    className="block text-sm text-cream-300 mb-1.5"
                  >
                    Message
                  </label>
                  <textarea
                    id="contact-message"
                    name="message"
                    required
                    rows={5}
                    value={message}
                    onChange={e => setMessage(e.target.value)}
                    disabled={state === 'sending'}
                    className="w-full rounded-md bg-forest-800 border border-forest-700 text-cream-50 placeholder-cream-300/40 px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-bark-500 disabled:opacity-50 resize-none transition"
                    placeholder="Your message…"
                  />
                </div>

                {state === 'error' && (
                  <p data-testid="contact-error" className="text-red-400 text-sm">
                    {errorMsg}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={state === 'sending'}
                  data-testid="contact-submit"
                  className="btn-primary flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Send size={16} aria-hidden="true" />
                  {state === 'sending' ? 'Sending…' : 'Send Message'}
                </button>

                <p
                  data-testid="contact-privacy"
                  className="text-xs text-cream-300/70 leading-relaxed"
                >
                  Your message is sent directly to Lukas and is not stored on our servers. See our{' '}
                  <a href="/privacy" className="underline hover:text-cream-50 transition-colors">
                    Privacy Policy
                  </a>{' '}
                  for details.
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </section>
  );
}
