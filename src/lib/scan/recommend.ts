// Escáner de sitios: del resultado del análisis a un puntaje y un plan paso a paso, según el tipo de
// negocio (analyze.ts, "kind"): una tienda no recibe un sistema de reservas, ni un negocio que vende
// por consultas un checkout. Los textos van en la página (por id), y los precios en
// src/data/scan-pricing.ts.

import type { Kind, ScanResult } from './analyze';

export type StepId =
  | 'https'
  // Negocio que agenda.
  | 'booking-new'
  | 'booking-upgrade'
  | 'payments'
  | 'automation'
  | 'dashboard'
  | 'local-seo'
  | 'reviews'
  // Tienda en línea.
  | 'store'
  | 'payments-store'
  | 'automation-store'
  | 'dashboard-store'
  | 'analytics-store'
  | 'seo-store'
  | 'reviews-store'
  // Negocio que vende por consultas.
  | 'leads'
  | 'automation-leads'
  | 'analytics-leads'
  | 'seo'
  | 'proof'
  // Comunes.
  | 'contact'
  | 'site'
  | 'analytics';

export type AreaId = 'booking' | 'store' | 'leads' | 'payments' | 'contact' | 'tracking' | 'local' | 'search' | 'site';

export type Area = { id: AreaId; score: number; max: number };

export type Plan = { kind: Kind; score: number; areas: Area[]; steps: StepId[] };

const HEAVY_BUILDERS = ['elementor', 'divi', 'wpbakery', 'avada', 'beaver'];
const HEAVY_PLATFORMS = ['wix', 'godaddy', 'duda', 'weebly'];

/** El plan para el tipo de negocio detectado, o para otro si el visitante lo corrige. */
export function plan(r: ScanResult, kind: Kind = r.kind): Plan {
  const has = (list: { id: string }[], ...ids: string[]) => list.some((h) => ids.includes(h.id));
  const hasBooking = r.booking.length > 0;
  const hasPayments = r.payments.length > 0;
  const quickContact = has(r.contact, 'whatsapp', 'phone') || has(r.chat, 'whatsapp-widget');
  const form = has(r.contact, 'form');
  const tracking = has(r.analytics, 'ga4', 'gtm');
  const titles = r.seo.title && r.seo.description ? 4 : r.seo.title ? 2 : 0;
  const heavy =
    !r.seo.viewport ||
    r.weight.htmlKB > 350 ||
    r.weight.thirdPartyScripts > 15 ||
    has(r.builders, ...HEAVY_BUILDERS) ||
    has(r.platform, ...HEAVY_PLATFORMS);
  const site: Area = { id: 'site', max: 15, score: (r.https ? 5 : 0) + (r.seo.viewport ? 4 : 0) + (heavy ? 0 : 6) };

  // Puntaje de "listo para funcionar solo" (0–100), por áreas; cada tipo suma 100.
  let areas: Area[];
  const steps: StepId[] = [];
  if (!r.https) steps.push('https');

  if (kind === 'store') {
    const platformStore = r.store.some((s) => !['cart', 'product-schema'].includes(s.id));
    const productSchema = has(r.store, 'product-schema');
    areas = [
      { id: 'store', max: 25, score: (platformStore ? 15 : 0) + (has(r.store, 'cart') ? 5 : 0) + (productSchema ? 5 : 0) },
      // Las plataformas de tienda ya traen su pago; un medio de pago propio o local suma el resto.
      { id: 'payments', max: 20, score: hasPayments ? 20 : platformStore ? 15 : 0 },
      { id: 'contact', max: 10, score: (quickContact ? 7 : 0) + (form ? 3 : 0) },
      { id: 'tracking', max: 15, score: (tracking ? 10 : has(r.analytics, 'ua') ? 3 : 0) + (has(r.analytics, 'meta-pixel', 'google-ads', 'tiktok') ? 5 : 0) },
      { id: 'search', max: 15, score: titles + (productSchema ? 6 : 0) + (r.reviews.length ? 5 : 0) },
      site,
    ];
    steps.push('store');
    if (!hasPayments && !platformStore) steps.push('payments-store');
    steps.push('automation-store');
    if (!quickContact) steps.push('contact');
    if (heavy) steps.push('site');
    steps.push('dashboard-store');
    if (!tracking) steps.push('analytics-store');
    if (!productSchema || !r.seo.description) steps.push('seo-store');
    if (!r.reviews.length) steps.push('reviews-store');
  } else if (kind === 'leads') {
    const meetings = hasBooking;
    areas = [
      { id: 'leads', max: 30, score: (form ? 18 : 0) + (meetings ? 12 : 0) },
      { id: 'contact', max: 20, score: (quickContact ? 15 : 0) + (has(r.contact, 'email') ? 5 : 0) },
      { id: 'tracking', max: 15, score: tracking ? 15 : has(r.analytics, 'ua') ? 4 : 0 },
      { id: 'search', max: 20, score: titles + (r.seo.localBusiness || r.seo.schema.length ? 8 : 0) + (r.reviews.length ? 8 : 0) },
      site,
    ];
    steps.push('leads');
    if (!quickContact) steps.push('contact');
    steps.push('automation-leads');
    if (heavy) steps.push('site');
    if (!tracking) steps.push('analytics-leads');
    if (!r.seo.description || (!r.seo.localBusiness && !r.seo.schema.length)) steps.push('seo');
    if (!r.reviews.length) steps.push('proof');
  } else {
    areas = [
      { id: 'booking', max: 25, score: hasBooking ? 15 : 0 },
      { id: 'payments', max: 20, score: hasPayments ? 20 : 0 },
      { id: 'contact', max: 15, score: (quickContact ? 10 : 0) + (form ? 5 : 0) },
      { id: 'tracking', max: 10, score: tracking ? 10 : has(r.analytics, 'ua') ? 3 : 0 },
      { id: 'local', max: 15, score: (r.seo.localBusiness ? 6 : 0) + (r.reviews.length ? 5 : 0) + titles },
      site,
    ];
    steps.push(hasBooking ? 'booking-upgrade' : 'booking-new');
    if (!hasPayments) steps.push('payments');
    steps.push('automation');
    if (!quickContact) steps.push('contact');
    if (heavy) steps.push('site');
    steps.push('dashboard');
    if (!tracking) steps.push('analytics');
    if (!r.seo.localBusiness || !r.seo.description) steps.push('local-seo');
    if (!r.reviews.length) steps.push('reviews');
  }

  const score = areas.reduce((s, a) => s + a.score, 0);
  return { kind, score, areas, steps };
}
