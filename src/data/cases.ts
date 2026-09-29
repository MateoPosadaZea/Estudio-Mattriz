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
import type { CaseDoc, CaseMedia } from '../components/case/doc';
import { CIVILUS_HERO, CIVILUS_TOOLS, CIVILUS_BEAM, CIVILUS_PHONES } from './cases/civilus-media';
import { THE_GRID_HERO, THE_GRID_SERVICES, THE_GRID_WORK, THE_GRID_PEOPLE, THE_GRID_PHONES } from './cases/the-grid-media';
import { spotOn } from './cases/spot-on';
import { santoYSena } from './cases/santo-y-sena';
import { drDanielDeZubiria } from './cases/dr-daniel-de-zubiria';
import { lucianaCabanas } from './cases/luciana-cabanas';
import { posadaCarcamo } from './cases/posada-carcamo';
import { aglVans } from './cases/agl-vans';
import type { LegacyCase } from '../components/case/fromLegacy';

export type ModelBlock =
  | { section: 'challenge' | 'approach' | 'whatwedo' | 'impact' | 'details' }
  | { media: number[]; layout: 'full' | 'pair' | 'trio' | 'inset' | 'wide'; parallax?: boolean }
  /** Media nueva, fuera del modelo (capturas y videos del sitio en vivo). */
  | { extra: ((lang: Lang) => CaseMedia)[]; layout: 'full' | 'pair' | 'trio' | 'inset' | 'wide' };

export type ModelCase = {
  name: string;
  theme: 'dark' | 'light';
  bg?: string;
  accent: string;
  onAccent: string;
  hero: number;
  /** Media principal fuera del modelo; si está, reemplaza a media[hero]. */
  heroExtra?: (lang: Lang) => CaseMedia;
  flow: ModelBlock[];
  stats?: Record<Lang, { value: string; label: string }[]>;
};

export const MODEL_CASES: Record<string, ModelCase> = {
  'spot-on-mobile-wash-detailing': {
    en: { title: 'Spot On Mobile Detailing Case Study | Mattriz Studio', description: 'How a mobile detailer went from booking by DM to a system that books, charges and follows up on its own, plus a corporate fleet program on autopilot.' },
    es: { title: 'Caso de estudio Spot On Mobile Detailing | Mattriz Studio', description: 'Cómo un detailer a domicilio pasó de agendar por mensajes a un sistema que reserva, cobra y hace seguimiento solo, con un programa corporativo automático.' },
  },
  'the-grid': {
    en: { title: 'The Grid Digital Twin Branding & Webflow | Mattriz Studio', description: 'Brand identity, visual system and Webflow website for The Grid, a digital twin & BIM consultancy. See how we built a bold, flexible design language.' },
    es: { title: 'The Grid: marca y sitio web en Webflow | Mattriz Studio', description: 'Identidad de marca, sistema visual y sitio web en Webflow para The Grid, consultora de gemelos digitales y BIM. Un lenguaje de diseño audaz y flexible.' },
  },
  civilus: {
    name: 'Civilus',
    theme: 'dark',
    bg: '#060f27',
    accent: '#d93131',
    onAccent: '#ffffff',
    hero: 0,
    heroExtra: CIVILUS_HERO,
    flow: [
      { section: 'challenge' },
      { media: [7], layout: 'full' },
      { media: [2, 1], layout: 'pair' },
      { section: 'approach' },
      { extra: CIVILUS_TOOLS, layout: 'pair' },
      { extra: CIVILUS_BEAM, layout: 'pair' },
      { media: [5, 6], layout: 'pair' },
      { section: 'whatwedo' },
      { extra: CIVILUS_PHONES, layout: 'trio' },
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
    heroExtra: THE_GRID_HERO,
    flow: [
      { section: 'challenge' },
      { media: [11], layout: 'full' },
      { media: [13], layout: 'full', parallax: true },
      { media: [0, 9], layout: 'pair' },
      { section: 'approach' },
      { extra: THE_GRID_SERVICES, layout: 'pair' },
      { extra: THE_GRID_WORK, layout: 'pair' },
      { media: [3, 5], layout: 'pair' },
      { media: [2, 4], layout: 'pair' },
      { media: [7], layout: 'wide' },
      { section: 'whatwedo' },
      { extra: THE_GRID_PHONES, layout: 'trio' },
      { extra: THE_GRID_PEOPLE, layout: 'pair' },
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
};

export const MANUAL_CASES: Record<string, (lang: Lang) => CaseDoc> = {
  'spot-on-mobile-wash-detailing': spotOn,
  'santo-y-sena': santoYSena,
  'dr-daniel-de-zubiria': drDanielDeZubiria,
  'luciana-cabanas': lucianaCabanas,
  'posada-carcamo-abogados': posadaCarcamo,
  aglvanstours: aglVans,
};

export const isCase = (slug: string) => slug in MODEL_CASES || slug in MANUAL_CASES || slug in LEGACY_CASES;

export const CASE_UI = {
  en: { eyebrow: 'Case study', next: 'Next project', visit: 'Visit the live site', visitShort: 'Visit the site', scroll: 'Keep scrolling', talk: 'Tell us about your project', ctaTitle: 'Got a project in mind?', ctaText: 'We design and build websites, online stores and booking and payment systems, and keep them running every month.' },
  es: { eyebrow: 'Caso de estudio', next: 'Siguiente proyecto', visit: 'Visita el sitio en vivo', visitShort: 'Visitar el sitio', scroll: 'Sigue bajando', talk: 'Cuéntanos tu proyecto', ctaTitle: '¿Tienes un proyecto en mente?', ctaText: 'Diseñamos y construimos sitios web, tiendas en línea y sistemas de reservas y pagos, y los mantenemos funcionando mes a mes.' },
};

// Título y descripción para buscadores de los casos que venían del vivo con metadatos pobres
// ("Nombre - Mattriz Studio"). Solo datos que ya estaban en el proyecto.
export const CASE_SEO: Record<string, Record<Lang, { title: string; description: string }>> = {
  'let-it-go': {
    en: { title: 'Let it Go: App Brand & UI Design | Mattriz Studio', description: 'Let It Go, a mobile app that aims to change consumer habits: swap and sell the clothes and books you no longer use. Brand and UI design by Mattriz Studio.' },
    es: { title: 'Let it Go: marca y diseño de app | Mattriz Studio', description: 'Let It Go, aplicación móvil para intercambiar y vender la ropa y los libros que ya no se usan. Marca y diseño de interfaz de Mattriz Studio.' },
  },
  'spot-on-mobile-wash-detailing': {
    en: { title: 'Spot On Mobile Detailing Case Study | Mattriz Studio', description: 'How a mobile detailer went from booking by DM to a system that books, charges and follows up on its own, plus a corporate fleet program on autopilot.' },
    es: { title: 'Caso de estudio Spot On Mobile Detailing | Mattriz Studio', description: 'Cómo un detailer a domicilio pasó de agendar por mensajes a un sistema que reserva, cobra y hace seguimiento solo, con un programa corporativo automático.' },
  },
  'the-grid': {
    en: { title: 'The Grid Digital Twin Branding & Webflow | Mattriz Studio', description: 'Brand identity, visual system and Webflow website for The Grid, a digital twin & BIM consultancy. See how we built a bold, flexible design language.' },
    es: { title: 'The Grid: marca y sitio web en Webflow | Mattriz Studio', description: 'Identidad de marca, sistema visual y sitio web en Webflow para The Grid, consultora de gemelos digitales y BIM. Un lenguaje de diseño audaz y flexible.' },
  },
  civilus: {
    en: { title: 'Civilus | Brand identity & website | Mattriz Studio', description: 'Civilus: brand identity and React website for an online structural-calculus platform, designed and developed by Mattriz Studio.' },
    es: { title: 'Civilus | Identidad de marca y sitio web | Mattriz Studio', description: 'Civilus: identidad de marca y sitio web en React para una plataforma de cálculo estructural en línea, diseñados y desarrollados por Mattriz Studio.' },
  },
};
