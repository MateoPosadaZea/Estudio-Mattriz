// Escáner de sitios (/scan/, /es/scan/): textos de la página. Copy nuevo de la v2, pendiente de
// revisión de Mateo (ver reference/TRADUCCIONES.md). Sin rayas largas.

import type { Lang } from '../i18n';
import type { StepId, Area } from '../lib/scan/recommend';

type Copy = {
  metaTitle: string;
  metaDescription: string;
  eyebrow: string;
  title: string;
  intro: string;
  placeholder: string;
  inputLabel: string;
  button: string;
  scanning: string[];
  errors: Record<'invalid' | 'blocked' | 'unreachable' | 'not-html' | 'timeout' | 'network', string>;
  scoreLabel: string;
  scoreNote: string;
  areas: Record<Area['id'], string>;
  hasTitle: string;
  groups: Record<string, string>;
  notFound: string;
  seo: { title: string; description: string; h1: string; viewport: string; schema: string; yes: string; no: string; missing: string };
  pagesScanned: string;
  planTitle: string;
  planIntro: string;
  steps: Record<StepId, { title: string; text: string }>;
  quoteTitle: string;
  quoteRange: string;
  quoteNote: string;
  quoteAsk: string;
  form: { name: string; email: string; phone: string; submit: string; consent: string; success: string; error: string };
  disclaimer: string;
  again: string;
  teaserLabel: string;
  teaserTitle: string;
  teaserText: string;
  generic: Record<string, string>;
};

const EN: Copy = {
  metaTitle: 'Free website scanner for service businesses | Mattriz',
  metaDescription: 'Paste your website and see what it runs on, how customers book and pay, what is missing, and what we would build, step by step.',
  eyebrow: 'Free tool',
  title: 'Scan your site.',
  intro: 'Paste your website. In a few seconds you’ll see what it runs on, how customers book and pay, what’s missing, and what we’d build, step by step.',
  placeholder: 'yourbusiness.com',
  inputLabel: 'Your website address',
  button: 'Scan',
  scanning: ['Reading your site', 'Detecting platform and technology', 'Looking for online booking', 'Checking payments', 'Finding contact channels', 'Checking tracking and local SEO', 'Building your plan'],
  errors: {
    invalid: 'That doesn’t look like a website address. Try something like yourbusiness.com.',
    blocked: 'We can only scan public websites.',
    unreachable: 'We couldn’t reach that site. Check the address and try again.',
    'not-html': 'That address doesn’t return a web page.',
    timeout: 'The site took too long to answer. Try again in a moment.',
    network: 'Something went wrong on our side. Try again in a moment.',
  },
  scoreLabel: 'Ready to run on its own',
  scoreNote: 'How much of the booking, payment and follow-up work your site already does without you.',
  areas: { booking: 'Booking', payments: 'Payments', contact: 'Contact', tracking: 'Tracking', local: 'Local presence', site: 'Site & speed' },
  hasTitle: 'What your site has',
  groups: { platform: 'Platform', builders: 'Theme & builder', booking: 'Booking', payments: 'Payments', contact: 'Contact', chat: 'Chat', analytics: 'Tracking', reviews: 'Reviews & maps', tech: 'Technology' },
  notFound: 'Not found',
  seo: { title: 'Title', description: 'Meta description', h1: 'Main headings (H1)', viewport: 'Mobile ready', schema: 'Structured data', yes: 'Yes', no: 'No', missing: 'Missing' },
  pagesScanned: 'Pages scanned',
  planTitle: 'What we’d build',
  planIntro: 'Step by step, in order of impact.',
  steps: {
    https: { title: 'Move your site to HTTPS', text: 'Browsers flag your site as not secure. We fix the certificate and the redirects.' },
    'booking-new': { title: 'Online booking system', text: 'Customers pick the service, date and time and book on their own, with real availability and capacity.' },
    'booking-upgrade': { title: 'Booking built into your site', text: 'You already take bookings with {tools}. We bring them into your own flow: your rules, deposits, waitlist and no redirects.' },
    payments: { title: 'Payments at booking', text: 'Card charge or deposit when the booking is confirmed, with automatic refunds. Square, Stripe or Wompi.' },
    automation: { title: 'Automatic follow-ups', text: 'Confirmations, reminders and review requests that send themselves. We can’t see this from outside, and most sites don’t have it.' },
    contact: { title: 'WhatsApp and click-to-call', text: 'One tap to reach you from any phone, tracked as a conversion.' },
    site: { title: 'A faster site that converts', text: 'Your site runs on {platform} and loads heavy on mobile. We rebuild it lean, mobile-first and focused on booking.' },
    dashboard: { title: 'Owner dashboard', text: 'Every booking, payment and cancellation in one private panel, with reports.' },
    analytics: { title: 'Measurement', text: 'GA4 and Search Console with booking and contact events, so you know what works.' },
    'local-seo': { title: 'Local SEO', text: 'Business structured data, titles and descriptions so you show up in local searches and maps.' },
    reviews: { title: 'Reviews on autopilot', text: 'Automatic review requests after each service, and your reviews shown on your site.' },
  },
  quoteTitle: 'Your quote',
  quoteRange: 'Estimated investment',
  quoteNote: 'A reference range. The final quote depends on your operation.',
  quoteAsk: 'Get the detailed plan and your quote by email. We reply within one business day.',
  form: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone / WhatsApp (optional)',
    submit: 'Send me the plan',
    consent: 'We use your details only to send you this plan and quote.',
    success: 'Thanks. We’ll get back to you within one business day.',
    error: 'Something went wrong and your message wasn’t sent. Write to us directly at contacto@mattriz.com.',
  },
  disclaimer: 'The scan reads the public pages of your site. Tools that only load after someone clicks may not show up.',
  again: 'Scan another site',
  teaserLabel: 'Free tool',
  teaserTitle: 'What is your business missing?',
  teaserText: 'Scan your site and get a step-by-step plan: booking, payments, follow-ups and what it would take.',
  generic: {},
};

const ES: Copy = {
  metaTitle: 'Escáner gratis de sitios web para negocios de servicios | Mattriz',
  metaDescription: 'Pega tu sitio web y mira en qué está hecho, cómo reservan y pagan tus clientes, qué le falta y qué construiríamos, paso a paso.',
  eyebrow: 'Herramienta gratis',
  title: 'Escanea tu sitio.',
  intro: 'Pega tu sitio web. En unos segundos verás en qué está hecho, cómo reservan y pagan tus clientes, qué le falta y qué construiríamos, paso a paso.',
  placeholder: 'tunegocio.com',
  inputLabel: 'La dirección de tu sitio web',
  button: 'Escanear',
  scanning: ['Leyendo tu sitio', 'Detectando plataforma y tecnología', 'Buscando reservas en línea', 'Revisando pagos', 'Buscando canales de contacto', 'Revisando medición y SEO local', 'Armando tu plan'],
  errors: {
    invalid: 'Eso no parece la dirección de un sitio. Prueba algo como tunegocio.com.',
    blocked: 'Solo podemos escanear sitios públicos.',
    unreachable: 'No pudimos entrar a ese sitio. Revisa la dirección e inténtalo de nuevo.',
    'not-html': 'Esa dirección no devuelve una página web.',
    timeout: 'El sitio tardó demasiado en responder. Inténtalo de nuevo en un momento.',
    network: 'Algo falló de nuestro lado. Inténtalo de nuevo en un momento.',
  },
  scoreLabel: 'Listo para funcionar solo',
  scoreNote: 'Cuánto del trabajo de reservas, pagos y seguimiento ya hace tu sitio sin ti.',
  areas: { booking: 'Reservas', payments: 'Pagos', contact: 'Contacto', tracking: 'Medición', local: 'Presencia local', site: 'Sitio y velocidad' },
  hasTitle: 'Lo que tiene tu sitio',
  groups: { platform: 'Plataforma', builders: 'Tema y constructor', booking: 'Reservas', payments: 'Pagos', contact: 'Contacto', chat: 'Chat', analytics: 'Medición', reviews: 'Reseñas y mapas', tech: 'Tecnología' },
  notFound: 'No encontrado',
  seo: { title: 'Título', description: 'Meta descripción', h1: 'Títulos principales (H1)', viewport: 'Adaptado a móvil', schema: 'Datos estructurados', yes: 'Sí', no: 'No', missing: 'Falta' },
  pagesScanned: 'Páginas revisadas',
  planTitle: 'Lo que construiríamos',
  planIntro: 'Paso a paso, en orden de impacto.',
  steps: {
    https: { title: 'Pasar tu sitio a HTTPS', text: 'Los navegadores marcan tu sitio como no seguro. Arreglamos el certificado y las redirecciones.' },
    'booking-new': { title: 'Sistema de reservas en línea', text: 'El cliente elige servicio, fecha y hora y reserva solo, con disponibilidad y cupos reales.' },
    'booking-upgrade': { title: 'Reservas dentro de tu sitio', text: 'Ya recibes reservas con {tools}. Las llevamos a tu propio flujo: tus reglas, anticipos, lista de espera y sin salir de tu sitio.' },
    payments: { title: 'Pago al reservar', text: 'Cobro con tarjeta o anticipo al confirmar la reserva, con reembolsos automáticos. Square, Stripe o Wompi.' },
    automation: { title: 'Seguimiento automático', text: 'Confirmaciones, recordatorios y solicitudes de reseña que se envían solos. Esto no se ve desde afuera, y la mayoría de sitios no lo tiene.' },
    contact: { title: 'WhatsApp y botón de llamada', text: 'Un toque para contactarte desde cualquier celular, medido como conversión.' },
    site: { title: 'Un sitio más rápido que convierte', text: 'Tu sitio corre en {platform} y carga pesado en el celular. Lo reconstruimos liviano, pensado para móvil y enfocado en reservar.' },
    dashboard: { title: 'Panel del dueño', text: 'Cada reserva, pago y cancelación en un panel privado, con reportes.' },
    analytics: { title: 'Medición', text: 'GA4 y Search Console con eventos de reserva y contacto, para saber qué funciona.' },
    'local-seo': { title: 'SEO local', text: 'Datos estructurados del negocio, títulos y descripciones para aparecer en búsquedas locales y mapas.' },
    reviews: { title: 'Reseñas en piloto automático', text: 'Solicitudes de reseña automáticas después de cada servicio, y tus reseñas visibles en tu sitio.' },
  },
  quoteTitle: 'Tu cotización',
  quoteRange: 'Inversión estimada',
  quoteNote: 'Un rango de referencia. La cotización final depende de tu operación.',
  quoteAsk: 'Recibe el plan detallado y tu cotización por correo. Respondemos en un día hábil.',
  form: {
    name: 'Nombre',
    email: 'Correo',
    phone: 'Teléfono / WhatsApp (opcional)',
    submit: 'Envíame el plan',
    consent: 'Usamos tus datos solo para enviarte este plan y la cotización.',
    success: 'Gracias. Te respondemos en un día hábil.',
    error: 'Algo falló y tu mensaje no se envió. Escríbenos directo a contacto@mattriz.com.',
  },
  disclaimer: 'El escaneo lee las páginas públicas de tu sitio. Las herramientas que solo cargan cuando alguien hace clic pueden no aparecer.',
  again: 'Escanear otro sitio',
  teaserLabel: 'Herramienta gratis',
  teaserTitle: '¿Qué le falta a tu negocio?',
  teaserText: 'Escanea tu sitio y recibe un plan paso a paso: reservas, pagos, seguimiento y lo que tomaría.',
  generic: {
    'Click-to-call': 'Botón de llamada',
    'SMS link': 'Enlace de SMS',
    'Email link': 'Enlace de correo',
    'Contact form': 'Formulario de contacto',
    'WhatsApp floating button': 'Botón flotante de WhatsApp',
    'Universal Analytics (discontinued)': 'Universal Analytics (descontinuado)',
    'Google reviews widget': 'Widget de reseñas de Google',
    'Rating in structured data': 'Calificación en datos estructurados',
    'Google Maps embed': 'Mapa de Google',
    'Google Calendar booking': 'Reservas de Google Calendar',
  },
};

export const scanCopy = (lang: Lang) => (lang === 'es' ? ES : EN);
