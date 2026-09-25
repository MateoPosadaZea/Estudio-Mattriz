// Sitemap de las páginas indexables (sin 404 ni el caso de estudio, que es noindex como en el vivo).
// Escrito a mano para no sumar la dependencia @astrojs/sitemap por 10 URLs.
import type { APIRoute } from 'astro';
import { SITE } from '../data/site';

const projects = Object.keys(import.meta.glob('../data/projects/*.json')).map((p) => p.split('/').pop()!.replace('.json', ''));

export const PATHS = ['/', '/about/', '/contact/', ...projects.map((slug) => `/project/${slug}/`)];

export const GET: APIRoute = () => {
  const urls = PATHS.map((p) => `  <url><loc>${SITE.url}${p}</loc></url>`).join('\n');
  return new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
};
