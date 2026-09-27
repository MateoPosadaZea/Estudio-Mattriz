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
import { santoYSena } from './cases/santo-y-sena';
import { drDanielDeZubiria } from './cases/dr-daniel-de-zubiria';
import { lucianaCabanas } from './cases/luciana-cabanas';
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
  'spot-on-mobile-wash-detailing': {
    en: { title: 'Spot On Mobile Detailing Case Study | Mattriz Studio', description: 'How a mobile detailer went from booking by DM to a system that books, charges and follows up on its own, plus a corporate fleet program on autopilot.' },
    es: { title: 'Caso de estudio Spot On Mobile Detailing | Mattriz Studio', description: 'Cómo un detailer a domicilio pasó de agendar por mensajes a un sistema que reserva, cobra y hace seguimiento solo, con un programa corporativo en piloto automático.' },
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
};

export const MANUAL_CASES: Record<string, (lang: Lang) => CaseDoc> = {
  'spot-on-mobile-wash-detailing': spotOn,
  'santo-y-sena': santoYSena,
  'dr-daniel-de-zubiria': drDanielDeZubiria,
  'luciana-cabanas': lucianaCabanas,
};

export const isCase = (slug: string) => slug in MODEL_CASES || slug in MANUAL_CASES || slug in LEGACY_CASES;

export const CASE_UI = {
  en: { eyebrow: 'Case study', next: 'Next project', visit: 'Visit the live site', scroll: 'Keep scrolling' },
  es: { eyebrow: 'Caso de estudio', next: 'Siguiente proyecto', visit: 'Visita el sitio en vivo', scroll: 'Sigue bajando' },
};

// Título y descripción para buscadores de los casos que venían del vivo con metadatos pobres
// ("Nombre - Mattriz Studio"). Solo datos que ya estaban en el proyecto.
export const CASE_SEO: Record<string, Record<Lang, { title: string; description: string }>> = {
  aglvanstours: {
    en: { title: 'AGL Vans Tours Website Case Study | Mattriz Studio', description: 'Website design and development for AGL Vans Tours, a transportation services company. Designed and built by Mattriz Studio, a studio in Bogotá.' },
    es: { title: 'Caso de estudio: sitio web de AGL Vans Tours | Mattriz Studio', description: 'Diseño y desarrollo del sitio web de AGL Vans Tours, empresa de servicios de transporte. Diseñado y construido por Mattriz Studio, un estudio en Bogotá.' },
  },
  'posada-carcamo-abogados': {
    en: { title: 'Posada Cárcamo Abogados: Law Firm Website | Mattriz Studio', description: 'Web design and development for Posada Cárcamo Abogados, a law firm focused on innovation and client service. Built by Mattriz Studio.' },
    es: { title: 'Posada Cárcamo Abogados: sitio web | Mattriz Studio', description: 'Diseño y desarrollo web para Posada Cárcamo Abogados, firma de abogados enfocada en la innovación y el servicio al cliente. Hecho por Mattriz Studio.' },
  },
  'let-it-go': {
    en: { title: 'Let it Go: App Brand & UI Design | Mattriz Studio', description: 'Let It Go, a mobile app that aims to change consumer habits so people swap and sell the clothes and books they no longer use. Brand and UI design by Mattriz Studio.' },
    es: { title: 'Let it Go: marca y diseño de app | Mattriz Studio', description: 'Let It Go, aplicación móvil para intercambiar y vender la ropa y los libros que ya no se usan. Marca y diseño de interfaz de Mattriz Studio.' },
  },
  'spot-on-mobile-wash-detailing': {
    en: { title: 'Spot On Mobile Detailing Case Study | Mattriz Studio', description: 'How a mobile detailer went from booking by DM to a system that books, charges and follows up on its own, plus a corporate fleet program on autopilot.' },
    es: { title: 'Caso de estudio Spot On Mobile Detailing | Mattriz Studio', description: 'Cómo un detailer a domicilio pasó de agendar por mensajes a un sistema que reserva, cobra y hace seguimiento solo, con un programa corporativo en piloto automático.' },
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
