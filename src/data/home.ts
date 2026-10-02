import { CASE_CATEGORIES } from './categories';
import type { Lang } from '../i18n';

// Contenido de la home.
// Copy: brief sección 4 donde se solapa con el vivo (sin rayas largas); el resto, tal cual el vivo.

export const HERO = {
  title: 'Systems that work while you sleep.',
  subtitle: 'We design and build the websites, online stores, booking and payment systems your business runs on. And we help them grow, month after month.',
  cta: { label: 'See what we offer', href: '#services' },
  scroll: 'Scroll to explore',
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
  text: 'Mattriz is a design and development studio based in Bogotá, working with businesses across the US and Latin America. We design the brand, build the website, the store or the booking system, and keep it running every month. AI speeds up the work; the decisions stay with us.',
  cta: 'Our projects',
  stats: [
    { label: 'Build', value: '5+', text: 'Years designing and building digital systems for real businesses.' },
    { label: 'Maintain', value: '3', text: 'Active clients at a time. A deliberate limit, so each one gets our full time and quality.' },
    { label: 'Grow', value: '100%', text: 'We work on a monthly plan: we build, maintain and keep improving. No one-off projects.' },
  ],
};

export type Project = {
  title: string;
  href: string;
  categories: string[];
  /** Descripción corta (máx. 3 líneas) en la lista de proyectos. */
  summary: { en: string; es: string };
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

// Orden elegido por Mateo (Spot On primero). Let it Go salió de la lista (su página sigue en /project/let-it-go/;
// irá a una sección de laboratorio o a una página con todos los proyectos, por decidir).
export const PROJECTS: Project[] = [
  {
    title: 'Spot On Mobile Wash & Detailing',
    href: '/project/spot-on-mobile-wash-detailing/',
    summary: { en: 'Booking, payments and a corporate fleet program for a mobile detailer in California, running on their own.', es: 'Reservas, pagos y un programa corporativo para un detailer a domicilio en California, funcionando solos.' },
    categories: CASE_CATEGORIES['spot-on-mobile-wash-detailing'],
    video: '/media/work/spot-on-nav.mp4',
  },
  {
    title: 'Santo & Seña',
    href: '/project/santo-y-sena/',
    summary: { en: 'New site for a Bogotá bookshop and record store, built over its WooCommerce operation without migrating it. Launched in 12 days.', es: 'Sitio nuevo para una librería y tienda de discos de Bogotá, construido sobre su operación en WooCommerce sin migrarla. Lanzado en 12 días.' },
    categories: CASE_CATEGORIES['santo-y-sena'],
    video: '/media/work/santo-y-sena-nav.mp4',
  },
  {
    title: 'The Grid',
    href: '/project/the-grid/',
    summary: { en: 'Brand identity and Webflow website for a construction digital-twin consultancy.', es: 'Identidad de marca y sitio en Webflow para una consultora de gemelos digitales en construcción.' },
    categories: CASE_CATEGORIES['the-grid'],
    video: '/media/work/the-grid-cover.mp4',
  },
  {
    title: 'Dr. Daniel De Zubiría',
    href: '/project/dr-daniel-de-zubiria/',
    summary: { en: 'Brand identity, an 11-page site, online booking and the full infrastructure for an allergy practice in Bogotá.', es: 'Identidad de marca, sitio de 11 páginas, agenda en línea y toda la infraestructura de un consultorio de alergología en Bogotá.' },
    categories: CASE_CATEGORIES['dr-daniel-de-zubiria'],
    video: '/media/work/dezubiria-cover.mp4',
  },
  {
    title: 'Posada Cárcamo Abogados',
    href: '/project/posada-carcamo-abogados/',
    summary: { en: 'Website for a law firm with eleven practice areas, built around its team and its transport clients.', es: 'Sitio web para una firma de abogados con once áreas de práctica, pensado alrededor de su equipo y sus clientes de transporte.' },
    categories: CASE_CATEGORIES['posada-carcamo-abogados'],
    video: '/media/work/posada-nav.mp4',
  },
  {
    title: 'AGL Vans',
    href: '/project/aglvanstours/',
    summary: { en: 'Website for a special transport company serving hotels, companies and tourists in Bogotá.', es: 'Sitio web para una empresa de transporte especial para hoteles, empresas y turismo en Bogotá.' },
    categories: CASE_CATEGORIES['aglvanstours'],
    video: '/media/work/agl-nav.mp4',
  },
  {
    title: 'Luciana Cabañas',
    href: '/project/luciana-cabanas/',
    summary: { en: 'Logo and a direct-booking website for six boutique cabins in the Valle de Tenza, Boyacá.', es: 'Logotipo y sitio de reserva directa para seis cabañas boutique en el Valle de Tenza, Boyacá.' },
    categories: CASE_CATEGORIES['luciana-cabanas'],
    video: '/media/work/luciana-cover.mp4',
  },
  {
    title: 'Civilus',
    href: '/project/civilus/',
    summary: { en: 'Brand identity and React website for an online structural-calculus platform.', es: 'Identidad de marca y sitio en React para una plataforma de cálculo estructural en línea.' },
    categories: CASE_CATEGORIES['civilus'],
    video: '/media/work/civilus-cover.mp4',
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
    quote: 'Excellent experience with Mattriz Studio creating the website for my medical practice. They understood my needs perfectly and delivered a professional, modern, and easy-to-navigate site. I especially appreciate their support, attention to detail, and willingness to make adjustments. Highly recommended for anyone looking to develop their online presence!',
    name: 'Dr. Daniel De Zubiría',
    company: 'Allergy practice, Bogotá',
  },
  {
    quote: 'An excellent studio, fully recommended. Modern and working with cutting-edge technology, blending technical knowledge with advanced AI tools.',
    name: 'Héctor Posada',
    company: 'The Grid',
  },
  {
    quote: 'An excellent designer and professional. Highly recommended!',
    name: 'Sebastián',
    company: 'Luciana Cabañas Boutique',
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
    subtitle: 'Diseñamos y desarrollamos los sitios web, tiendas en línea y sistemas de reservas y pagos que sostienen tu negocio. Y los hacemos crecer mes a mes.',
    cta: { label: 'Lo que hacemos', href: '#services' },
    scroll: 'Desliza para explorar',
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
    text: 'Mattriz es un estudio de diseño y desarrollo con sede en Bogotá que trabaja con negocios en Estados Unidos y Latinoamérica. Diseñamos la marca, construimos el sitio, la tienda o el sistema de reservas, y lo mantenemos funcionando mes a mes. La IA acelera el trabajo; las decisiones siguen siendo nuestras.',
    cta: 'Nuestros proyectos',
    stats: [
      { label: 'Construir', value: '5+', text: 'Años diseñando y construyendo sistemas digitales para negocios reales.' },
      { label: 'Mantener', value: '3', text: 'Clientes activos a la vez. Un límite deliberado, para darle a cada uno todo nuestro tiempo y calidad.' },
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
      quote: 'Excelente experiencia con Mattriz Studio en la creación de la página web de mi consultorio médico. Entendieron muy bien lo que necesitaba y lograron una página profesional, moderna y fácil de navegar. Destaco su acompañamiento, atención a los detalles y disposición para realizar ajustes. ¡Muy recomendados para quienes quieran desarrollar su presencia digital!',
      name: 'Dr. Daniel De Zubiría',
      company: 'Consultorio de alergología, Bogotá',
    },
    {
      quote: 'Excelente estudio, totalmente recomendado. Moderno y utiliza tecnología de vanguardia, mezclando conocimiento técnico con herramientas avanzadas de AI.',
      name: 'Héctor Posada',
      company: 'The Grid',
    },
    {
      quote: 'Excelente diseñador y profesional. ¡Muy recomendado!',
      name: 'Sebastián',
      company: 'Luciana Cabañas Boutique',
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
    metaTitle: 'Mattriz | Systems that work while you sleep',
    metaDescription: 'Mattriz designs, builds and runs websites, online stores and booking systems for businesses in the US and LATAM. Built in weeks, kept running every month.',
    selectedWork: 'Selected work',
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
    metaTitle: 'Mattriz | Sistemas que trabajan mientras duermes',
    metaDescription: 'Mattriz diseña, construye y mantiene sitios web, tiendas en línea y sistemas de reservas para negocios en EE. UU. y Latinoamérica. En semanas, no en meses.',
    selectedWork: 'Trabajo seleccionado',
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
