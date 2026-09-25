// Utilidades compartidas por los scripts de captura (Fase 0).
import { chromium } from 'playwright';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

export const BASE = process.env.CAPTURE_BASE || 'https://mattriz.com';
export const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');
export const REF = path.join(ROOT, 'reference');
export const VIEWPORTS = { desktop: { width: 1440, height: 900 }, mobile: { width: 390, height: 844 } };

// Rutas que se inventarían pero no se descargan (brief 3.3: datos de clientes).
export const PRIVATE_PREFIXES = ['/propuestas'];
// Rutas de sistema de WordPress que no son páginas.
export const SKIP_PATTERNS = [/^\/wp-(admin|json|includes|content|login)/, /^\/xmlrpc\.php/, /\/feed\/?$/, /^\/\?/];

export function out(...p) {
  const f = path.join(REF, ...p);
  fs.mkdirSync(path.dirname(f), { recursive: true });
  return f;
}

export function slug(url) {
  const u = new URL(url);
  const s = (u.pathname.replace(/^\/|\/$/g, '').replace(/\.html$/, '') || 'home').replace(/[^a-z0-9.-]+/gi, '_');
  return s;
}

export function isPrivate(pathname) {
  return PRIVATE_PREFIXES.some((p) => pathname === p || pathname.startsWith(p + '/'));
}

// En entornos con proxy de salida, Chromium no lee HTTPS_PROXY por sí solo.
export async function launch() {
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  return chromium.launch(proxy ? { proxy: { server: proxy } } : {});
}

export function loadPages() {
  const f = path.join(REF, 'pages.json');
  if (!fs.existsSync(f)) throw new Error('Falta reference/pages.json. Corre primero: npm run crawl');
  return JSON.parse(fs.readFileSync(f, 'utf8'));
}

// Recorre la página de arriba a abajo para disparar lazy-load y animaciones de scroll.
export async function scrollThrough(page, step = 300, delay = 250) {
  await page.evaluate(async ({ step, delay }) => {
    const h = () => document.documentElement.scrollHeight;
    for (let y = 0; y < h(); y += step) {
      window.scrollTo(0, y);
      await new Promise((r) => setTimeout(r, delay));
    }
    window.scrollTo(0, h());
    await new Promise((r) => setTimeout(r, 1200));
    window.scrollTo(0, 0);
  }, { step, delay });
  await page.waitForTimeout(800);
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
