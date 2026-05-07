import { NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';

interface LeadPayload {
  email?: string;
  phone?: string;
  avatar?: string;
  kg?: number;
  answers?: Record<string, unknown>;
}

const LEAD_LOG_DIR = process.env.LEAD_LOG_DIR ?? '/tmp/drfit-leads';

export async function POST(req: Request) {
  let body: LeadPayload;
  try {
    body = (await req.json()) as LeadPayload;
  } catch {
    return NextResponse.json({ ok: false, error: 'invalid_json' }, { status: 400 });
  }

  if (!body.email || !/\S+@\S+\.\S+/.test(body.email)) {
    return NextResponse.json({ ok: false, error: 'invalid_email' }, { status: 400 });
  }

  const lead = {
    receivedAt: new Date().toISOString(),
    email: body.email,
    phone: body.phone,
    avatar: body.avatar,
    kg: body.kg,
    answers: body.answers,
    ip: req.headers.get('x-forwarded-for') ?? null,
    userAgent: req.headers.get('user-agent') ?? null,
  };

  // Persist to local JSONL (works locally + on writable serverless tmpfs)
  try {
    await mkdir(LEAD_LOG_DIR, { recursive: true });
    const file = join(LEAD_LOG_DIR, `${new Date().toISOString().slice(0, 10)}.jsonl`);
    let existing = '';
    try { existing = await readFile(file, 'utf8'); } catch {/* new file */}
    await writeFile(file, existing + JSON.stringify(lead) + '\n', 'utf8');
  } catch (err) {
    console.error('lead persist failed', err);
  }

  // Optional: forward to Resend / Klaviyo / webhook (env-gated)
  if (process.env.LEAD_WEBHOOK_URL) {
    try {
      await fetch(process.env.LEAD_WEBHOOK_URL, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(lead),
      });
    } catch (err) {
      console.error('lead webhook failed', err);
    }
  }

  return NextResponse.json({ ok: true });
}
