export interface ContactPayload {
  name: string;
  message: string;
}

export interface Sender {
  send(payload: ContactPayload): Promise<void>;
}

export async function sendContactEmail(
  payload: ContactPayload,
  sender: Sender,
): Promise<void> {
  await sender.send(payload);
}

export function resendSender(
  apiKey: string,
  toEmail: string,
  deps: { fetch?: typeof globalThis.fetch } = {},
): Sender {
  const fetcher = deps.fetch ?? globalThis.fetch;
  return {
    async send({ name, message }) {
      const res = await fetcher('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Lukas Archery Works <onboarding@resend.dev>',
          to: toEmail,
          subject: `New contact message from ${name}`,
          text: `Name: ${name}\n\nMessage:\n${message}`,
        }),
      });
      if (!res.ok) throw new Error(`Resend error: ${res.status}`);
    },
  };
}

export function senderFromEnv(
  env: Record<string, string | undefined> = process.env,
): Sender | null {
  const apiKey = env.RESEND_API_KEY?.trim();
  const toEmail = env.CONTACT_TO_EMAIL?.trim();
  if (!apiKey || !toEmail) return null;
  return resendSender(apiKey, toEmail);
}
