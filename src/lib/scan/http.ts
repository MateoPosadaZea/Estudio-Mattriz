// Escáner de sitios: manejadores HTTP compartidos por el Worker de Cloudflare (worker/index.ts)
// y la función de Netlify del preview (netlify/functions/scan.mts).
//
//   GET  /api/scan?url=…   Escanea y devuelve el análisis (JSON).
//   POST /api/scan-lead    La persona pide el plan y la cotización: se envía a contacto@mattriz.com
//                          por Resend con lo detectado (mismas variables que el formulario de contacto).

import { scanSite, ScanError } from './fetch';

export type LeadEnv = { RESEND_API_KEY?: string; TURNSTILE_SECRET?: string; CONTACT_TO?: string; CONTACT_FROM?: string };

const json = (data: unknown, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store' } });

export async function handleScan(request: Request, isPublicHost?: (host: string) => Promise<boolean>): Promise<Response> {
  if (request.method !== 'GET') return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'GET' } });
  const target = new URL(request.url).searchParams.get('url') || '';
  try {
    const result = await scanSite(target, isPublicHost);
    return json({ ok: true, result });
  } catch (e) {
    const code = e instanceof ScanError ? e.code : 'unreachable';
    return json({ ok: false, error: code }, code === 'invalid' || code === 'blocked' ? 400 : 502);
  }
}

export async function handleLead(request: Request, env: LeadEnv, remoteIp = ''): Promise<Response> {
  if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
  let form: FormData;
  try {
    form = await request.formData();
  } catch {
    return json({ ok: false }, 400);
  }
  const get = (k: string, max = 200) => String(form.get(k) ?? '').trim().slice(0, max);

  // Honeypot.
  if (get('website')) return json({ ok: true });

  const name = get('name');
  const email = get('email');
  const phone = get('phone', 100);
  const site = get('url', 300);
  const lang = get('lang', 5) === 'es' ? 'es' : 'en';
  const report = get('report', 8000);
  if (!name || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return json({ ok: false }, 400);

  if (env.TURNSTILE_SECRET) {
    const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: get('cf-turnstile-response', 4000), remoteip: remoteIp }),
    });
    const result = (await check.json().catch(() => ({}))) as { success?: boolean };
    if (!result.success) return json({ ok: false }, 400);
  }

  if (!env.RESEND_API_KEY) return json({ ok: false, error: 'not-configured' }, 503);

  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Phone / WhatsApp', phone || '(not provided)'],
    ['Website scanned', site],
    ['Language', lang],
    ['Scan summary', report || '(none)'],
  ];
  const text = rows.map(([k, v]) => `${k}:\n${v}`).join('\n\n');
  const html = rows.map(([k, v]) => `<p><strong>${esc(k)}</strong><br>${esc(v).replace(/\n/g, '<br>')}</p>`).join('');

  const send = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM || 'Mattriz website <forms@mattriz.com>',
      to: [env.CONTACT_TO || 'contacto@mattriz.com'],
      reply_to: email,
      subject: `${lang === 'es' ? 'Escáner: plan y cotización' : 'Scanner: plan & quote'}: ${site || name}`,
      text,
      html,
    }),
  });
  return json({ ok: send.ok }, send.ok ? 200 : 502);
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
