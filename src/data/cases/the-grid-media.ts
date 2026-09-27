// Media del sitio en vivo de The Grid (thegrid.es, 27 de septiembre de 2026) que se suma al caso que sale
// del modelo: el recorrido por el home y capturas de escritorio y celular. Sin enviar formularios.
import type { Lang } from '../../i18n';
import type { CaseMedia } from '../../components/case/doc';

const DIR = '/media/projects/the-grid';
type L = Record<Lang, string>;
const pic = (base: string, width: number, height: number, widths: number[], alt: L, caption?: L) => (lang: Lang): CaseMedia => ({
  type: 'img',
  local: { dir: DIR, base, width, height, widths },
  alt: alt[lang],
  caption: caption?.[lang],
});
const site = (base: string, alt: L, caption?: L) => pic(`tg-site-${base}`, 1600, 1000, [1600, 1200, 700], alt, caption);
const phone = (base: string, alt: L) => pic(`tg-m-${base}`, 900, 1948, [900, 600], alt);

export const THE_GRID_HERO = (lang: Lang): CaseMedia => ({
  type: 'video',
  local: { dir: DIR, base: 'tg-nav', width: 1280, height: 808 },
  alt: {
    en: 'Browsing the live site: the video hero, services, the three tools, projects, research and the team',
    es: 'Recorrido por el sitio en vivo: la portada en video, servicios, las tres herramientas, proyectos, investigación y el equipo',
  }[lang],
  caption: { en: 'The live site, from the video hero to the team.', es: 'El sitio en vivo, de la portada en video al equipo.' }[lang],
});

export const THE_GRID_SERVICES = [
  site('services', { en: 'Six services on a clean grid of cards', es: 'Seis servicios en una cuadrícula limpia de tarjetas' }),
  site('tools1', { en: 'Tools: the Digital Twin Platform and O-SAM', es: 'Herramientas: la plataforma de gemelo digital y O-SAM' }, {
    en: 'Each tool with its own screenshot, a “Learn more” and a way to try it.',
    es: 'Cada herramienta con su captura, un “Learn more” y una forma de probarla.',
  }),
];

export const THE_GRID_WORK = [
  site('tools2', { en: 'MatchFEM, the Grasshopper plug-in', es: 'MatchFEM, el plug-in para Grasshopper' }),
  site('project1', { en: 'Project: digital twin of a load test for a high-speed railway bridge', es: 'Proyecto: gemelo digital de una prueba de carga en un puente de alta velocidad' }, {
    en: 'Projects told as cases, each with its own page.',
    es: 'Los proyectos contados como casos, cada uno con su página.',
  }),
];

export const THE_GRID_PEOPLE = [
  site('research', { en: 'Research driven: the link to the LMDEC lab', es: 'Research driven: el vínculo con el laboratorio LMDEC' }),
  site('team', { en: 'The founding team', es: 'El equipo fundador' }),
];

export const THE_GRID_PHONES = [
  phone('hero', { en: 'The Grid home page on a phone', es: 'Portada de The Grid en el celular' }),
  phone('services', { en: 'Services on a phone', es: 'Servicios en el celular' }),
  phone('projects', { en: 'A project on a phone', es: 'Un proyecto en el celular' }),
];
