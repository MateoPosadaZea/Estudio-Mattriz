// v2: caso de estudio de Posada Cárcamo Abogados, escrito a mano (reemplaza la versión que venía del
// WordPress anterior).
//
// Fuentes: el texto del caso original (identidad ya definida, objetivo y lista de lo que hicimos), el
// testimonio de Carlos Posada que ya está en el home y el sitio en vivo, posadacarcamo.com, recorrido el
// 27 de septiembre de 2026 (sin enviar el formulario). Lo que se describe del sitio es lo que se ve en él.
// "Calcula SICE TAC" enlaza a la herramienta del Ministerio de Transporte: no es una calculadora nuestra.
// Sin métricas ni año (el caso anterior no los tenía). Sin rayas largas.

import type { Lang } from '../../i18n';
import type { CaseDoc, CaseMedia } from '../../components/case/doc';

const DIR = '/media/projects/posada-carcamo-abogados';
type L = Record<Lang, string>;
const pic = (base: string, width: number, height: number, widths: number[], alt: L, caption?: L) => (lang: Lang): CaseMedia => ({
  type: 'img',
  local: { dir: DIR, base, width, height, widths },
  alt: alt[lang],
  caption: caption?.[lang],
});
const site = (base: string, alt: L, caption?: L) => pic(`pc-site-${base}`, 1600, 1000, [1600, 1200, 700], alt, caption);
const phone = (base: string, alt: L) => pic(`pc-m-${base}`, 900, 1948, [900, 600], alt);

const NAV = (lang: Lang): CaseMedia => ({
  type: 'video',
  local: { dir: DIR, base: 'pc-nav', width: 1280, height: 800 },
  alt: {
    en: 'Browsing the site: the team photo, the eleven practice areas, the lawyers, articles, clients and the contact form',
    es: 'Recorrido por el sitio: la foto del equipo, las once áreas de práctica, los abogados, artículos, clientes y el formulario de contacto',
  }[lang],
  caption: { en: 'The live site, from top to bottom.', es: 'El sitio en vivo, de arriba abajo.' }[lang],
});

const TEAM_PHOTO = pic('jmb7973-scaled-1', 1600, 1068, [1600, 1200, 700], {
  en: 'The Posada Cárcamo team around the meeting table',
  es: 'El equipo de Posada Cárcamo alrededor de la mesa de reuniones',
});
const TABLET = pic('portrait3-scaled', 1600, 1200, [1600, 1200, 700], {
  en: 'The founding partner’s profile on a tablet',
  es: 'El perfil del socio fundador en una tablet',
});
const PHONE_MOCK = pic('mockup-2-recuperado35', 1600, 1200, [1600, 1200, 700], {
  en: 'The contact section on a phone',
  es: 'La sección de contacto en un celular',
});
const SITE_AREAS = site('areas', { en: 'Practice areas grid', es: 'Cuadrícula de áreas de especialidad' }, {
  en: 'Eleven practice areas, each one a door to its own page.',
  es: 'Once áreas de especialidad, cada una con su propia página.',
});
const SITE_TEAM = site('team', { en: 'The founding partner, Carlos Posada Cárcamo', es: 'El socio fundador, Carlos Posada Cárcamo' });
const SITE_TEAM2 = site('team2', { en: 'Lawyers of the firm, each with a contact button', es: 'Abogados de la firma, cada uno con su botón de contacto' }, {
  en: 'People first: every lawyer has a face, a specialty and a way to reach them.',
  es: 'Primero las personas: cada abogado tiene cara, especialidad y una forma de contactarlo.',
});
const SITE_SICE = site('sice', { en: 'Shortcut to calculate SICE TAC', es: 'Acceso directo para calcular el SICE TAC' });
const SITE_ARTICLES = site('articles', { en: 'Articles on transport law', es: 'Artículos sobre derecho de transporte' }, {
  en: 'Articles written for the questions transport companies actually search for.',
  es: 'Artículos escritos para las preguntas que de verdad buscan las empresas de transporte.',
});
const SITE_CLIENTS = site('clients', { en: 'Client logos: transport companies', es: 'Logos de clientes: empresas de transporte' });
const M_HERO = phone('hero', { en: 'Home page on a phone', es: 'Portada en el celular' });
const M_TEAM = phone('team', { en: 'The founding partner on a phone', es: 'El socio fundador en el celular' });
const M_CONTACT = phone('contact', { en: 'Contact on a phone', es: 'Contacto en el celular' });

const TEXT = {
  en: {
    metaTitle: 'Posada Cárcamo Abogados Case Study: Law Firm Website | Mattriz Studio',
    description:
      'UI/UX design and website for Posada Cárcamo Abogados, a Colombian law firm: eleven practice areas, lawyer profiles, articles on transport law and contact.',
    tagline: 'A law firm with eleven practice areas, and a website that puts its people first.',
    intro:
      'UI/UX design and development of the website for Posada Cárcamo Abogados, a firm whose most important specialty, in its own words, is client service and innovation.',
    facts: [
      { label: 'Client', value: 'Posada Cárcamo Abogados' },
      { label: 'Location', value: 'Barranquilla, Colombia' },
      { label: 'Services', chips: ['UI/UX design', 'Web development', 'SEO'] },
    ],
    brief: {
      label: 'The brief',
      title: 'An identity that already existed, a portfolio to show.',
      html:
        '<p>The firm already had a defined visual identity, which gave the website its tone from day one: elegant and professional. The goal was to present its portfolio of services and advice, and to attract clients by gaining visibility.</p>',
    },
    site: {
      label: 'The website',
      title: 'Organised around what a client needs to decide.',
      intro: 'Who they are, what they do, who does it, and how to reach them, in that order.',
      items: [
        { term: 'Eleven practice areas', desc: 'Labour and pensions, commercial, medical liability, road safety, copyright, family, immigration, Florida law, transport and traffic, criminal and customs law, each with its own page.' },
        { term: 'The team, one by one', desc: 'The founding partner with his background, and every lawyer with a photo, a specialty, a profile page and a contact button.' },
        { term: 'Articles and news', desc: 'Articles on transport law, written around the questions companies in the sector search for.' },
        { term: 'A shortcut for transport clients', desc: 'A direct link to calculate SICE TAC, the Ministry of Transport’s cost tool, in the header and on the home page.' },
        { term: 'Clients on display', desc: 'The logos of the transport companies the firm works with.' },
        { term: 'Contact from every page', desc: 'Phone, email, WhatsApp, both offices and a form to describe the case. The site is also available in English.' },
      ],
    },
    niche: {
      label: 'Focus',
      title: 'Built for its strongest client: transport.',
      html:
        '<p>The founding partner is a specialist in transport law and a certified road safety auditor, and the firm’s clients are transport companies. The site reflects it: the SICE TAC shortcut, the articles on permits, cargo manifests and sanctions, and the client wall all speak to that sector without closing the door to the other ten areas.</p>',
    },
    process: {
      label: 'What we did',
      title: 'From moodboard to launch.',
      html:
        '<p>A moodboard with references, a database, the hosting and domain, UI/UX design of the website, development, user testing, SEO and launch.</p>',
    },
    quote: {
      label: 'Testimonial',
      html: '<p>“I entrusted them with our website and the entire visual side of the company, it turned out spectacular. I fully recommend them.”</p><p>Carlos Posada Cárcamo, founding partner</p>',
    },
    details: [
      { title: 'Services', html: '<p>UI/UX design, web development, SEO.</p>' },
      { title: 'Deliverables', html: '<p>Website with practice area pages, team profiles, articles, contact and an English version.</p>' },
      { title: 'Offices', html: '<p>Barranquilla, plus a second office listed on the site.</p>' },
    ],
    cta: {
      title: 'A firm, a practice, a professional service?',
      text: 'We design and build the site that explains what you do and brings the right clients to you.',
    },
  },
  es: {
    metaTitle: 'Caso de estudio Posada Cárcamo Abogados: sitio web | Mattriz Studio',
    description:
      'Diseño UI/UX y sitio web para Posada Cárcamo Abogados, firma de abogados en Colombia: once áreas de práctica, perfiles de abogados, artículos de derecho de transporte y contacto.',
    tagline: 'Una firma de abogados con once áreas de práctica, y un sitio que pone primero a su gente.',
    intro:
      'Diseño UI/UX y desarrollo del sitio web de Posada Cárcamo Abogados, una firma cuya especialización más importante, en sus propias palabras, es el servicio al cliente y la innovación.',
    facts: [
      { label: 'Cliente', value: 'Posada Cárcamo Abogados' },
      { label: 'Ubicación', value: 'Barranquilla, Colombia' },
      { label: 'Servicios', chips: ['Diseño UI/UX', 'Desarrollo web', 'SEO'] },
    ],
    brief: {
      label: 'El punto de partida',
      title: 'Una identidad que ya existía, un portafolio por mostrar.',
      html:
        '<p>La firma ya tenía una identidad visual definida, y eso le dio al sitio su tono desde el primer día: elegante y profesional. El objetivo era mostrar su portafolio de servicios y asesorías, y atraer clientes ganando visibilidad.</p>',
    },
    site: {
      label: 'El sitio web',
      title: 'Ordenado según lo que un cliente necesita para decidir.',
      intro: 'Quiénes son, qué hacen, quién lo hace y cómo contactarlos, en ese orden.',
      items: [
        { term: 'Once áreas de especialidad', desc: 'Laboral y pensiones, comercial, responsabilidad médica, seguridad vial, derecho de autor, familia, migratorio, derecho en la Florida, transporte y tránsito, penal y aduanero, cada una con su página.' },
        { term: 'El equipo, uno por uno', desc: 'El socio fundador con su trayectoria, y cada abogado con foto, especialidad, página de perfil y botón de contacto.' },
        { term: 'Artículos y noticias', desc: 'Artículos sobre derecho de transporte, escritos alrededor de las preguntas que buscan las empresas del sector.' },
        { term: 'Un atajo para los clientes de transporte', desc: 'Un enlace directo para calcular el SICE TAC, la herramienta de costos del Ministerio de Transporte, en el menú y en la portada.' },
        { term: 'Los clientes a la vista', desc: 'Los logos de las empresas de transporte con las que trabaja la firma.' },
        { term: 'Contacto desde cualquier página', desc: 'Teléfono, correo, WhatsApp, las dos sedes y un formulario para contar el caso. El sitio también está en inglés.' },
      ],
    },
    niche: {
      label: 'Enfoque',
      title: 'Hecho para su cliente más fuerte: el transporte.',
      html:
        '<p>El socio fundador es especialista en derecho de transporte y auditor certificado en seguridad vial, y los clientes de la firma son empresas de transporte. El sitio lo refleja: el atajo al SICE TAC, los artículos sobre habilitación, manifiestos de carga y sanciones, y el muro de clientes le hablan a ese sector sin cerrarle la puerta a las otras diez áreas.</p>',
    },
    process: {
      label: 'Lo que hicimos',
      title: 'Del moodboard al lanzamiento.',
      html:
        '<p>Un moodboard con referentes, la base de datos, el hosting y el dominio, el diseño UI/UX del sitio, el desarrollo, las pruebas con usuarios, la optimización SEO y el lanzamiento.</p>',
    },
    quote: {
      label: 'Testimonio',
      html: '<p>“Les confiamos nuestro sitio web y toda la parte visual de la empresa, y el resultado fue espectacular. Los recomiendo totalmente.”</p><p>Carlos Posada Cárcamo, socio fundador</p>',
    },
    details: [
      { title: 'Servicios', html: '<p>Diseño UI/UX, desarrollo web, SEO.</p>' },
      { title: 'Entregables', html: '<p>Sitio web con páginas por área, perfiles del equipo, artículos, contacto y versión en inglés.</p>' },
      { title: 'Sedes', html: '<p>Barranquilla, y una segunda sede que aparece en el sitio.</p>' },
    ],
    cta: {
      title: '¿Una firma, un consultorio, un servicio profesional?',
      text: 'Diseñamos y construimos el sitio que explica lo que haces y te trae a los clientes correctos.',
    },
  },
};

export function posadaCarcamo(lang: Lang): CaseDoc {
  const t = TEXT[lang];
  return {
    name: 'Posada Cárcamo Abogados',
    theme: 'light',
    accent: '#560323',
    onAccent: '#ffffff',
    metaTitle: t.metaTitle,
    description: t.description,
    year: '',
    tagline: t.tagline,
    intro: t.intro,
    facts: t.facts,
    hero: NAV(lang),
    site: 'https://posadacarcamo.com/',
    blocks: [
      { kind: 'text', style: 'lead', ...t.brief },
      { kind: 'media', layout: 'full', items: [TEAM_PHOTO(lang)] },
      { kind: 'cards', ...t.site },
      { kind: 'media', layout: 'pair', items: [SITE_AREAS(lang), SITE_TEAM(lang)] },
      { kind: 'media', layout: 'wide', items: [SITE_TEAM2(lang)] },
      { kind: 'text', style: 'lead', ...t.niche },
      { kind: 'media', layout: 'pair', items: [SITE_SICE(lang), SITE_ARTICLES(lang)] },
      { kind: 'media', layout: 'wide', items: [SITE_CLIENTS(lang)] },
      { kind: 'media', layout: 'trio', items: [M_HERO(lang), M_TEAM(lang), M_CONTACT(lang)] },
      { kind: 'text', style: 'statement', ...t.quote },
      { kind: 'media', layout: 'pair', items: [TABLET(lang), PHONE_MOCK(lang)] },
      { kind: 'text', style: 'lead', ...t.process },
      { kind: 'details', cols: t.details },
      { kind: 'cta', ...t.cta, link: { href: 'mailto:contacto@mattriz.com', label: 'contacto@mattriz.com' } },
    ],
  };
}
