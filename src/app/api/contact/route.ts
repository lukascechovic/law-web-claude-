import { sendContactEmail, senderFromEnv } from '@/lib/contact';

export const runtime = 'nodejs';

function badRequest(message: string): Response {
  return Response.json({ error: message }, { status: 400 });
}

export async function POST(req: Request): Promise<Response> {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return badRequest('Invalid JSON body.');
  }

  const { name, message, website } = body as {
    name?: unknown;
    message?: unknown;
    website?: unknown;
  };

  // Honeypot: real users leave this blank; silently accept bot submissions to avoid fingerprinting.
  if (website) {
    return Response.json({ ok: true });
  }

  if (!name || typeof name !== 'string' || !name.trim()) {
    return badRequest('Name is required.');
  }
  if (!message || typeof message !== 'string' || !message.trim()) {
    return badRequest('Message is required.');
  }

  const sender = senderFromEnv();
  if (!sender) {
    return Response.json({ ok: true });
  }

  try {
    await sendContactEmail({ name: name.trim(), message: message.trim() }, sender);
    return Response.json({ ok: true });
  } catch {
    return Response.json(
      { error: 'Could not send message. Please try again.' },
      { status: 500 },
    );
  }
}
