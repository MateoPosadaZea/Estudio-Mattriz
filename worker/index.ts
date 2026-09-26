// Worker de mattriz-studio. Los assets estáticos (build de Astro) los sirve Cloudflare directamente;
// este código solo corre para las rutas de run_worker_first en wrangler.jsonc:
//
//   POST /api/contact                   Formulario de contacto → Resend → contacto@mattriz.com.
//   /work/spot-on/case-study.html       Se sirve en esa ruta exacta (sin el redirect de .html que haría
//                                       html_handling), porque el caso de estudio circula con esa URL.
//   /robots.txt                         En dominios que no son mattriz.com (el *.workers.dev de prueba)
//                                       bloquea todo, para que Google no indexe una copia del sitio.
//
// Variables (Cloudflare → Worker → Settings → Variables and secrets):
//   RESEND_API_KEY     secreto. Clave de Resend con el dominio mattriz.com verificado.
//   TURNSTILE_SECRET   secreto. Clave secreta del widget de Turnstile.
//   CONTACT_TO         opcional. Destino (por defecto contacto@mattriz.com).
//   CONTACT_FROM       opcional. Remitente verificado en Resend (por defecto "Mattriz website <forms@mattriz.com>").

interface Env {
  ASSETS: { fetch: (req: Request | string) => Promise<Response> };
  RESEND_API_KEY?: string;
  TURNSTILE_SECRET?: string;
  CONTACT_TO?: string;
  CONTACT_FROM?: string;
}

const CASE_STUDY = '/work/spot-on/case-study.html';
const CANONICAL_HOST = 'mattriz.com';

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/robots.txt' && url.hostname !== CANONICAL_HOST) {
      return new Response('User-agent: *\nDisallow: /\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
    }

    if (url.pathname === CASE_STUDY) {
      // html_handling redirige /x.html a /x; pedimos /x internamente y respondemos en la URL original.
      const asset = await env.ASSETS.fetch(new Request(new URL('/work/spot-on/case-study', url), request));
      return new Response(asset.body, asset);
    }

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
      return handleContact(request, env);
    }

    return env.ASSETS.fetch(request);
  },
};

async function handleContact(request: Request, env: Env): Promise<Response> {
  const wantsJson = (request.headers.get('Accept') || '').includes('application/json');
  let form: FormData | null = null;
  // Sin JS se vuelve a la página de contacto del idioma del formulario (/contact/ o /es/contact/).
  const reply = (ok: boolean, status = ok ? 200 : 400) => {
    const page = form?.get('lang') === 'es' ? '/es/contact/' : '/contact/';
    return wantsJson
      ? Response.json({ ok }, { status })
      : Response.redirect(new URL(`${page}?sent=${ok ? 'ok' : 'error'}`, request.url).toString(), 303);
  };

  try {
    form = await request.formData();
  } catch {
    return reply(false);
  }
  const data = form;
  const get = (k: string) => String(data.get(k) ?? '').trim();

  // Honeypot: un bot llenó el campo oculto. Se responde como éxito y no se envía nada.
  if (get('website')) return reply(true);

  const name = get('name').slice(0, 200);
  const email = get('email').slice(0, 200);
  const phone = get('phone').slice(0, 100);
  const details = get('details').slice(0, 5000);
  const budget = get('budget').slice(0, 100);
  const services = data.getAll('services').map((s) => String(s).slice(0, 100)).slice(0, 10);

  if (!name || !details || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return reply(false);

  // Turnstile: obligatorio cuando hay secreto configurado.
  if (env.TURNSTILE_SECRET) {
    const token = get('cf-turnstile-response');
    const check = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
      method: 'POST',
      body: new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token, remoteip: request.headers.get('CF-Connecting-IP') || '' }),
    });
    const result = (await check.json().catch(() => ({}))) as { success?: boolean };
    if (!result.success) return reply(false);
  }

  if (!env.RESEND_API_KEY) return reply(false, 500);

  const rows: [string, string][] = [
    ['Name', name],
    ['Email', email],
    ['Phone / Whatsapp', phone || '(not provided)'],
    ['How can we help', services.join(', ') || '(none selected)'],
    ['Estimated budget (USD)', budget || '(not provided)'],
    ['More details', details],
  ];
  const text = rows.map(([k, v]) => `${k}:\n${v}`).join('\n\n');
  const html = rows
    .map(([k, v]) => `<p><strong>${esc(k)}</strong><br>${esc(v).replace(/\n/g, '<br>')}</p>`)
    .join('');

  const send = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM || 'Mattriz website <forms@mattriz.com>',
      to: [env.CONTACT_TO || 'contacto@mattriz.com'],
      reply_to: email,
      subject: `${get('lang') === 'es' ? 'Nueva solicitud de proyecto (ES)' : 'New project inquiry'}: ${name}`,
      text,
      html,
    }),
  });

  return reply(send.ok, send.ok ? 200 : 502);
}

function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}
