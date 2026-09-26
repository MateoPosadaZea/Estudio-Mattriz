import type { Lang } from '../i18n';

// Contenido de /about/: copy vivo (sin copy nuevo aprobado), sin rayas largas.

export const ABOUT_HERO = {
  title: 'We blend design and technology to grow your business.',
  text: 'We’re a studio that blends design and technology. We build fast, SEO-ready websites in Webflow & WordPress, with clear UX and a clean CMS your team can edit. We also add light automation to remove busywork.',
  cta: 'View our work',
};

export const ABOUT_SERVICES = [
  { title: 'Brand Identity & Concept', text: 'We create your brand system: logo, color, type, and usage guidelines your team can apply everywhere.' },
  { title: 'Web Development', text: 'Fast, SEO-ready websites in Webflow/WordPress, eCommerce or company sites, with a clean, editor-friendly CMS.' },
  { title: 'UI/UX Design', text: 'User research, information architecture, and Figma prototypes. Accessible (WCAG), mobile-first interfaces optimized for conversion.' },
  { title: 'SEO & Site Speed', text: 'Technical SEO, on-page structure, schema, and performance tuning (Core Web Vitals, CDN/caching) to grow visibility and sales.' },
];

export const TEAM = {
  title: 'Meet The Team',
  text: 'We make websites that are fast, simple to manage, and search-friendly. Webflow & WordPress + a touch of automation.',
  cta: 'Explore our work',
  members: [
    {
      name: 'Mateo Posada',
      role: 'CEO, Founder',
      photo: 'mateo-posada-zea',
      links: [
        { type: 'linkedin', href: 'https://www.linkedin.com/in/mateo-posada-zea/' },
        { type: 'instagram', href: 'https://www.instagram.com/mateoposadazea/' },
      ],
    },
    {
      name: 'Alejandro Ortega',
      role: 'CXO – Chief Experience Officer',
      photo: 'alejandro-ortega',
      links: [{ type: 'linkedin', href: 'https://www.linkedin.com/in/alejandro-ortega-741b10238/' }],
    },
  ],
};

// ---------------------------------------------------------------------------
// Español (/es/about/).

export const ABOUT_ES = {
  ABOUT_HERO: {
    title: 'Unimos diseño y tecnología para hacer crecer tu negocio.',
    text: 'Somos un estudio que une diseño y tecnología. Construimos sitios rápidos y listos para SEO en Webflow y WordPress, con una UX clara y un CMS limpio que tu equipo puede editar. También sumamos automatización ligera para quitarte trabajo repetitivo.',
    cta: 'Ver nuestro trabajo',
  },
  ABOUT_SERVICES: [
    { title: 'Identidad de marca y concepto', text: 'Creamos tu sistema de marca: logo, color, tipografía y guías de uso que tu equipo puede aplicar en todas partes.' },
    { title: 'Desarrollo web', text: 'Sitios rápidos y listos para SEO en Webflow o WordPress, tiendas en línea o sitios corporativos, con un CMS limpio y fácil de editar.' },
    { title: 'Diseño UI/UX', text: 'Investigación de usuarios, arquitectura de información y prototipos en Figma. Interfaces accesibles (WCAG), pensadas primero para móvil y optimizadas para convertir.' },
    { title: 'SEO y velocidad del sitio', text: 'SEO técnico, estructura on-page, schema y optimización de rendimiento (Core Web Vitals, CDN y caché) para ganar visibilidad y ventas.' },
  ],
  TEAM: {
    ...TEAM,
    title: 'Conoce al equipo',
    text: 'Hacemos sitios rápidos, fáciles de administrar y amigables con los buscadores. Webflow y WordPress, con un toque de automatización.',
    cta: 'Explora nuestro trabajo',
    members: [
      { ...TEAM.members[0], role: 'CEO, fundador' },
      { ...TEAM.members[1], role: 'CXO, director de experiencia' },
    ],
  },
};

export const ABOUT_LABELS = {
  en: {
    metaTitle: 'About Mattriz | Web Development, SEO & Automation',
    metaDescription: 'Mattriz is a web development studio building fast Webflow/WordPress sites with SEO & site speed, a clean CMS, and light automation. See client stories and outcomes.',
    breadcrumb: 'About',
    services: 'Our Services',
    on: 'on',
  },
  es: {
    metaTitle: 'Sobre Mattriz | Desarrollo web, SEO y automatización',
    metaDescription: 'Mattriz es un estudio de desarrollo web que construye sitios rápidos en Webflow y WordPress, con SEO, velocidad, un CMS limpio y automatización ligera. Conoce historias y resultados de clientes.',
    breadcrumb: 'Nosotros',
    services: 'Nuestros servicios',
    on: 'en',
  },
};

export const about = (lang: Lang) =>
  lang === 'es' ? { ...ABOUT_ES, LABELS: ABOUT_LABELS.es } : { ABOUT_HERO, ABOUT_SERVICES, TEAM, LABELS: ABOUT_LABELS.en };
