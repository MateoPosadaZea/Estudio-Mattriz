// v2: proyectos que usan el diseño nuevo de caso de estudio (src/views/CaseStudy.astro).
//
// Hay dos fuentes de contenido:
// - MODEL_CASES: el contenido sale del modelo del proyecto (src/data/projects/<slug>.json + i18n),
//   el mismo del vivo; aquí solo va la puesta en página (tema, acento tomado de las piezas de la
//   marca, media principal, orden de secciones y galerías). Los índices de media siguen el orden
//   en que aparecen en el modelo. El parallax recorta un poco los bordes: solo en fotos.
// - MANUAL_CASES: el caso se escribe completo en src/data/cases/<caso>.ts (Spot On, caso nuevo
//   de 2026 publicado en /work/spot-on/case-study.html).

import type { Lang } from '../i18n';
import type { CaseDoc } from '../components/case/doc';
import { spotOn } from './cases/spot-on';

export type ModelBlock =
  | { section: 'challenge' | 'approach' | 'whatwedo' | 'impact' | 'details' }
  | { media: number[]; layout: 'full' | 'pair' | 'inset' | 'wide'; parallax?: boolean };

export type ModelCase = {
  name: string;
  theme: 'dark' | 'light';
  accent: string;
  onAccent: string;
  hero: number;
  flow: ModelBlock[];
  stats?: Record<Lang, { value: string; label: string }[]>;
};

export const MODEL_CASES: Record<string, ModelCase> = {
  'the-grid': {
    name: 'The Grid',
    theme: 'dark',
    accent: '#0000ff',
    onAccent: '#ffffff',
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
};

export const MANUAL_CASES: Record<string, (lang: Lang) => CaseDoc> = {
  'spot-on-mobile-wash-detailing': spotOn,
};

export const isCase = (slug: string) => slug in MODEL_CASES || slug in MANUAL_CASES;

export const CASE_UI = {
  en: { eyebrow: 'Case study', next: 'Next project', visit: 'Visit the live site' },
  es: { eyebrow: 'Caso de estudio', next: 'Siguiente proyecto', visit: 'Visita el sitio en vivo' },
};
