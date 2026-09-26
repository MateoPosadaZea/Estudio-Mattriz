import type { Lang } from '../i18n';

// Contenido de la home.
// Copy: brief sección 4 donde se solapa con el vivo (sin rayas largas); el resto, tal cual el vivo.

export const HERO = {
  title: 'Systems that work while you sleep.',
  subtitle: 'We design and build the websites, stores and booking systems your business runs on, and keep them running every month.',
  cta: { label: 'See how we work', href: '#how-we-work' },
};

export const SERVICES = {
  title: 'What we build',
  items: [
    {
      title: 'Booking & operations systems',
      text: 'Custom booking platforms with capacity, waitlists, refunds and follow-ups handled automatically.',
    },
    {
      title: 'Payment integration',
      text: 'Square, Stripe, Wompi. Integrated into the operation, not bolted on.',
    },
    {
      title: 'Custom admin dashboards',
      text: 'Tools your operators actually use, built around how your business actually works.',
    },
    {
      title: 'Automation & follow-up',
      text: 'Confirmations, reminders, post-service follow-up, review collection. Set once, runs forever.',
    },
    {
      title: 'Websites that convert',
      text: 'Marketing sites that turn into booking systems, not brochures.',
    },
  ],
};

export const STUDIO = {
  title: 'One studio. Real systems.',
  text: 'Mattriz is a systems studio based in Bogotá, working with service businesses across the USA and LATAM. The site is just the part you see. Behind it: booking engines, payment flows and operations that hold up to a direct question.',
  cta: "Let's talk about your project",
  stats: [
    { label: 'Build', value: '5+', text: 'Years designing and building digital systems for real businesses.' },
    { label: 'Maintain', value: '3', text: 'Active clients at a time, by design, not by accident.' },
    { label: 'Grow', value: '100%', text: 'We work on a monthly plan: we build, maintain and keep improving. No one-off projects.' },
  ],
};

export type Project = {
  title: string;
  href: string;
  categories: string[];
  video?: string;
  image?: { src: string; srcset: string; width: number; height: number; alt: string };
};

const img = (name: string, sizes: [number, number][], alt: string) => ({
  src: `/media/work/${name}-${sizes[0][0]}x${sizes[0][1]}.jpg`,
  srcset: sizes.map(([w, h]) => `/media/work/${name}-${w}x${h}.jpg ${w}w`).join(', '),
  width: sizes[0][0],
  height: sizes[0][1],
  alt,
});

const PHOTO_SIZES: [number, number][] = [[900, 604], [600, 403], [400, 269]];

// Mismo orden que el vivo (por fecha, más reciente primero).
export const PROJECTS: Project[] = [
  {
    title: 'Santo & Seña',
    href: '/project/santo-y-sena/',
    categories: ['UI/UX Design', 'Web Development', 'SEO Optimization'],
    video: '/media/work/santo-y-sena.mp4',
  },
  {
    title: 'Civilus',
    href: '/project/civilus/',
    categories: ['Brand Identity', 'UI/UX Design', 'Web Development'],
    video: '/media/work/civilus.mp4',
  },
  {
    title: 'Spot On Mobile Wash & Detailing',
    href: '/project/spot-on-mobile-wash-detailing/',
    categories: ['SEO Optimization', 'UI/UX Design', 'Web Development'],
    video: '/media/work/spot-on.mp4',
  },
  {
    title: 'The Grid',
    href: '/project/the-grid/',
    categories: ['Brand Identity', 'SEO Optimization', 'UI/UX Design', 'Web Development'],
    video: '/media/work/the-grid.mp4',
  },
  {
    title: 'Posada Carcamo Abogados',
    href: '/project/posada-carcamo-abogados/',
    categories: ['UI/UX Design', 'Web Development'],
    image: img('posada-carcamo', PHOTO_SIZES, 'Posada Carcamo Abogados Estudio Mattriz'),
  },
  {
    title: 'Let it Go',
    href: '/project/let-it-go/',
    categories: ['Brand Identity', 'UI/UX Design'],
    image: img('let-it-go', [[1024, 768], [768, 576], [650, 488]], ''),
  },
  {
    title: 'AGL Vans Tours',
    href: '/project/aglvanstours/',
    categories: ['UI/UX Design', 'Web Development'],
    image: img('agl-vans-tours', PHOTO_SIZES, 'Agl Vans Tours Sitio Web Mockup Laptop - Estudio Mattriz - Creamos sitios web'),
  },
  {
    title: 'Luciana Cabañas',
    href: '/project/luciana-cabanas/',
    categories: ['Brand Identity', 'UI/UX Design', 'Web Development'],
    image: img('luciana-cabanas', PHOTO_SIZES, ''),
  },
];

export const CATEGORIES = ['Brand Identity', 'SEO Optimization', 'UI/UX Design', 'Web Development'];

export const categorySlug = (name: string) =>
  name.toLowerCase().replace(/\//g, '-').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Texto vivo de la marquesina (sin copy aprobado nuevo; ver FASE-0-RESUMEN).
export const TICKER = [
  'We build digital systems that perform  ·  Webflow  ·  WordPress  ·  Shopify  ·  WooCommerce   ·',
  'Web Development  ·  UI/UX  ·  E-commerce  ·  SEO  ·  Automation  ·  Analytics  ·  Retainers   ·',
];

// Orden del carrusel del vivo. Raya larga del testimonio de Daniela reemplazada por coma (regla de marca).
export const TESTIMONIALS = [
  {
    quote: 'I had the opportunity to work with Mattriz on building my business website, and the experience exceeded our expectations. From the very beginning, we received very positive feedback, even from people who work at large technology companies here in the United States.',
    name: 'Diego',
    company: 'Spot On Mobile California',
  },
  {
    quote: 'An excellent studio, fully recommended. Modern and working with cutting-edge technology, blending technical knowledge with advanced AI tools.',
    name: 'Héctor Posada',
    company: 'The Grid',
  },
  {
    quote: 'We highlight their development, launch, and ongoing maintenance of our online store. They work fast and are always ready to help. I’d recommend them without hesitation.',
    name: 'José Suárez',
    company: 'My Doll Hair',
    avatar: '/media/testimonials/jose-suarez.jpg',
  },
  {
    quote: 'I entrusted them with our website and the entire visual side of the company, it turned out spectacular. I fully recommend them.',
    name: 'Carlos Posada',
    company: 'Posada Cárcamo Abogados',
    avatar: '/media/testimonials/carlos-posada.jpg',
  },
  {
    quote: 'They designed and developed our website. We were impressed by their ability to solve technical issues as they arose, and by how proactive and creative they are.',
    name: 'Daniela Barrios',
    company: 'Closet Up',
    avatar: '/media/testimonials/daniela-barrios.jpg',
  },
  {
    quote: 'They designed our family business website, and we have only good things to say about the experience of building it alongside their team.',
    name: 'Nicolás Galvis',
    company: 'AGL Vans Tours',
    avatar: '/media/testimonials/nicolas-galvis.jpg',
  },
];

// ---------------------------------------------------------------------------
// Español (/es/). Traducción del copy de arriba; mismas reglas: sin rayas largas.


export const HOME_ES = {
  HERO: {
    title: 'Sistemas que trabajan mientras duermes.',
    subtitle: 'Diseñamos y construimos los sitios, tiendas y sistemas de reservas con los que funciona tu negocio, y los mantenemos funcionando mes a mes.',
    cta: { label: 'Mira cómo trabajamos', href: '#how-we-work' },
  },
  SERVICES: {
    title: 'Lo que construimos',
    items: [
      {
        title: 'Sistemas de reservas y operación',
        text: 'Plataformas de reservas a la medida, con cupos, listas de espera, reembolsos y seguimientos que se gestionan solos.',
      },
      {
        title: 'Integración de pagos',
        text: 'Square, Stripe, Wompi. Integrados a la operación, no pegados encima.',
      },
      {
        title: 'Paneles de administración a la medida',
        text: 'Herramientas que tu equipo sí usa, construidas alrededor de cómo funciona tu negocio.',
      },
      {
        title: 'Automatización y seguimiento',
        text: 'Confirmaciones, recordatorios, seguimiento después del servicio y recolección de reseñas. Se configura una vez y funciona siempre.',
      },
      {
        title: 'Sitios web que convierten',
        text: 'Sitios de marketing que se convierten en sistemas de reservas, no en folletos.',
      },
    ],
  },
  STUDIO: {
    title: 'Un estudio. Sistemas reales.',
    text: 'Mattriz es un estudio de sistemas con sede en Bogotá que trabaja con negocios de servicios en Estados Unidos y Latinoamérica. El sitio web es solo la parte que se ve. Detrás hay motores de reservas, flujos de pago y operaciones que resisten una pregunta directa.',
    cta: 'Hablemos de tu proyecto',
    stats: [
      { label: 'Construir', value: '5+', text: 'Años diseñando y construyendo sistemas digitales para negocios reales.' },
      { label: 'Mantener', value: '3', text: 'Clientes activos a la vez, por decisión, no por accidente.' },
      { label: 'Crecer', value: '100%', text: 'Trabajamos con un plan mensual: construimos, mantenemos y seguimos mejorando. No hacemos proyectos sueltos.' },
    ],
  },
  TICKER: [
    'Construimos sistemas digitales que rinden  ·  Webflow  ·  WordPress  ·  Shopify  ·  WooCommerce   ·',
    'Desarrollo web  ·  UI/UX  ·  E-commerce  ·  SEO  ·  Automatización  ·  Analítica  ·  Retainers   ·',
  ],
  TESTIMONIALS: [
    {
      quote: 'Tuve la oportunidad de trabajar con Mattriz en el sitio web de mi negocio y la experiencia superó nuestras expectativas. Desde el principio recibimos comentarios muy positivos, incluso de personas que trabajan en grandes empresas de tecnología aquí en Estados Unidos.',
      name: 'Diego',
      company: 'Spot On Mobile California',
    },
    {
      quote: 'Excelente estudio, totalmente recomendado. Moderno y utiliza tecnología de vanguardia, mezclando conocimiento técnico con herramientas avanzadas de AI.',
      name: 'Héctor Posada',
      company: 'The Grid',
    },
    {
      quote: 'Destacamos el desarrollo, el lanzamiento y el mantenimiento continuo de nuestra tienda en línea. Trabajan rápido y siempre están dispuestos a ayudar. Los recomendaría sin dudarlo.',
      name: 'José Suárez',
      company: 'My Doll Hair',
      avatar: '/media/testimonials/jose-suarez.jpg',
    },
    {
      quote: 'Les confiamos nuestro sitio web y toda la parte visual de la empresa, y el resultado fue espectacular. Los recomiendo totalmente.',
      name: 'Carlos Posada',
      company: 'Posada Cárcamo Abogados',
      avatar: '/media/testimonials/carlos-posada.jpg',
    },
    {
      quote: 'Diseñaron y desarrollaron nuestro sitio web. Nos impresionó su capacidad para resolver los problemas técnicos a medida que surgían, y lo proactivos y creativos que son.',
      name: 'Daniela Barrios',
      company: 'Closet Up',
      avatar: '/media/testimonials/daniela-barrios.jpg',
    },
    {
      quote: 'Diseñaron el sitio web de nuestra empresa familiar y solo tenemos cosas buenas que decir de la experiencia de construirlo junto a su equipo.',
      name: 'Nicolás Galvis',
      company: 'AGL Vans Tours',
      avatar: '/media/testimonials/nicolas-galvis.jpg',
    },
  ],
};

// Textos sueltos de las secciones de la home.
export const HOME_LABELS = {
  en: {
    metaTitle: 'Mattriz | Booking & operations systems for service businesses',
    metaDescription: 'Mattriz builds booking, payment and operations systems for service businesses in the US and LATAM. One studio. One monthly plan.',
    selectedWork: 'Projects',
    filter: 'Filter',
    all: 'All',
    loadMore: 'Load More',
    testimonials: 'What clients say',
    previous: 'Previous',
    viewProject: 'View project',
    pause: 'Pause',
    play: 'Play',
    slideOf: '{n} of {total}',
    next: 'Next',
    ticker: 'Services',
  },
  es: {
    metaTitle: 'Mattriz | Sistemas de reservas y operación para negocios de servicios',
    metaDescription: 'Mattriz construye sistemas de reservas, pagos y operación para negocios de servicios en Estados Unidos y Latinoamérica. Un estudio. Un plan mensual.',
    selectedWork: 'Proyectos',
    filter: 'Filtrar',
    all: 'Todos',
    loadMore: 'Ver más',
    testimonials: 'Lo que dicen nuestros clientes',
    previous: 'Anterior',
    viewProject: 'Ver proyecto',
    pause: 'Pausar',
    play: 'Reproducir',
    slideOf: '{n} de {total}',
    next: 'Siguiente',
    ticker: 'Servicios',
  },
};

export const home = (lang: Lang) =>
  lang === 'es' ? { ...HOME_ES, LABELS: HOME_LABELS.es } : { HERO, SERVICES, STUDIO, TICKER, TESTIMONIALS, LABELS: HOME_LABELS.en };
