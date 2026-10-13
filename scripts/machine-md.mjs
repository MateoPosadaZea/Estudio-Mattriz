// Versión para máquinas (modo Machine): convierte el <main> de cada página ya construida a Markdown y
// lo deja junto a ella (/about/ → /about.md, / → /index.md, /es/ → /es/index.md). Sale del HTML final,
// así que dice exactamente lo mismo que la página, en los dos idiomas, sin mantener un segundo texto.
// Encima de la conversión: los datos del caso como lista, cada paso o cifra como "**Título**: texto",
// un resumen arriba ("At a glance") y al final un bloque fijo sobre Mattriz y cómo contactarla.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { parse } from 'node-html-parser';
import { NodeHtmlMarkdown } from 'node-html-markdown';

const SITE = 'https://mattriz.com';
const CALENDLY = 'https://calendly.com/contacto-mattriz/30min'; // el mismo de src/data/site.ts
const nhm = new NodeHtmlMarkdown({ bulletMarker: '-', keepDataImages: false, maxConsecutiveNewlines: 2 });

// Lo que va al final de cada archivo. Mismas afirmaciones que la home (cómo trabajamos, qué hacemos).
const ABOUT = {
  en: `## About Mattriz

Mattriz is a design and development studio based in Bogotá, Colombia, working with businesses across the US and Latin America. We design the brand, build the website, the online store or the booking and payment system, and keep it running every month. AI speeds up the work; the decisions stay with us.

- What we build: booking and operations systems, payment integration (Square, Stripe, Wompi), custom admin dashboards, automation and follow-up, websites that convert.
- How we work: a monthly plan to build, maintain and keep improving. No one-off projects.
- Capacity: three active clients at a time, a deliberate limit.
- Languages: English and Spanish.
- Contact: contacto@mattriz.com · ${SITE}/contact/
- Book a free 30-minute call: ${CALENDLY}
- Free website scanner: ${SITE}/scan/
- Everything about the studio for AI assistants: ${SITE}/llms.txt`,
  es: `## Sobre Mattriz

Mattriz es un estudio de diseño y desarrollo con sede en Bogotá, Colombia, que trabaja con negocios en Estados Unidos y Latinoamérica. Diseñamos la marca, construimos el sitio, la tienda o el sistema de reservas y pagos, y lo mantenemos funcionando mes a mes. La IA acelera el trabajo; las decisiones siguen siendo nuestras.

- Qué hacemos: sistemas de reservas y operación, integración de pagos (Square, Stripe, Wompi), paneles de administración a la medida, automatización y seguimiento, sitios web que convierten.
- Cómo trabajamos: un plan mensual para construir, mantener y seguir mejorando. No hacemos proyectos sueltos.
- Capacidad: tres clientes activos a la vez, un límite deliberado.
- Idiomas: español e inglés.
- Contacto: contacto@mattriz.com · ${SITE}/es/contact/
- Agenda una llamada gratuita de 30 minutos: ${CALENDLY}
- Escáner gratuito de sitios: ${SITE}/es/scan/
- Todo sobre el estudio para asistentes de IA: ${SITE}/llms.txt`,
};
const GLANCE = { en: ['At a glance', 'Results'], es: ['En resumen', 'Resultados'] };

// Partes de la página que solo sirven en pantalla: navegación entre casos, botones fijos, controles
// del carrusel, el reel y la estela del hero, la guía de scroll.
const SKIP = [
  '[aria-hidden="true"]', '[hidden]', 'script', 'style', 'noscript', 'svg', 'canvas', 'video', 'form', 'button', 'template',
  '[data-machine="skip"]', '.case-next', '.case-float', '.case-scroll', '.case-scrolly__bar', '.h-scroll',
  '.h-trail', '.h-reel-modal', '.h-work__pics', '.h-t__controls',
];

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const cls = (el) => el.getAttribute?.('class') ?? '';
const kids = (el) => el.childNodes.filter((n) => n.nodeType === 1);

async function* pages(dir) {
  for (const e of await readdir(dir, { withFileTypes: true })) {
    const p = join(dir, e.name);
    if (e.isDirectory()) yield* pages(p);
    else if (e.name === 'index.html') yield p;
  }
}

export function toMarkdown(html, path) {
  const doc = parse(html);
  if (doc.querySelector('meta[name="robots"][content*="noindex"]')) return null;
  const main = doc.querySelector('main');
  if (!main) return null;
  const lang = doc.querySelector('html')?.getAttribute('lang')?.startsWith('es') ? 'es' : 'en';
  const title = doc.querySelector('title')?.text.trim() ?? '';
  const desc = doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';

  main.querySelectorAll(SKIP.join(', ')).forEach((n) => n.remove());
  // Títulos partidos en palabras para la animación: se usa el texto completo del aria-label.
  main.querySelectorAll('h1[aria-label], h2[aria-label], h3[aria-label]').forEach((h) => h.set_content(esc(h.getAttribute('aria-label'))));
  // Números de sección "(01)" y números de paso: en pantalla ordenan, en texto sobran.
  main.querySelectorAll('span').forEach((s) => {
    if (!/^\(\d+\)$/.test(s.text.trim())) return;
    const label = s.parentNode;
    s.remove();
    if (!kids(label).length) label.set_content(esc(label.text.trim()));
  });
  main.querySelectorAll('[class*="__n "], [class$="__n"], [class*="__num"]').forEach((n) => n.remove());
  // Categorías de un proyecto en la lista de trabajos: entre paréntesis, tras el nombre.
  main.querySelectorAll('[class*="__cats"]').forEach((c) => c.set_content(` (${esc(c.text.trim())})`));

  // Fichas (Cliente, Ubicación…): lista "**Cliente**: valor". La del caso se lleva al resumen de arriba.
  const facts = [];
  main.querySelectorAll('dl').forEach((dl) => {
    const rows = kids(dl).flatMap((d) => (d.tagName === 'DIV' ? [d] : [])).map((d) => {
      const dt = d.querySelector('dt')?.text.trim() ?? '';
      const dd = d.querySelector('dd');
      const items = dd?.querySelectorAll('li').map((li) => li.text.trim()) ?? [];
      return `<li><strong>${esc(dt)}</strong>: ${esc(items.length ? items.join(', ') : dd?.text.trim() ?? '')}</li>`;
    });
    if (cls(dl).includes('case-facts')) {
      facts.push(...rows);
      dl.remove();
    } else dl.replaceWith(`<ul>${rows.join('')}</ul>`);
  });

  // Ítems armados con piezas (título y texto, cifra y rótulo, fecha y hito): "**primera**: el resto".
  main.querySelectorAll('li').forEach((li) => {
    // Si las piezas vienen dentro de un único contenedor, se baja hasta él.
    let box = li;
    while (kids(box).length === 1 && !box.childNodes.some((n) => n.nodeType === 3 && n.text.trim()) && kids(kids(box)[0]).length > 1) box = kids(box)[0];
    if (box.tagName === 'A') return;
    if (box !== li) li = box;
    const els = kids(li);
    if (els.length < 2 || els.some((e) => !cls(e).includes('__') || e.querySelector('a'))) return;
    if (li.childNodes.some((n) => n.nodeType === 3 && n.text.trim())) return;
    const parts = els.map((e) => e.text.replace(/\s+/g, ' ').trim()).filter(Boolean);
    // Las piezas se unen como frases: "Otra Lectura. Un periódico…", "System goes live. Site unified…".
    const rest = parts.slice(1).reduce((acc, p) => (acc ? acc + (/[.!?:]$/.test(acc) ? ' ' : '. ') + p : p), '');
    if (parts.length > 1) li.set_content(`<strong>${esc(parts[0])}</strong>: ${esc(rest)}`);
  });

  // Piezas que en pantalla se separan con CSS (nombre y cargo): un espacio entre elementos pegados.
  main.querySelectorAll('*').forEach((el) => {
    const k = el.childNodes;
    for (let i = k.length - 1; i > 0; i--) if (k[i].nodeType === 1 && k[i - 1].nodeType === 1) k[i].insertAdjacentHTML('beforebegin', ' ');
  });
  main.querySelectorAll('img').forEach((im) => (im.getAttribute('alt') ? im.setAttribute('src', new URL(im.getAttribute('src'), SITE).href) : im.remove()));
  const contact = `${SITE}${lang === 'es' ? '/es' : ''}/contact/`;
  main.querySelectorAll('a[href]').forEach((a) => {
    const href = a.getAttribute('href');
    // El formulario del footer no viaja al Markdown: el enlace lleva a la página de contacto.
    a.setAttribute('href', href === '#contact-form' ? contact : new URL(href, SITE + path).href);
  });

  // Resumen del caso justo después de la portada: ficha y cifras, lo que una IA citaría primero.
  const hero = main.querySelector('.case-hero');
  if (hero && facts.length) {
    const stats = main.querySelector('.case-stats');
    const [glance, results] = GLANCE[lang];
    hero.insertAdjacentHTML(
      'afterend',
      `<section><h2>${glance}</h2><ul>${facts.join('')}</ul>${stats ? `<p><strong>${results}</strong></p>${stats.outerHTML}` : ''}</section>`,
    );
  }

  const body = nhm
    .translate(main.innerHTML)
    .replace(/\[([^\]]*?)\s+\]\(/g, '[$1](')
    .replace(/ {2,}\(/g, ' (')
    .replace(/^(\s*)\d+\.\s+$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(desc)}\nlang: ${lang}\nurl: ${SITE}${path}\n---\n\n> ${desc}\n\n${body}\n\n---\n\n${ABOUT[lang]}\n`;
}

export async function writeMachineMarkdown(root) {
  let n = 0;
  for await (const file of pages(root)) {
    const rel = relative(root, file).replace(/index\.html$/, '');
    const md = toMarkdown(await readFile(file, 'utf8'), '/' + rel);
    if (!md) continue;
    // La portada de cada idioma va como index.md de su carpeta; el resto, junto a la carpeta de la página.
    const out = rel === '' || rel === 'es/' ? join(root, rel, 'index.md') : join(root, rel.replace(/\/$/, '') + '.md');
    await writeFile(out, md);
    n++;
  }
  return n;
}

if (import.meta.url === `file://${process.argv[1]}`) console.log(await writeMachineMarkdown(process.argv[2] || 'dist'), 'páginas');
