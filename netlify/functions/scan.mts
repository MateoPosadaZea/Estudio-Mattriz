// Solo para el preview de Netlify: el mismo escáner que corre en el Worker de Cloudflare.
// Aquí además se comprueba por DNS que el sitio no apunte a una IP privada.
import { lookup } from 'node:dns/promises';
import { handleScan, handleLead } from '../../src/lib/scan/http';

const PRIVATE = [/^10\./, /^127\./, /^0\./, /^169\.254\./, /^172\.(1[6-9]|2\d|3[01])\./, /^192\.168\./, /^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./, /^::1$/, /^f[cd]/i, /^fe80/i, /^::ffff:(10|127|169\.254|192\.168)\./i];

async function isPublicHost(host: string) {
  try {
    const addrs = await lookup(host, { all: true });
    return addrs.length > 0 && addrs.every((a) => !PRIVATE.some((re) => re.test(a.address)));
  } catch {
    return false;
  }
}

export default async (request: Request) => {
  const { pathname } = new URL(request.url);
  if (pathname === '/api/scan-lead') {
    return handleLead(request, { RESEND_API_KEY: process.env.RESEND_API_KEY, TURNSTILE_SECRET: process.env.TURNSTILE_SECRET, CONTACT_TO: process.env.CONTACT_TO, CONTACT_FROM: process.env.CONTACT_FROM });
  }
  return handleScan(request, isPublicHost);
};

export const config = { path: ['/api/scan', '/api/scan-lead'] };
