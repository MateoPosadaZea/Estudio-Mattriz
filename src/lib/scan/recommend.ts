// Escáner de sitios: del resultado del análisis a un puntaje y un plan paso a paso.
// Cada paso corresponde a uno de los servicios del home ("What we build"). Los textos van en la
// página (por id), y los precios en src/data/scan-pricing.ts.

import type { ScanResult } from './analyze';

export type StepId =
  | 'https'
  | 'booking-new'
  | 'booking-upgrade'
  | 'payments'
  | 'automation'
  | 'dashboard'
  | 'contact'
  | 'site'
  | 'analytics'
  | 'local-seo'
  | 'reviews';

export type Area = { id: 'booking' | 'payments' | 'contact' | 'tracking' | 'local' | 'site'; score: number; max: number };

export type Plan = { score: number; areas: Area[]; steps: StepId[] };

const HEAVY_BUILDERS = ['elementor', 'divi', 'wpbakery', 'avada', 'beaver'];
const HEAVY_PLATFORMS = ['wix', 'godaddy', 'duda', 'weebly'];

export function plan(r: ScanResult): Plan {
  const has = (list: { id: string }[], ...ids: string[]) => list.some((h) => ids.includes(h.id));
  const hasBooking = r.booking.length > 0;
  const hasPayments = r.payments.length > 0;
  const quickContact = has(r.contact, 'whatsapp', 'phone') || has(r.chat, 'whatsapp-widget');
  const tracking = has(r.analytics, 'ga4', 'gtm');
  const heavy =
    !r.seo.viewport ||
    r.weight.htmlKB > 350 ||
    r.weight.thirdPartyScripts > 15 ||
    has(r.builders, ...HEAVY_BUILDERS) ||
    has(r.platform, ...HEAVY_PLATFORMS);

  // Puntaje de "listo para operar solo" (0–100), por áreas.
  const areas: Area[] = [
    { id: 'booking', max: 25, score: hasBooking ? 15 : 0 },
    { id: 'payments', max: 20, score: hasPayments ? 20 : 0 },
    { id: 'contact', max: 15, score: (quickContact ? 10 : 0) + (has(r.contact, 'form') ? 5 : 0) },
    { id: 'tracking', max: 10, score: tracking ? 10 : has(r.analytics, 'ua') ? 3 : 0 },
    { id: 'local', max: 15, score: (r.seo.localBusiness ? 6 : 0) + (r.reviews.length ? 5 : 0) + (r.seo.title && r.seo.description ? 4 : r.seo.title ? 2 : 0) },
    { id: 'site', max: 15, score: (r.https ? 5 : 0) + (r.seo.viewport ? 4 : 0) + (heavy ? 0 : 6) },
  ];
  const score = areas.reduce((s, a) => s + a.score, 0);

  // Plan en orden de impacto.
  const steps: StepId[] = [];
  if (!r.https) steps.push('https');
  steps.push(hasBooking ? 'booking-upgrade' : 'booking-new');
  if (!hasPayments) steps.push('payments');
  steps.push('automation');
  if (!quickContact) steps.push('contact');
  if (heavy) steps.push('site');
  steps.push('dashboard');
  if (!tracking) steps.push('analytics');
  if (!r.seo.localBusiness || !r.seo.description) steps.push('local-seo');
  if (!r.reviews.length) steps.push('reviews');

  return { score, areas, steps };
}
