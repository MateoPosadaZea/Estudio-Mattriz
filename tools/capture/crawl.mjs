// 1.1 Inventario de URLs + 1.2 espejo de HTML/CSS + fuentes + canónico.
import fs from 'node:fs';
import { BASE, out, slug, isPrivate, SKIP_PATTERNS, launch, scrollThrough, sleep } from './lib.mjs';

const origin = new URL(BASE).origin;
const host = new URL(BASE).host.replace(/^www\./, '');

async function text(url) {
  const r = await fetch(url, { redirect: 'follow' });
  return { status: r.status, url: r.url, body: await r.text() };
}

// --- Sitemaps (AIOSEO / Rank Math / core, lo que haya) ---
async function sitemapUrls() {
  const seen = new Set();
  const pages = new Set();
  const queue = [`${origin}/sitemap_index.xml`, `${origin}/sitemap.xml`];
  while (queue.length) {
    const sm = queue.shift();
    if (seen.has(sm)) continue;
    seen.add(sm);
    const { status, url, body } = await text(sm).catch(() => ({ status: 0, body: '' }));
    if (status !== 200) continue;
    seen.add(url);
    const locs = [...body.matchAll(/<loc>(?:<!\[CDATA\[)?\s*([^<\]]+?)\s*(?:\]\]>)?<\/loc>/g)].map((m) => m[1]);
    const isIndex = /<sitemapindex/.test(body);
    for (const l of locs) (isIndex ? queue.push(l) : pages.add(l));
  }
  return { sitemaps: [...seen], pages: [...pages] };
}

// --- Canónico www vs sin-www, http vs https ---
async function canonical() {
  const variants = [`https://${host}/`, `https://www.${host}/`, `http://${host}/`, `http://www.${host}/`];
  const rows = [];
  for (const v of variants) {
    try {
      const r = await fetch(v, { redirect: 'manual' });
      rows.push({ url: v, status: r.status, location: r.headers.get('location') || '' });
    } catch (e) {
      rows.push({ url: v, status: 'error', location: String(e.cause?.code || e.message) });
    }
  }
  return rows;
}

// --- Inventario de carpetas estáticas conocidas (sin descargar contenido privado) ---
async function probe(url) {
  try {
    const r = await fetch(url, { redirect: 'manual' });
    const body = r.headers.get('content-type')?.includes('html') ? await r.text() : '';
    return { url, status: r.status, type: r.headers.get('content-type') || '', length: r.headers.get('content-length') || '', location: r.headers.get('location') || '', body };
  } catch (e) {
    return { url, status: 'error', type: '', length: '', location: '', body: '' };
  }
}

function listingLinks(base, html) {
  // Autoindex de Apache/LiteSpeed: <a href="archivo">
  if (!/Index of/i.test(html)) return [];
  return [...html.matchAll(/<a href="([^"?#]+)"/g)].map((m) => m[1]).filter((h) => !h.startsWith('/') && h !== '../').map((h) => new URL(h, base).href);
}

const { sitemaps, pages: smPages } = await sitemapUrls();
const canon = await canonical();
console.log(`sitemaps: ${sitemaps.length}, urls en sitemap: ${smPages.length}`);

const seeds = new Set([`${origin}/`, ...smPages, `${origin}/work/spot-on/case-study.html`]);
const queue = [...seeds];
const visited = new Map();
const cssSaved = new Map();
const fontsByPage = {};
const discoveredFrom = {};

const browser = await launch();
const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });

while (queue.length) {
  const url = queue.shift().split('#')[0];
  const u = new URL(url);
  if (visited.has(u.href) || u.host.replace(/^www\./, '') !== host) continue;
  if (SKIP_PATTERNS.some((re) => re.test(u.pathname + u.search))) continue;
  if (isPrivate(u.pathname)) continue;
  if (/\.(pdf|jpe?g|png|gif|webp|svg|zip|mp4|webm|xml)$/i.test(u.pathname)) continue;

  const page = await ctx.newPage();
  const cssUrls = new Set();
  page.on('response', (r) => { if (r.request().resourceType() === 'stylesheet') cssUrls.add(r.url()); });
  let resp;
  try {
    resp = await page.goto(u.href, { waitUntil: 'networkidle', timeout: 60000 });
  } catch (e) {
    visited.set(u.href, { url: u.href, status: 'error', error: e.message });
    console.log(`ERROR ${u.href}: ${e.message.split('\n')[0]}`);
    await page.close();
    continue;
  }
  if (resp?.status() === 403 && /Bot Verification/i.test(await page.title()) && !u.searchParams.has('__retry')) {
    console.log(`anti-bot en ${u.href}, espero 20s y reintento`);
    await sleep(20000);
    resp = await page.goto(u.href, { waitUntil: 'networkidle', timeout: 60000 });
  }
  await scrollThrough(page);
  const info = await page.evaluate(() => {
    const meta = (n) => document.querySelector(`meta[name="${n}"]`)?.content || '';
    const prop = (n) => document.querySelector(`meta[property="${n}"]`)?.content || '';
    const linksIn = (sel) => [...document.querySelectorAll(`${sel} a[href]`)].map((a) => a.href).filter((h) => typeof h === "string" && /^https?:/.test(h));
    return {
      title: document.title,
      robots: meta('robots'),
      description: meta('description'),
      canonical: document.querySelector('link[rel="canonical"]')?.href || '',
      ogImage: prop('og:image'),
      ogTitle: prop('og:title'),
      lang: document.documentElement.lang,
      isWordPress: !!document.querySelector('link[href*="wp-content"],script[src*="wp-content"],script[src*="wp-includes"]') || /\bwp-|page-id-|postid-/.test(document.body.className),
      bodyClass: document.body.className,
      h1: [...document.querySelectorAll('h1')].map((h) => h.innerText.trim()),
      navLinks: linksIn('header, nav, #header-outer, #slide-out-widget-area'),
      footerLinks: linksIn('footer, #footer-outer'),
      allLinks: [...document.querySelectorAll('a[href]')].map((a) => a.href),
      fonts: [...document.fonts].map((f) => ({ family: f.family.replace(/["']/g, ''), weight: f.weight, style: f.style, status: f.status })),
      fontLinks: [...document.querySelectorAll('link[href]')].map((l) => l.href).filter((h) => /fonts\.googleapis|typekit|use\.typekit|fonts\.bunny|fontawesome|\.woff2?|\.ttf|\.otf/.test(h)),
    };
  });
  const html = await page.content();
  const s = slug(u.href);
  fs.writeFileSync(out('html', `${s}.html`), html);

  for (const c of cssUrls) {
    if (cssSaved.has(c)) { cssSaved.get(c).pages.push(s); continue; }
    try {
      const r = await fetch(c);
      const body = await r.text();
      const name = (new URL(c).host.replace(/[^a-z0-9]+/gi, '_') + '_' + new URL(c).pathname.split('/').pop()).replace(/[^a-z0-9._-]+/gi, '_');
      fs.writeFileSync(out('css', name), body);
      cssSaved.set(c, { file: name, pages: [s], bytes: body.length });
    } catch { /* ignorar */ }
  }
  fontsByPage[s] = { loaded: info.fonts.filter((f) => f.status === 'loaded'), links: info.fontLinks };

  visited.set(u.href, { url: u.href, status: resp?.status(), finalUrl: page.url(), slug: s, inSitemap: smPages.includes(u.href), ...info, allLinks: undefined, navLinks: undefined, footerLinks: undefined });
  console.log(`${resp?.status()} ${u.href}  "${info.title}"`);

  // Recorrer menú y footer (brief 1.1); también registrar enlaces internos del cuerpo.
  for (const l of [...info.navLinks, ...info.footerLinks, ...info.allLinks]) {
    const lu = new URL(l);
    if (lu.host.replace(/^www\./, '') !== host) continue;
    const k = lu.origin + lu.pathname;
    (discoveredFrom[k] ||= new Set()).add(s);
    if (!visited.has(k)) queue.push(k);
  }
  await page.close();
  await sleep(1500);
}
await browser.close();

// --- Carpetas estáticas fuera de WordPress ---
const staticProbe = [];
for (const dir of ['/work/', '/work/spot-on/', '/work/spot-on/img/', '/propuestas/']) {
  const p = await probe(origin + dir);
  const children = listingLinks(p.url, p.body);
  staticProbe.push({ ...p, body: undefined, children });
}
// Imágenes del caso de Spot On (referenciadas desde el HTML)
const spotHtmlFile = out('html', 'work_spot-on_case-study.html');
const spotImgs = fs.existsSync(spotHtmlFile)
  ? [...new Set([...fs.readFileSync(spotHtmlFile, 'utf8').matchAll(/(?:src|href|srcset)="([^"]*img\/[^"\s]+)/g)].map((m) => new URL(m[1], `${origin}/work/spot-on/case-study.html`).href))]
  : [];
for (const img of spotImgs) {
  if (!img.startsWith(origin + '/work/spot-on/')) continue;
  const r = await fetch(img);
  if (r.ok) fs.writeFileSync(out('static', new URL(img).pathname.replace(/^\//, '')), Buffer.from(await r.arrayBuffer()));
}

// --- Salidas ---
const rows = [...visited.values()];
fs.writeFileSync(out('pages.json'), JSON.stringify(rows.filter((r) => r.status === 200).map((r) => ({ url: r.url, slug: r.slug, title: r.title })), null, 2));
fs.writeFileSync(out('crawl.json'), JSON.stringify({ sitemaps, canonical: canon, pages: rows, css: Object.fromEntries(cssSaved), fontsByPage, staticProbe, spotImgs, discoveredFrom: Object.fromEntries(Object.entries(discoveredFrom).map(([k, v]) => [k, [...v]])) }, null, 2));

let md = `# Inventario de URLs\n\nCapturado: ${new Date().toISOString()} desde ${origin}\n\n`;
md += `## Canónico\n\n| Variante | Estado | Redirige a |\n|---|---|---|\n` + canon.map((c) => `| ${c.url} | ${c.status} | ${c.location} |`).join('\n') + '\n\n';
md += `## Sitemaps\n\n` + sitemaps.map((s) => `- ${s}`).join('\n') + '\n\n';
md += `## Páginas\n\n| URL | Estado | Título | Robots | En sitemap | Tipo |\n|---|---|---|---|---|---|\n`;
md += rows.sort((a, b) => a.url.localeCompare(b.url)).map((r) => `| ${r.url.replace(origin, '') || '/'} | ${r.status}${r.finalUrl && r.finalUrl !== r.url ? ` → ${r.finalUrl.replace(origin, '')}` : ''} | ${(r.title || '').replace(/\|/g, '\\|')} | ${r.robots || '(sin meta)'} | ${r.inSitemap ? 'sí' : 'no'} | ${r.status === 200 ? (r.isWordPress ? 'WordPress' : 'Estático') : ''} |`).join('\n') + '\n\n';
md += `## Carpetas estáticas\n\n| Ruta | Estado | Tipo | Contenido listado |\n|---|---|---|---|\n` + staticProbe.map((p) => `| ${p.url.replace(origin, '')} | ${p.status} | ${p.type} | ${p.children.length ? p.children.length + ' archivos' : '(sin listado)'} |`).join('\n') + '\n';
fs.writeFileSync(out('URLS.md'), md);
console.log('listo: reference/URLS.md');
