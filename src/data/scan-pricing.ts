// Escáner: precio de cada paso del plan, mínimo y máximo, en USD (página en inglés) y en COP
// (página en español). PENDIENTE DE MATEO (hoja mattriz-escaner-precios.xlsx).
// La página no muestra precios por paso: solo el rango total del plan de cada sitio (suma de los
// mínimos y de los máximos de sus pasos). Si a un paso del plan le falta el precio (null), no
// muestra total y ofrece la cotización por correo.
// No inventar valores aquí: los define Mattriz.

import type { StepId } from '../lib/scan/recommend';

/** Moneda de cada idioma. */
export const CURRENCY = { en: 'USD', es: 'COP' } as const;

type Range = { min: number; max: number };

export const PRICING: Record<StepId, { usd: Range; cop: Range } | null> = {
  https: null,
  'booking-new': null,
  'booking-upgrade': null,
  payments: null,
  automation: null,
  dashboard: null,
  contact: null,
  site: null,
  analytics: null,
  'local-seo': null,
  reviews: null,
  store: null,
  'payments-store': null,
  'automation-store': null,
  'dashboard-store': null,
  'analytics-store': null,
  'seo-store': null,
  'reviews-store': null,
  leads: null,
  'automation-leads': null,
  'analytics-leads': null,
  seo: null,
  proof: null,
};
