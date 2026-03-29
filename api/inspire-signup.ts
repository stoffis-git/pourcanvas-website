import { Resend } from 'resend';

export const config = { runtime: 'edge' };

async function writeToAirtable(email: string, slug: string, pillar: string, source: string) {
  const baseId = process.env.AIRTABLE_INSPIRE_BASE_ID;
  const tableId = process.env.AIRTABLE_INSPIRE_TABLE_ID;
  const pat = process.env.AIRTABLE_PAT;
  if (!baseId || !tableId || !pat) return;

  const res = await fetch(`https://api.airtable.com/v0/${baseId}/${tableId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${pat}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      records: [{
        fields: {
          Email: email,
          Slug: slug,
          Pillar: pillar,
          Source: source,
        },
      }],
    }),
  });

  if (!res.ok) console.error('[inspire-signup] Airtable error:', await res.text());
}

async function sendConfirmationEmail(email: string) {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return;

  const resend = new Resend(apiKey);
  await resend.emails.send({
    from: 'PourCanvas <hello@pourcanvas.com>',
    to: email,
    subject: "Your inspiration pack is coming",
    text: `Hi,

You're on the list. We'll send your full inspiration pack — 20+ curated patio, driveway and walkway design images — shortly.

In the meantime, explore more ideas at pourcanvas.com/inspiration.

— The PourCanvas team
pourcanvas.com`,
  });
}

export default async function handler(request: Request): Promise<Response> {
  if (request.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), { status: 405 });
  }

  let body: { email?: string; slug?: string; pillar?: string; source?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { email, slug = '', pillar = '', source = 'inspire-pack' } = body;

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return new Response(JSON.stringify({ error: 'Valid email required' }), { status: 400 });
  }

  await Promise.allSettled([
    writeToAirtable(email, slug, pillar, source),
    sendConfirmationEmail(email),
  ]);

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
}
