// Escáner: precios por paso del plan, en USD. PENDIENTE DE MATEO.
// Mientras un paso no tenga precio (null), la página no muestra cifras: ofrece enviar la
// cotización por correo. Cuando todos los pasos de un plan tengan precio, muestra el rango total.
// No inventar valores aquí: los define Mattriz.

import type { StepId } from '../lib/scan/recommend';

export const CURRENCY = 'USD';

export const PRICING: Record<StepId, { min: number; max: number } | null> = {
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
};
