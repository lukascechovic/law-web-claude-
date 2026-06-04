import { describe, it, expect, vi } from 'vitest';
import {
  sendContactEmail,
  resendSender,
  senderFromEnv,
  type ContactPayload,
  type Sender,
} from './contact';

function mockSender(): Sender & { calls: ContactPayload[] } {
  const calls: ContactPayload[] = [];
  return {
    calls,
    async send(payload) {
      calls.push(payload);
    },
  };
}

describe('sendContactEmail', () => {
  it('forwards name and message to the sender', async () => {
    const sender = mockSender();
    await sendContactEmail({ name: 'Ada', message: 'Hello!' }, sender);
    expect(sender.calls).toHaveLength(1);
    expect(sender.calls[0]).toEqual({ name: 'Ada', message: 'Hello!' });
  });

  it('propagates errors from the sender', async () => {
    const failingSender: Sender = {
      send: async () => {
        throw new Error('SMTP down');
      },
    };
    await expect(
      sendContactEmail({ name: 'Ada', message: 'Hello!' }, failingSender),
    ).rejects.toThrow('SMTP down');
  });
});

describe('resendSender', () => {
  it('POSTs to the Resend API with correct auth header and payload', async () => {
    const fetchMock = vi.fn().mockResolvedValue(new Response('{}', { status: 200 }));
    const sender = resendSender('key-123', 'maker@example.com', { fetch: fetchMock });
    await sender.send({ name: 'Ada', message: 'Hello!' });

    expect(fetchMock).toHaveBeenCalledOnce();
    const [url, init] = fetchMock.mock.calls[0] as [string, RequestInit];
    expect(url).toBe('https://api.resend.com/emails');
    expect(init.method).toBe('POST');
    expect((init.headers as Record<string, string>)['Authorization']).toBe('Bearer key-123');
    const body = JSON.parse(init.body as string);
    expect(body.to).toBe('maker@example.com');
    expect(body.text).toContain('Ada');
    expect(body.text).toContain('Hello!');
  });

  it('throws on a non-2xx response without leaking upstream detail', async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response('internal resend secret', { status: 422 }));
    const sender = resendSender('key-123', 'maker@example.com', { fetch: fetchMock });
    const err = await sender.send({ name: 'Ada', message: 'Hello!' }).catch((e: unknown) => e);
    expect(err).toBeInstanceOf(Error);
    expect((err as Error).message).not.toContain('internal resend secret');
  });
});

describe('senderFromEnv', () => {
  it('returns null when RESEND_API_KEY is missing', () => {
    expect(senderFromEnv({ CONTACT_TO_EMAIL: 'maker@example.com' })).toBeNull();
  });

  it('returns null when CONTACT_TO_EMAIL is missing', () => {
    expect(senderFromEnv({ RESEND_API_KEY: 'key-123' })).toBeNull();
  });

  it('returns a sender when both values are present', () => {
    const sender = senderFromEnv({
      RESEND_API_KEY: 'key-123',
      CONTACT_TO_EMAIL: 'maker@example.com',
    });
    expect(sender).not.toBeNull();
  });

  it('trims whitespace from env values before using them', () => {
    const sender = senderFromEnv({
      RESEND_API_KEY: '  key-123  ',
      CONTACT_TO_EMAIL: '  maker@example.com  ',
    });
    expect(sender).not.toBeNull();
  });

  it('returns null when both values are empty strings', () => {
    expect(senderFromEnv({ RESEND_API_KEY: '', CONTACT_TO_EMAIL: '' })).toBeNull();
  });
});
