// Índice de sitemaps (misma forma que @astrojs/sitemap). Los sitemaps de AIOSEO redirigen aquí (_redirects).
import type { APIRoute } from 'astro';
import { SITE } from '../data/site';

export const GET: APIRoute = () =>
  new Response(
    `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  <sitemap><loc>${SITE.url}/sitemap-0.xml</loc></sitemap>\n</sitemapindex>\n`,
    { headers: { 'Content-Type': 'application/xml; charset=utf-8' } },
  );
