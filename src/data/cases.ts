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
import type { LegacyCase } from '../components/case/fromLegacy';

export type ModelBlock =
  | { section: 'challenge' | 'approach' | 'whatwedo' | 'impact' | 'details' }
  | { media: number[]; layout: 'full' | 'pair' | 'trio' | 'inset' | 'wide'; parallax?: boolean };

export type ModelCase = {
  name: string;
  theme: 'dark' | 'light';
  bg?: string;
  accent: string;
  onAccent: string;
  hero: number;
  flow: ModelBlock[];
  stats?: Record<Lang, { value: string; label: string }[]>;
};

export const MODEL_CASES: Record<string, ModelCase> = {
  civilus: {
    name: 'Civilus',
    theme: 'dark',
    bg: '#060f27',
    accent: '#d93131',
    onAccent: '#ffffff',
    hero: 0,
    flow: [
      { section: 'challenge' },
      { media: [7], layout: 'full' },
      { media: [2, 1], layout: 'pair' },
      { section: 'approach' },
      { media: [5, 6], layout: 'pair' },
      { section: 'whatwedo' },
      { media: [8, 10], layout: 'pair' },
      { section: 'impact' },
      { media: [3], layout: 'full' },
      { media: [9, 4], layout: 'pair' },
      { section: 'details' },
    ],
  },
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

// Páginas antiguas (2021–2022), con otra estructura: src/components/case/fromLegacy.ts.
// Índices de media en el orden de legacyMedia() (incluye imágenes y videos de fondo de fila).
export const LEGACY_CASES: Record<string, LegacyCase> = {
  'posada-carcamo-abogados': {
    legacy: true,
    name: 'Posada Carcamo Abogados',
    theme: 'light',
    accent: '#560323',
    onAccent: '#ffffff',
    hero: 0,
    flow: [
      { section: 'summary' },
      { media: [1], layout: 'full' },
      { media: [3, 4], layout: 'pair' },
      { section: 'whatwedid' },
      { media: [2], layout: 'wide' },
      { media: [5], layout: 'full', parallax: true },
    ],
  },
  'let-it-go': {
    legacy: true,
    name: 'Let it Go',
    siteLabel: { en: 'See the prototype', es: 'Ver el prototipo' },
    theme: 'light',
    bg: '#ececf8',
    accent: '#f63d1b',
    onAccent: '#0a0a0a',
    hero: 0,
    flow: [
      { section: 'summary' },
      { media: [1, 2], layout: 'pair' },
      { media: [3], layout: 'wide' },
      { media: [4], layout: 'wide' },
      { media: [6, 7], layout: 'pair' },
      { media: [8], layout: 'wide' },
      { section: 'whatwedid' },
      { media: [9, 10], layout: 'pair' },
      { media: [11], layout: 'wide' },
      { media: [12], layout: 'wide' },
      { media: [13, 15], layout: 'pair' },
      { media: [17, 18, 19], layout: 'trio' },
      { media: [20], layout: 'full', parallax: true },
      { media: [22], layout: 'inset' },
      { media: [23], layout: 'full', parallax: true },
    ],
  },
  aglvanstours: {
    legacy: true,
    name: 'AGL Vans Tours',
    theme: 'dark',
    accent: '#22b050',
    onAccent: '#0a0a0a',
    hero: 1,
    flow: [
      { section: 'summary' },
      { media: [0], layout: 'full', parallax: true },
      { section: 'whatwedid' },
      { media: [2], layout: 'full' },
      { media: [3], layout: 'full' },
    ],
  },
  'luciana-cabanas': {
    legacy: true,
    name: 'Luciana Cabañas',
    theme: 'dark',
    bg: '#2a1006',
    accent: '#bf9571',
    onAccent: '#2a1006',
    hero: 0,
    flow: [
      { section: 'summary' },
      { media: [1, 6], layout: 'pair' },
      { media: [2], layout: 'full' },
      { media: [3, 4, 5], layout: 'trio' },
      { section: 'whatwedid' },
      { media: [7, 8], layout: 'pair' },
    ],
  },
};

export const MANUAL_CASES: Record<string, (lang: Lang) => CaseDoc> = {
  'spot-on-mobile-wash-detailing': spotOn,
};

export const isCase = (slug: string) => slug in MODEL_CASES || slug in MANUAL_CASES || slug in LEGACY_CASES;

export const CASE_UI = {
  en: { eyebrow: 'Case study', next: 'Next project', visit: 'Visit the live site' },
  es: { eyebrow: 'Caso de estudio', next: 'Siguiente proyecto', visit: 'Visita el sitio en vivo' },
};
