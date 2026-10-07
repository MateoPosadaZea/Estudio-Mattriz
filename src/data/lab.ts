// Mattriz Lab (/lab/, /es/lab/): lo que el estudio hace por iniciativa propia (exploraciones de
// marca, proyectos independientes y herramientas), numerado como un archivo que crece. Cada
// entrada lleva su pieza en public/media/lab/ (video en loop con su primer cuadro, o imagen 4:5).
import type { Lang } from '../i18n';

export interface LabEntry {
  num: string;
  kind: string;
  year: string;
  title: string;
  text: string;
  credits?: string;
  url?: string;
  linkLabel?: string;
  media: { img: string; video?: string };
}

const MEDIA = {
  tipografia: { img: '/media/lab/001-tipografia-poster.webp', video: '/media/lab/001-tipografia.mp4' },
  otraLectura: { img: '/media/lab/002-otra-lectura.webp' },
  calibre: { img: '/media/lab/003-calibre-perpetuo.webp' },
};

const COPY: Record<Lang, { metaTitle: string; metaDescription: string; eyebrow: string; title: string; intro: string; entries: LabEntry[] }> = {
  en: {
    metaTitle: 'Lab | Mattriz Studio',
    metaDescription: 'Mattriz Lab: brand explorations, independent projects and tools the studio makes on its own, numbered as an archive that grows.',
    eyebrow: 'Mattriz Lab',
    title: 'Lab',
    intro: 'What we make when nobody asks: brand explorations, independent projects and tools. Numbered, as an archive that keeps growing.',
    entries: [
      {
        num: '001', kind: 'Exploration', year: '2026', title: 'Typography',
        text: 'The Mattriz wordmark built letter by letter on its grid, with the outlines of Noe Display.',
        media: MEDIA.tipografia,
      },
      {
        num: '002', kind: 'Project', year: '2026', title: 'Otra Lectura',
        text: 'A small newspaper built as a system: one to three topics a day from Colombia and the region, with context, solutions and counterweight.',
        url: 'https://otralectura.co/', linkLabel: 'otralectura.co',
        media: MEDIA.otraLectura,
      },
      {
        num: '003', kind: 'Project', year: '2025', title: 'Calibre Perpetuo',
        text: 'Antique watches and lighters with a story, for people who value them. A shared project, run more to enjoy and learn than to sell fast.',
        credits: 'Identity: Monoespacio and Mattriz. Store on WooCommerce: Mattriz.',
        url: 'https://calibreperpetuo.com/', linkLabel: 'calibreperpetuo.com',
        media: MEDIA.calibre,
      },
    ],
  },
  es: {
    metaTitle: 'Lab | Mattriz Studio',
    metaDescription: 'Mattriz Lab: exploraciones de marca, proyectos independientes y herramientas que el estudio hace por iniciativa propia, numerados como un archivo que crece.',
    eyebrow: 'Mattriz Lab',
    title: 'Lab',
    intro: 'Lo que hacemos cuando nadie nos lo pide: exploraciones de marca, proyectos independientes y herramientas. Numerado, como un archivo que sigue creciendo.',
    entries: [
      {
        num: '001', kind: 'Exploración', year: '2026', title: 'Tipografía',
        text: 'El logotipo de Mattriz construido letra por letra sobre su retícula, con los trazos de Noe Display.',
        media: MEDIA.tipografia,
      },
      {
        num: '002', kind: 'Proyecto', year: '2026', title: 'Otra Lectura',
        text: 'Un periódico pequeño hecho como un sistema: uno a tres temas al día de Colombia y la región, con contexto, soluciones y contrapeso.',
        url: 'https://otralectura.co/', linkLabel: 'otralectura.co',
        media: MEDIA.otraLectura,
      },
      {
        num: '003', kind: 'Proyecto', year: '2025', title: 'Calibre Perpetuo',
        text: 'Relojes y encendedores antiguos con historia, para quienes los valoran. Un proyecto compartido, más para disfrutar y aprender que para vender rápido.',
        credits: 'Identidad: Monoespacio y Mattriz. Tienda en WooCommerce: Mattriz.',
        url: 'https://calibreperpetuo.com/', linkLabel: 'calibreperpetuo.com',
        media: MEDIA.calibre,
      },
    ],
  },
};

export const lab = (lang: Lang) => COPY[lang];
