// Escáner de sitios: descarga segura de las páginas a analizar (Worker de Cloudflare y función de
// Netlify). Protecciones: solo http/https en puertos estándar, sin IPs literales ni nombres
// internos, redirecciones revisadas una por una (máx. 5), tiempo máximo por página y tope de tamaño.
// En Node (Netlify) se pasa además `isPublicHost` para comprobar la IP real resuelta por DNS.

import { analyze, interestingLinks, type Page, type ScanResult } from './analyze';

const MAX_BYTES = 1_500_000;
const PAGE_TIMEOUT = 9000;
const UA = 'Mozilla/5.0 (compatible; MattrizScanner/1.0; +https://mattriz.com/scan/)';

export type ScanErrorCode = 'invalid' | 'blocked' | 'unreachable' | 'not-html' | 'timeout';

export class ScanError extends Error {
  code: ScanErrorCode;
  constructor(code: ScanErrorCode) {
    super(code);
    this.code = code;
  }
}

/** Normaliza lo que escribe la persona ("misitio.com", "http://…") a una URL válida. */
export function normalizeUrl(input: string): URL {
  let raw = input.trim();
  if (!raw || raw.length > 300) throw new ScanError('invalid');
  if (!/^[a-z][a-z0-9+.-]*:\/\//i.test(raw)) raw = `https://${raw}`;
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    throw new ScanError('invalid');
  }
  checkUrl(u);
  u.hash = '';
  return u;
}

function checkUrl(u: URL) {
  if (!/^https?:$/.test(u.protocol)) throw new ScanError('blocked');
  if (u.username || u.password) throw new ScanError('blocked');
  if (u.port && !['80', '443'].includes(u.port)) throw new ScanError('blocked');
  const h = u.hostname.toLowerCase();
  // Nada de IPs literales (v4 o v6), ni nombres internos, ni sin punto.
  if (/^\d+(\.\d+){0,3}$/.test(h) || h.includes(':') || h.startsWith('[')) throw new ScanError('blocked');
  if (!h.includes('.') || /(^|\.)(localhost|local|internal|intranet|lan|home|corp|localdomain|arpa)$/.test(h)) throw new ScanError('blocked');
  if (/\.(test|invalid|example)$/.test(h)) throw new ScanError('invalid');
}

async function readLimited(res: Response): Promise<string> {
  const reader = res.body?.getReader();
  if (!reader) return '';
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (size < MAX_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    size += value.length;
  }
  reader.cancel().catch(() => {});
  const all = new Uint8Array(Math.min(size, MAX_BYTES));
  let offset = 0;
  for (const c of chunks) {
    const part = c.subarray(0, Math.min(c.length, all.length - offset));
    all.set(part, offset);
    offset += part.length;
    if (offset >= all.length) break;
  }
  return new TextDecoder('utf-8', { fatal: false }).decode(all);
}

export async function fetchPage(start: URL, isPublicHost?: (host: string) => Promise<boolean>): Promise<Page> {
  let current = start;
  for (let hop = 0; hop <= 5; hop++) {
    checkUrl(current);
    if (isPublicHost && !(await isPublicHost(current.hostname))) throw new ScanError('blocked');
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), PAGE_TIMEOUT);
    let res: Response;
    try {
      res = await fetch(current.toString(), {
        redirect: 'manual',
        signal: ctrl.signal,
        headers: { 'User-Agent': UA, Accept: 'text/html,application/xhtml+xml;q=0.9,*/*;q=0.5', 'Accept-Language': 'en-US,en;q=0.8,es;q=0.6' },
      });
    } catch (e) {
      clearTimeout(timer);
      throw new ScanError((e as Error)?.name === 'AbortError' ? 'timeout' : 'unreachable');
    }
    if ([301, 302, 303, 307, 308].includes(res.status)) {
      clearTimeout(timer);
      const loc = res.headers.get('location');
      if (!loc) throw new ScanError('unreachable');
      current = new URL(loc, current);
      continue;
    }
    try {
      if (!res.ok) throw new ScanError('unreachable');
      const type = res.headers.get('content-type') || '';
      if (type && !/html|xml/i.test(type)) throw new ScanError('not-html');
      const html = await readLimited(res);
      const headers: Record<string, string> = {};
      res.headers.forEach((v, k) => (headers[k.toLowerCase()] = v));
      return { url: current.toString(), html, headers };
    } catch (e) {
      if (e instanceof ScanError) throw e;
      throw new ScanError((e as Error)?.name === 'AbortError' ? 'timeout' : 'unreachable');
    } finally {
      clearTimeout(timer);
    }
  }
  throw new ScanError('unreachable');
}

/** Escanea la página principal y hasta 3 internas de reservas/precios/servicios. */
export async function scanSite(input: string, isPublicHost?: (host: string) => Promise<boolean>): Promise<ScanResult> {
  const start = normalizeUrl(input);
  const main = await fetchPage(start, isPublicHost);
  const extra = await Promise.all(
    interestingLinks(main.url, main.html).map((u) => fetchPage(new URL(u), isPublicHost).catch(() => null)),
  );
  return analyze(start.toString(), [main, ...extra.filter((p): p is Page => !!p)]);
}
