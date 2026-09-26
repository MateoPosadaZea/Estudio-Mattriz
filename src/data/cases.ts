// v2: casos de estudio con el diseño nuevo. El contenido sale del modelo del proyecto
// (src/data/projects/<slug>.json + i18n); aquí solo va la puesta en página:
// tema, color de acento (tomado de las piezas de cada marca), video/imagen principal,
// orden de secciones y galerías, y las cifras destacadas (tomadas de la lista "Impact").
// Los índices de media siguen el orden en que aparecen en el modelo. El parallax recorta un
// poco los bordes, así que solo va en fotos, nunca en capturas de pantalla.

import type { Lang } from '../i18n';

export type Block =
  | { section: 'challenge' | 'approach' | 'whatwedo' | 'impact' | 'details' }
  | { media: number[]; layout: 'full' | 'pair' | 'inset' | 'wide'; parallax?: boolean };

export type CaseConfig = {
  name: string;
  theme: 'dark' | 'light';
  accent: string;
  hero: number;
  flow: Block[];
  stats?: Record<Lang, { value: string; label: string }[]>;
};

export const CASES: Record<string, CaseConfig> = {
  'the-grid': {
    name: 'The Grid',
    theme: 'dark',
    accent: '#0000ff',
    hero: 11,
    flow: [
      { section: 'challenge' },
      { media: [13], layout: 'full', parallax: true },
      { media: [0, 9], layout: 'pair' },
      { section: 'approach' },
      { media: [3, 5], layout: 'pair' },
      { media: [2, 4], layout: 'pair' },
      { media: [7], layout: 'wide' },
      { section: 'whatwedo' },
      { media: [1], layout: 'inset' },
      { media: [8], layout: 'wide' },
      { section: 'impact' },
      { media: [6], layout: 'full' },
      { media: [10, 12], layout: 'pair' },
      { section: 'details' },
    ],
  },
  'spot-on-mobile-wash-detailing': {
    name: 'Spot On',
    theme: 'light',
    accent: '#f4d547',
    hero: 0,
    flow: [
      { section: 'challenge' },
      { media: [1], layout: 'full' },
      { section: 'approach' },
      { media: [2, 3], layout: 'pair' },
      { section: 'whatwedo' },
      { media: [4], layout: 'wide' },
      { section: 'impact' },
      { media: [5], layout: 'full' },
      { section: 'details' },
    ],
    stats: {
      en: [
        { value: '+25–40%', label: 'CTA clicks (WhatsApp/call)' },
        { value: '< 2.5s', label: 'LCP on mobile' },
        { value: '< 0.1', label: 'CLS' },
      ],
      es: [
        { value: '+25–40 %', label: 'Más clics en los llamados a la acción (WhatsApp y llamada)' },
        { value: '< 2.5 s', label: 'LCP en móvil' },
        { value: '< 0.1', label: 'CLS' },
      ],
    },
  },
};

export const CASE_UI = {
  en: { eyebrow: 'Case study', next: 'Next project', visit: 'Visit the live site' },
  es: { eyebrow: 'Caso de estudio', next: 'Siguiente proyecto', visit: 'Visita el sitio en vivo' },
};
