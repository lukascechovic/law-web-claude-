'use client';

import { useRef, useState } from 'react';
import { MessageCircle, Send, X } from 'lucide-react';

interface ChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export default function Chatbot() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [sending, setSending] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  async function send() {
    const text = input.trim();
    if (!text || sending) return;

    const history: ChatTurn[] = [...turns, { role: 'user', content: text }];
    // Reserve an empty assistant turn that the stream fills in place.
    setTurns([...history, { role: 'assistant', content: '' }]);
    setInput('');
    setSending(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      });

      if (!res.ok || !res.body) {
        appendToLastAssistant('Sorry, something went wrong. Please try again.');
        return;
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        appendToLastAssistant(decoder.decode(value, { stream: true }));
      }
    } catch {
      appendToLastAssistant('Sorry, something went wrong. Please try again.');
    } finally {
      setSending(false);
    }
  }

  function appendToLastAssistant(chunk: string) {
    setTurns(prev => {
      const next = [...prev];
      const last = next[next.length - 1];
      if (last?.role === 'assistant') {
        next[next.length - 1] = { ...last, content: last.content + chunk };
      }
      return next;
    });
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }

  return (
    <>
      {!open && (
        <button
          data-testid="chat-launcher"
          onClick={() => setOpen(true)}
          aria-label="Open chat"
          className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-forest-700 text-cream-50 shadow-lg transition-colors hover:bg-forest-600"
        >
          <MessageCircle size={24} aria-hidden="true" />
        </button>
      )}

      {open && (
        <div
          data-testid="chat-panel"
          role="dialog"
          aria-label="Lukas Archery Works chat"
          className="fixed bottom-6 right-6 z-50 flex h-[32rem] w-[22rem] max-w-[calc(100vw-3rem)] flex-col overflow-hidden rounded-2xl border border-forest-800 bg-cream-50 shadow-2xl"
        >
          <header className="flex items-center justify-between bg-forest-950 px-4 py-3">
            <span className="font-serif text-cream-50">Ask about our gear</span>
            <button
              data-testid="chat-close"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="text-cream-200 hover:text-cream-50"
            >
              <X size={20} aria-hidden="true" />
            </button>
          </header>

          <div
            ref={scrollRef}
            className="flex-1 space-y-3 overflow-y-auto px-4 py-3 text-sm text-stone-dark"
          >
            {turns.length === 0 && (
              <p className="text-stone-dark/60">
                Ask about WINGS, ARC, or HORIZON — prices, specs, and techniques.
              </p>
            )}
            {turns.map((turn, i) => (
              <div
                key={i}
                data-testid={`chat-message-${turn.role}`}
                className={
                  turn.role === 'user'
                    ? 'ml-auto w-fit max-w-[85%] rounded-lg bg-forest-700 px-3 py-2 text-cream-50'
                    : 'mr-auto w-fit max-w-[85%] rounded-lg bg-cream-100 px-3 py-2'
                }
              >
                {turn.content}
              </div>
            ))}
          </div>

          <form
            className="flex items-center gap-2 border-t border-forest-800/20 px-3 py-3"
            onSubmit={e => {
              e.preventDefault();
              void send();
            }}
          >
            <input
              data-testid="chat-input"
              value={input}
              onChange={e => setInput(e.target.value)}
              placeholder="Type your question…"
              aria-label="Chat message"
              className="flex-1 rounded-lg border border-forest-800/20 bg-white px-3 py-2 text-sm outline-none focus:border-forest-600"
            />
            <button
              data-testid="chat-send"
              type="submit"
              disabled={sending}
              aria-label="Send message"
              className="flex h-9 w-9 items-center justify-center rounded-lg bg-forest-700 text-cream-50 transition-colors hover:bg-forest-600 disabled:opacity-50"
            >
              <Send size={18} aria-hidden="true" />
            </button>
          </form>
        </div>
      )}
    </>
  );
}
