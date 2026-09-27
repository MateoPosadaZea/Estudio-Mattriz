// Worker de mattriz-studio. Los assets estáticos (build de Astro) los sirve Cloudflare directamente;
// este código solo corre para las rutas de run_worker_first en wrangler.jsonc:
//
//   POST /api/contact                   Formulario de contacto → Resend → contacto@mattriz.com.
//   GET  /api/scan?url=…                Escáner de sitios (src/lib/scan/): analiza un sitio y responde JSON.
//   POST /api/scan-lead                 Pedido de plan y cotización desde el escáner → Resend.
//   /work/spot-on/case-study.html       Se sirve en esa ruta exacta (sin el redirect de .html que haría
//                                       html_handling), porque el caso de estudio circula con esa URL.
//   /, /es/, /project/*, /es/project/*  Una sola vez por navegador: Clear-Site-Data "cache" borra lo que
//                                       quedó en caché del WordPress anterior (páginas viejas de proyectos
//                                       que el navegador seguía mostrando) y una cookie marca que ya se hizo.
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

import { handleScan, handleLead } from '../src/lib/scan/http';
import { renderLeadEmail, bogotaNow, whatsappLink } from '../src/lib/email';

const CASE_STUDY = '/work/spot-on/case-study.html';
const CANONICAL_HOST = 'mattriz.com';
// Cookie que marca que ya se limpió la caché del sitio viejo en este navegador.
const PURGE_COOKIE = 'mz_v2';

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

    if (url.pathname === '/api/scan') return handleScan(request);
    if (url.pathname === '/api/scan-lead') return handleLead(request, env, request.headers.get('CF-Connecting-IP') || '');

    if (url.pathname === '/api/contact') {
      if (request.method !== 'POST') return new Response('Method Not Allowed', { status: 405, headers: { Allow: 'POST' } });
      return handleContact(request, env);
    }

    const res = await env.ASSETS.fetch(request);
    if (request.method === 'GET' && !(request.headers.get('Cookie') || '').includes(`${PURGE_COOKIE}=1`) && (res.headers.get('Content-Type') || '').includes('text/html')) {
      const out = new Response(res.body, res);
      out.headers.set('Clear-Site-Data', '"cache"');
      out.headers.append('Set-Cookie', `${PURGE_COOKIE}=1; Path=/; Max-Age=31536000; Secure; SameSite=Lax`);
      return out;
    }
    return res;
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

  const es = get('lang') === 'es';
  const first = name.split(/\s+/)[0];
  const wa = phone ? whatsappLink(phone) : '';
  const { html, text } = renderLeadEmail({
    tag: 'Nuevo proyecto',
    title: `${name} quiere hablar de un proyecto`,
    messageLabel: 'La idea',
    message: details,
    fields: [
      { label: 'Necesita ayuda con', value: services.join(', ') },
      { label: 'Presupuesto (USD)', value: budget },
      { label: 'Correo', value: email, href: `mailto:${email}` },
      { label: 'Teléfono / WhatsApp', value: phone, href: wa || undefined },
      { label: 'Idioma del formulario', value: es ? 'Español' : 'Inglés' },
    ],
    actions: [
      { label: `Responder a ${first}`, href: `mailto:${email}?subject=${encodeURIComponent(es ? 'Tu proyecto con Mattriz' : 'Your project with Mattriz')}` },
      ...(wa ? [{ label: 'Escribir por WhatsApp', href: wa }] : []),
    ],
    footer: `Enviado desde el formulario de mattriz.com${es ? '/es/' : '/'} · ${bogotaNow()} (hora de Bogotá)`,
  });

  const send = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({
      from: env.CONTACT_FROM || 'Mattriz website <forms@mattriz.com>',
      to: [env.CONTACT_TO || 'contacto@mattriz.com'],
      reply_to: email,
      subject: `Nuevo proyecto: ${name}${services.length ? ` · ${services.join(', ')}` : ''}`,
      text,
      html,
    }),
  });

  return reply(send.ok, send.ok ? 200 : 502);
}

