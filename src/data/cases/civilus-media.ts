// Media del sitio en vivo de Civilus (civilus.co, 27 de septiembre de 2026) que se suma al caso que sale
// del modelo: el recorrido por las dos herramientas y capturas de escritorio y celular. En la grabación
// se usaron solo las calculadoras, con valores de ejemplo (una viga I y una viga de 6 m con una carga).
import type { Lang } from '../../i18n';
import type { CaseMedia } from '../../components/case/doc';

const DIR = '/media/projects/civilus';
type L = Record<Lang, string>;
const pic = (base: string, width: number, height: number, widths: number[], alt: L, caption?: L) => (lang: Lang): CaseMedia => ({
  type: 'img',
  local: { dir: DIR, base, width, height, widths },
  alt: alt[lang],
  caption: caption?.[lang],
});
const site = (base: string, alt: L, caption?: L) => pic(`cv-site-${base}`, 1600, 1000, [1600, 1200, 700], alt, caption);
const phone = (base: string, alt: L) => pic(`cv-m-${base}`, 900, 1948, [900, 600], alt);

export const CIVILUS_HERO = (lang: Lang): CaseMedia => ({
  type: 'video',
  local: { dir: DIR, base: 'cv-nav', width: 1280, height: 808 },
  alt: {
    en: 'Using the live site: an I-section in Cross Section Properties, then a 6 m beam with a point load in Beam Solver',
    es: 'Usando el sitio en vivo: una sección I en Cross Section Properties y luego una viga de 6 m con una carga puntual en Beam Solver',
  }[lang],
  caption: {
    en: 'The live site: an I-section’s properties, then a beam solved with its shear and moment diagrams.',
    es: 'El sitio en vivo: las propiedades de una sección I y luego una viga resuelta con sus diagramas de cortante y momento.',
  }[lang],
});

export const CIVILUS_TOOLS = [
  site('cross', { en: 'Cross Section Properties with an I-section drawn to scale', es: 'Cross Section Properties con una sección I dibujada a escala' }),
  site('results', { en: 'Section properties: area, centroid, inertia, section moduli and torsional constant', es: 'Propiedades de la sección: área, centroide, inercia, módulos de sección y constante de torsión' }, {
    en: 'Twelve properties at once, with units you can switch.',
    es: 'Doce propiedades de una vez, con unidades que se pueden cambiar.',
  }),
];

export const CIVILUS_BEAM = [
  site('beam', { en: 'Beam Solver: beam data, supports and the free body diagram', es: 'Beam Solver: datos de la viga, apoyos y diagrama de cuerpo libre' }),
  site('diagrams2', { en: 'Shear and bending moment diagrams for the solved beam', es: 'Diagramas de cortante y momento flector de la viga resuelta' }, {
    en: 'From supports and loads to shear and moment diagrams, in the browser.',
    es: 'De los apoyos y las cargas a los diagramas de cortante y momento, en el navegador.',
  }),
];

export const CIVILUS_PHONES = [
  phone('home', { en: 'Civilus home page on a phone', es: 'Portada de Civilus en el celular' }),
  phone('tools', { en: 'The tools on a phone', es: 'Las herramientas en el celular' }),
  phone('beam', { en: 'Shear and moment diagrams on a phone', es: 'Diagramas de cortante y momento en el celular' }),
];
