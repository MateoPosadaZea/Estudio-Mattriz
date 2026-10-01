// Escáner de sitios (/scan/, /es/scan/): textos de la página. Copy nuevo de la v2, pendiente de
// revisión de Mateo (ver reference/TRADUCCIONES.md). Sin rayas largas.

import type { Lang } from '../i18n';
import type { StepId, AreaId } from '../lib/scan/recommend';
import type { Kind } from '../lib/scan/analyze';

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
  scoreNote: Record<Kind, string>;
  kindLabel: string;
  kindChange: string;
  kinds: Record<Kind, string>;
  areas: Record<AreaId, string>;
  hasTitle: string;
  groups: Record<string, string>;
  notFound: string;
  seo: { title: string; description: string; h1: string; viewport: string; schema: string; yes: string; no: string; missing: string };
  pagesScanned: string;
  planCta: string;
  planTitle: string;
  planIntro: string;
  steps: Record<StepId, { title: string; text: string }>;
  quoteTitle: string;
  quoteAsk: string;
  form: { name: string; email: string; phone: string; submit: string; consent: string; success: string; error: string };
  again: string;
  teaserLabel: string;
  teaserTitle: string;
  teaserText: string;
  generic: Record<string, string>;
};

const EN: Copy = {
  metaTitle: 'Free website scanner for businesses | Mattriz',
  metaDescription: 'Paste your website and see what it runs on, how customers buy, book or reach you, what is missing, and what we would build for your kind of business, step by step.',
  eyebrow: 'Free tool',
  title: 'Scan your site.',
  intro: 'Paste your website. In a few seconds you’ll see what it runs on, how customers buy, book or reach you, what’s missing, and what we’d build for your kind of business, step by step.',
  placeholder: 'yourbusiness.com',
  inputLabel: 'Your website address',
  button: 'Scan',
  scanning: ['Reading your site', 'Detecting platform and technology', 'Working out what kind of business it is', 'Checking how customers buy or book', 'Finding contact channels', 'Checking tracking and search presence', 'Building your plan'],
  errors: {
    invalid: 'That doesn’t look like a website address. Try something like yourbusiness.com.',
    blocked: 'We can only scan public websites.',
    unreachable: 'We couldn’t reach that site. Check the address and try again.',
    'not-html': 'That address doesn’t return a web page.',
    timeout: 'The site took too long to answer. Try again in a moment.',
    network: 'Something went wrong on our side. Try again in a moment.',
  },
  scoreLabel: 'Ready to run on its own',
  scoreNote: {
    booking: 'How much of the booking, payment and follow-up work your site already does without you.',
    store: 'How much of the selling, payment and follow-up work your store already does without you.',
    leads: 'How well your site turns visits into inquiries and follows up without you.',
  },
  kindLabel: 'We read your site as',
  kindChange: 'Not right? Change it',
  kinds: { booking: 'A business that takes bookings', store: 'An online store', leads: 'A business that sells through inquiries' },
  areas: { booking: 'Booking', store: 'Store & checkout', leads: 'Inquiries', payments: 'Payments', contact: 'Contact', tracking: 'Tracking', local: 'Local presence', search: 'Search presence', site: 'Site & speed' },
  hasTitle: 'What your site has',
  groups: { platform: 'Platform', builders: 'Theme & builder', store: 'Online store', booking: 'Booking', payments: 'Payments', contact: 'Contact', chat: 'Chat', analytics: 'Tracking', reviews: 'Reviews & maps', tech: 'Technology' },
  notFound: 'Not found',
  seo: { title: 'Title', description: 'Meta description', h1: 'Main headings (H1)', viewport: 'Mobile ready', schema: 'Structured data', yes: 'Yes', no: 'No', missing: 'Missing' },
  pagesScanned: 'Pages scanned',
  planCta: 'See what we can do for you',
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
    store: { title: 'A store that sells on its own', text: 'Clear product pages, real stock and a short checkout that works on the phone, on {platform} or on a new build if it holds you back.' },
    'payments-store': { title: 'Payments your customers use', text: 'Cards and local methods at checkout, with automatic confirmations and refunds. Stripe, Wompi, Mercado Pago or PayU.' },
    'automation-store': { title: 'Automatic follow-ups', text: 'Order confirmations, shipping updates, abandoned cart reminders and review requests that send themselves.' },
    'dashboard-store': { title: 'Sales and stock in one place', text: 'Orders, stock, returns and sales reports in one private panel.' },
    'analytics-store': { title: 'Measurement that follows the sale', text: 'GA4 with product views, add to cart and purchases, so you know which products and channels sell.' },
    'seo-store': { title: 'Products that show up in Google', text: 'Product structured data, titles and descriptions per product and collection, so they appear with price and stock in search.' },
    'reviews-store': { title: 'Product reviews', text: 'Automatic review requests after each order, and reviews shown on each product.' },
    leads: { title: 'A site that brings in inquiries', text: 'Your services explained clearly, a contact or quote form on every key page, and a clear next step for each visitor.' },
    'automation-leads': { title: 'Follow-up that doesn’t slip', text: 'An instant reply to every inquiry, reminders for you and your team, and every contact saved in one place.' },
    'analytics-leads': { title: 'Know where inquiries come from', text: 'GA4 and Search Console with form, call and WhatsApp events, so you know which channels bring clients.' },
    seo: { title: 'SEO', text: 'Titles, descriptions and structured data for your business and services, so the right clients find you in Google.' },
    proof: { title: 'Proof that builds trust', text: 'Testimonials, reviews and past work shown where visitors decide to contact you.' },
  },
  quoteTitle: 'Your quote',
  quoteAsk: 'Every case is different. Leave your details and we’ll send you the detailed plan and a quote for yours within one business day.',
  form: {
    name: 'Name',
    email: 'Email',
    phone: 'Phone / WhatsApp (optional)',
    submit: 'Send me the plan',
    consent: 'We use your details only to send you this plan and quote.',
    success: 'Thanks. We’ll get back to you within one business day.',
    error: 'Something went wrong and your message wasn’t sent. Write to us directly at contacto@mattriz.com.',
  },
  again: 'Scan another site',
  teaserLabel: 'Free tool',
  teaserTitle: 'What is your business missing?',
  teaserText: 'Scan your site and get a step-by-step plan for what your kind of business needs, and what it would take.',
  generic: {},
};

const ES: Copy = {
  metaTitle: 'Escáner gratis de sitios web para negocios | Mattriz',
  metaDescription: 'Pega tu sitio web y mira en qué está hecho, cómo te compran, reservan o contactan tus clientes, qué le falta y qué construiríamos para tu tipo de negocio, paso a paso.',
  eyebrow: 'Herramienta gratis',
  title: 'Escanea tu sitio.',
  intro: 'Pega tu sitio web. En unos segundos verás en qué está hecho, cómo te compran, reservan o contactan tus clientes, qué le falta y qué construiríamos para tu tipo de negocio, paso a paso.',
  placeholder: 'tunegocio.com',
  inputLabel: 'La dirección de tu sitio web',
  button: 'Escanear',
  scanning: ['Leyendo tu sitio', 'Detectando plataforma y tecnología', 'Identificando el tipo de negocio', 'Revisando cómo te compran o reservan', 'Buscando canales de contacto', 'Revisando medición y presencia en buscadores', 'Armando tu plan'],
  errors: {
    invalid: 'Eso no parece la dirección de un sitio. Prueba algo como tunegocio.com.',
    blocked: 'Solo podemos escanear sitios públicos.',
    unreachable: 'No pudimos entrar a ese sitio. Revisa la dirección e inténtalo de nuevo.',
    'not-html': 'Esa dirección no devuelve una página web.',
    timeout: 'El sitio tardó demasiado en responder. Inténtalo de nuevo en un momento.',
    network: 'Algo falló de nuestro lado. Inténtalo de nuevo en un momento.',
  },
  scoreLabel: 'Listo para funcionar solo',
  scoreNote: {
    booking: 'Cuánto del trabajo de reservas, pagos y seguimiento ya hace tu sitio sin ti.',
    store: 'Cuánto del trabajo de vender, cobrar y hacer seguimiento ya hace tu tienda sin ti.',
    leads: 'Qué tan bien convierte tu sitio las visitas en consultas y les hace seguimiento sin ti.',
  },
  kindLabel: 'Leímos tu sitio como',
  kindChange: '¿No es así? Cámbialo',
  kinds: { booking: 'Un negocio que recibe reservas', store: 'Una tienda en línea', leads: 'Un negocio que vende por consultas' },
  areas: { booking: 'Reservas', store: 'Tienda y pago', leads: 'Consultas', payments: 'Pagos', contact: 'Contacto', tracking: 'Medición', local: 'Presencia local', search: 'Presencia en buscadores', site: 'Sitio y velocidad' },
  hasTitle: 'Lo que tiene tu sitio',
  groups: { platform: 'Plataforma', builders: 'Tema y constructor', store: 'Tienda en línea', booking: 'Reservas', payments: 'Pagos', contact: 'Contacto', chat: 'Chat', analytics: 'Medición', reviews: 'Reseñas y mapas', tech: 'Tecnología' },
  notFound: 'No encontrado',
  seo: { title: 'Título', description: 'Meta descripción', h1: 'Títulos principales (H1)', viewport: 'Adaptado a móvil', schema: 'Datos estructurados', yes: 'Sí', no: 'No', missing: 'Falta' },
  pagesScanned: 'Páginas revisadas',
  planCta: 'Mira lo que podemos hacer por ti',
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
    store: { title: 'Una tienda que vende sola', text: 'Fichas de producto claras, inventario real y un pago corto que funciona en el celular, sobre {platform} o en una tienda nueva si te está frenando.' },
    'payments-store': { title: 'Los pagos que usan tus clientes', text: 'Tarjetas y medios locales al pagar, con confirmaciones y reembolsos automáticos. Stripe, Wompi, Mercado Pago o PayU.' },
    'automation-store': { title: 'Seguimiento automático', text: 'Confirmación del pedido, avisos de envío, recordatorios de carrito abandonado y solicitudes de reseña que se envían solos.' },
    'dashboard-store': { title: 'Ventas e inventario en un solo lugar', text: 'Pedidos, inventario, devoluciones y reportes de ventas en un panel privado.' },
    'analytics-store': { title: 'Medición que sigue la venta', text: 'GA4 con vistas de producto, agregados al carrito y compras, para saber qué productos y canales venden.' },
    'seo-store': { title: 'Productos que aparecen en Google', text: 'Datos estructurados de producto, títulos y descripciones por producto y colección, para aparecer con precio y disponibilidad en las búsquedas.' },
    'reviews-store': { title: 'Reseñas de producto', text: 'Solicitudes de reseña automáticas después de cada pedido, y las reseñas visibles en cada producto.' },
    leads: { title: 'Un sitio que trae consultas', text: 'Tus servicios bien explicados, un formulario de contacto o cotización en cada página clave y un siguiente paso claro para cada visitante.' },
    'automation-leads': { title: 'Seguimiento que no se pierde', text: 'Respuesta inmediata a cada consulta, recordatorios para ti y tu equipo, y cada contacto guardado en un solo lugar.' },
    'analytics-leads': { title: 'Saber de dónde llegan las consultas', text: 'GA4 y Search Console con eventos de formulario, llamada y WhatsApp, para saber qué canales traen clientes.' },
    seo: { title: 'SEO', text: 'Títulos, descripciones y datos estructurados de tu negocio y tus servicios, para que los clientes indicados te encuentren en Google.' },
    proof: { title: 'Pruebas que generan confianza', text: 'Testimonios, reseñas y trabajos anteriores visibles justo donde el visitante decide escribirte.' },
  },
  quoteTitle: 'Tu cotización',
  quoteAsk: 'Cada caso es distinto. Déjanos tus datos y te enviamos el plan detallado y la cotización para el tuyo en un día hábil.',
  form: {
    name: 'Nombre',
    email: 'Correo',
    phone: 'Teléfono / WhatsApp (opcional)',
    submit: 'Envíame el plan',
    consent: 'Usamos tus datos solo para enviarte este plan y la cotización.',
    success: 'Gracias. Te respondemos en un día hábil.',
    error: 'Algo falló y tu mensaje no se envió. Escríbenos directo a contacto@mattriz.com.',
  },
  again: 'Escanear otro sitio',
  teaserLabel: 'Herramienta gratis',
  teaserTitle: '¿Qué le falta a tu negocio?',
  teaserText: 'Escanea tu sitio y recibe un plan paso a paso con lo que necesita tu tipo de negocio, y lo que tomaría.',
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
    'Shopping cart': 'Carrito de compras',
    'Products in structured data': 'Productos en datos estructurados',
  },
};

export const scanCopy = (lang: Lang) => (lang === 'es' ? ES : EN);
