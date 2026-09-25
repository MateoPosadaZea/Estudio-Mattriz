// Contenido de la home.
// Copy: brief sección 4 donde se solapa con el vivo (sin rayas largas); el resto, tal cual el vivo.

export const HERO = {
  title: 'Systems that work while you sleep.',
  subtitle: "We don't sell pretty websites. We build the booking, payment and operations systems service businesses run on.",
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
    { label: 'Grow', value: '100%', text: 'Retainer-based. We don’t do one-offs.' },
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
