// Versión para máquinas (modo Machine): convierte el <main> de cada página ya construida a Markdown y
// lo deja junto a ella (/about/ → /about.md, / → /index.md, /es/ → /es/index.md). Sale del HTML final,
// así que dice exactamente lo mismo que la página, en los dos idiomas, sin mantener un segundo texto.
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { join, relative } from 'node:path';
import { parse } from 'node-html-parser';
import { NodeHtmlMarkdown } from 'node-html-markdown';

const SITE = 'https://mattriz.com';
const nhm = new NodeHtmlMarkdown({ bulletMarker: '-', keepDataImages: false, maxConsecutiveNewlines: 2 });

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
  // Fuera lo decorativo y lo que solo sirve con mouse: lo oculto a lectores de pantalla, scripts,
  // íconos, medios sin texto, formularios y lo marcado a propósito con data-machine="skip".
  main.querySelectorAll('[aria-hidden="true"], script, style, noscript, svg, canvas, video, form, button, template, [data-machine="skip"]').forEach((n) => n.remove());
  // Títulos partidos en palabras para la animación: se usa el texto completo del aria-label.
  main.querySelectorAll('h1[aria-label], h2[aria-label], h3[aria-label]').forEach((h) => h.set_content(h.getAttribute('aria-label')));
  // Piezas que en pantalla se separan con CSS (cifra y rótulo, nombre y cargo): un espacio entre
  // elementos hermanos pegados, para que el texto no salga como "Build5+Years".
  main.querySelectorAll('*').forEach((el) => {
    const kids = el.childNodes;
    for (let i = kids.length - 1; i > 0; i--) if (kids[i].nodeType === 1 && kids[i - 1].nodeType === 1) kids[i].insertAdjacentHTML('beforebegin', ' ');
  });
  main.querySelectorAll('img').forEach((im) => (im.getAttribute('alt') ? im.setAttribute('src', new URL(im.getAttribute('src'), SITE).href) : im.remove()));
  main.querySelectorAll('a[href]').forEach((a) => a.setAttribute('href', new URL(a.getAttribute('href'), SITE + path).href));
  const title = doc.querySelector('title')?.text.trim() ?? '';
  const desc = doc.querySelector('meta[name="description"]')?.getAttribute('content') ?? '';
  const lang = doc.querySelector('html')?.getAttribute('lang') ?? 'en';
  const body = nhm.translate(main.innerHTML).replace(/\[([^\]]*?)\s+\]\(/g, '[$1](').replace(/\n{3,}/g, '\n\n').trim();
  return `---\ntitle: ${JSON.stringify(title)}\ndescription: ${JSON.stringify(desc)}\nlang: ${lang}\nurl: ${SITE}${path}\n---\n\n${body}\n`;
}

export async function writeMachineMarkdown(root) {
  let n = 0;
  for await (const file of pages(root)) {
    const rel = relative(root, file).replace(/index\.html$/, '');
    const path = '/' + rel;
    const md = toMarkdown(await readFile(file, 'utf8'), path);
    if (!md) continue;
    // La portada de cada idioma va como index.md de su carpeta; el resto, junto a la carpeta de la página.
    const out = rel === '' || rel === 'es/' ? join(root, rel, 'index.md') : join(root, rel.replace(/\/$/, '') + '.md');
    await writeFile(out, md);
    n++;
  }
  return n;
}

if (import.meta.url === `file://${process.argv[1]}`) console.log(await writeMachineMarkdown(process.argv[2] || 'dist'), 'páginas');
