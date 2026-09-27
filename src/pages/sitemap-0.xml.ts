// Sitemap de las páginas indexables (sin la 404).
// Escrito a mano para no sumar la dependencia @astrojs/sitemap por 10 URLs.
import type { APIRoute } from 'astro';
import { SITE } from '../data/site';

import { PROJECT_SLUGS } from '../data/projects';

const EN = ['/', '/about/', '/contact/', '/scan/', ...PROJECT_SLUGS.map((slug) => `/project/${slug}/`)];
// Inglés en la raíz y español bajo /es/ (con hreflang en cada página).
export const PATHS = [...EN, ...EN.map((p) => `/es${p}`)];

// Cada URL lleva sus alternas de idioma (hreflang) y la fecha del build como lastmod.
const LASTMOD = new Date().toISOString().slice(0, 10);
const pair = (p: string) => (p.startsWith('/es/') ? p.slice(3) : p);

export const GET: APIRoute = () => {
  const urls = PATHS.map((p) => {
    const en = pair(p);
    const alts = [
      `    <xhtml:link rel="alternate" hreflang="en" href="${SITE.url}${en}"/>`,
      `    <xhtml:link rel="alternate" hreflang="es" href="${SITE.url}/es${en}"/>`,
      `    <xhtml:link rel="alternate" hreflang="x-default" href="${SITE.url}${en}"/>`,
    ].join('\n');
    return `  <url>\n    <loc>${SITE.url}${p}</loc>\n    <lastmod>${LASTMOD}</lastmod>\n${alts}\n  </url>`;
  }).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
