// v2: caso de estudio de AGL Vans, escrito a mano (reemplaza la versión que venía del WordPress anterior).
//
// Fuentes: el texto del caso original (identidad ya definida, objetivo y lista de lo que hicimos), el
// testimonio de Nicolás Galvis que ya está en el home y el sitio en vivo, aglvans.com, recorrido el 27 de
// septiembre de 2026 (sin cotizar, pagar ni enviar nada). Lo que se describe del sitio es lo que se ve en
// él. La app AGL Plus aparece en el sitio, pero no se afirma que la hayamos construido. Las cifras de los
// contadores del sitio no se citan. Sin año ni métricas. Sin rayas largas.

import type { Lang } from '../../i18n';
import type { CaseDoc, CaseMedia } from '../../components/case/doc';

const DIR = '/media/projects/aglvanstours';
type L = Record<Lang, string>;
const pic = (base: string, width: number, height: number, widths: number[], alt: L, caption?: L) => (lang: Lang): CaseMedia => ({
  type: 'img',
  local: { dir: DIR, base, width, height, widths },
  alt: alt[lang],
  caption: caption?.[lang],
});
const site = (base: string, alt: L, caption?: L) => pic(`agl-site-${base}`, 1600, 1000, [1600, 1200, 700], alt, caption);
const phone = (base: string, alt: L) => pic(`agl-m-${base}`, 900, 1948, [900, 600], alt);
const video = (base: string, width: number, height: number, alt: L, caption?: L) => (lang: Lang): CaseMedia => ({
  type: 'video',
  local: { dir: DIR, base, width, height },
  alt: alt[lang],
  caption: caption?.[lang],
});

const NAV = video('agl-nav', 1280, 800, {
  en: 'Browsing the site: the fleet, the three services, the drivers, biosecurity, the app, payments, clients and the booking form',
  es: 'Recorrido por el sitio: la flota, los tres servicios, los conductores, bioseguridad, la app, pagos, clientes y el formulario de reserva',
}, { en: 'The live site, from top to bottom.', es: 'El sitio en vivo, de arriba abajo.' });
const LAPTOP = pic('mockup-scaled', 1600, 1200, [1600, 1200, 700], {
  en: 'The AGL Vans home page on a laptop',
  es: 'La portada de AGL Vans en un portátil',
});
const BIO = video('bioseguridadagl', 1600, 824, {
  en: 'Biosecurity protocols section with a driver disinfecting a vehicle',
  es: 'Sección de protocolos de bioseguridad con un conductor desinfectando un vehículo',
});
const SITE_SERVICES = site('services', { en: 'Hotel, corporate and tourist services', es: 'Servicios hotelero, empresarial y turístico' }, {
  en: 'Three services, three audiences, one “Get a quote” button each.',
  es: 'Tres servicios, tres públicos, un botón de “Cotizar” en cada uno.',
});
const SITE_DRIVERS = site('drivers', { en: 'What sets the drivers apart: service, uniform, training, languages', es: 'Lo que distingue a los conductores: servicio, presentación, capacitación, idiomas' });
const SITE_APP = site('app', { en: 'The AGL Plus app section with store links', es: 'La sección de la app AGL Plus con enlaces a las tiendas' });
const SITE_PAY = site('pay', { en: 'Payments section: bank transfer and Aval Pay', es: 'Sección de pagos: transferencia y Aval Pay' }, {
  en: 'Paying is part of the site too: transfer details and Aval Pay, one scroll away.',
  es: 'Pagar también es parte del sitio: datos de transferencia y Aval Pay, a un scroll.',
});
const SITE_CLIENTS = site('clients', { en: 'Hotel clients and a testimonial from John Crane', es: 'Hoteles clientes y un testimonio de John Crane' });
const SITE_BOOKING = site('booking', { en: 'Booking request form', es: 'Formulario de solicitud de reserva' });
const M_HERO = phone('hero', { en: 'Home page on a phone', es: 'Portada en el celular' });
const M_SERVICES = phone('services', { en: 'Services on a phone', es: 'Servicios en el celular' });
const M_APP = phone('app', { en: 'Biosecurity and the app on a phone', es: 'Bioseguridad y la app en el celular' });

const TEXT = {
  en: {
    metaTitle: 'AGL Vans Case Study: Transport Company Website | Mattriz Studio',
    description:
      'UI/UX design and website for AGL Vans, a special transport company in Bogotá serving hotels, companies and tourists: services, drivers, payments and booking requests.',
    tagline: 'Special transport for hotels, companies and tourists, and a website that turns visits into quotes.',
    intro:
      'UI/UX design and development of the website for AGL Vans, a family transport company in Bogotá that moves hotel guests, company staff and travellers.',
    facts: [
      { label: 'Client', value: 'AGL Vans' },
      { label: 'Location', value: 'Bogotá, Colombia' },
      { label: 'Services', chips: ['UI/UX design', 'Web development', 'SEO'] },
    ],
    brief: {
      label: 'The brief',
      title: 'A known identity, more clients to reach.',
      html:
        '<p>AGL already had a defined visual identity, which shaped the design and personality of the site: elegant and professional. The goal was to attract more clients by making the services they offer known.</p>',
    },
    site: {
      label: 'The website',
      title: 'Everything a hotel or a company asks before hiring transport.',
      items: [
        { term: 'Three services, three audiences', desc: 'Hotel, corporate and tourist transport, each explained in its own terms and with its own quote button.' },
        { term: 'The drivers, up front', desc: 'Customer service, uniformed presentation, constant training and bilingual drivers: what a hotel needs to know before handing over its guests.' },
        { term: 'Biosecurity protocols', desc: 'A section with video showing how the vehicles are cleaned and disinfected.' },
        { term: 'The app, one tap away', desc: 'The AGL Plus app presented with its features and links to the App Store, Play Store and Huawei AppGallery.' },
        { term: 'Payments on the site', desc: 'Bank transfer details, the list of banks and Aval Pay, so paying doesn’t need a separate conversation.' },
        { term: 'Trust, shown', desc: 'The hotels it works with, a testimonial from John Crane Colombia, and a PQRS page for requests and complaints.' },
      ],
    },
    booking: {
      label: 'Booking',
      title: 'A quote request that already has the details.',
      html:
        '<p>The booking form asks for exactly what a transport quote needs: the service, origin, destination, date and time and number of passengers, plus the acceptance of the data policy. The quote arrives by email, and WhatsApp stays at hand on every page.</p>',
    },
    process: {
      label: 'What we did',
      title: 'From moodboard to launch.',
      html:
        '<p>A moodboard with references, a database, the hosting and domain, UI/UX design of the website, development, user testing, SEO and launch.</p>',
    },
    quote: {
      label: 'Testimonial',
      html: '<p>“They designed our family business website, and we have only good things to say about the experience of building it alongside their team.”</p><p>Nicolás Galvis, AGL Vans</p>',
    },
    details: [
      { title: 'Services', html: '<p>UI/UX design, web development, SEO.</p>' },
      { title: 'Deliverables', html: '<p>Website with services, drivers, biosecurity, app, payments, clients, booking form and PQRS.</p>' },
      { title: 'Sector', html: '<p>Special transport for hotels, companies and tourism in Bogotá.</p>' },
    ],
    cta: {
      title: 'Selling a service that has to be booked?',
      text: 'We design and build the site that explains it, earns trust and brings you the request with the details already in it.',
    },
  },
  es: {
    metaTitle: 'Caso de estudio AGL Vans: sitio web de transporte | Mattriz Studio',
    description:
      'Diseño UI/UX y sitio web para AGL Vans, empresa de transporte especial en Bogotá para hoteles, empresas y turismo: servicios, conductores, pagos y solicitudes de reserva.',
    tagline: 'Transporte especial para hoteles, empresas y turistas, y un sitio que convierte visitas en cotizaciones.',
    intro:
      'Diseño UI/UX y desarrollo del sitio web de AGL Vans, una empresa familiar de transporte en Bogotá que mueve huéspedes de hotel, empleados de empresas y viajeros.',
    facts: [
      { label: 'Cliente', value: 'AGL Vans' },
      { label: 'Ubicación', value: 'Bogotá, Colombia' },
      { label: 'Servicios', chips: ['Diseño UI/UX', 'Desarrollo web', 'SEO'] },
    ],
    brief: {
      label: 'El punto de partida',
      title: 'Una identidad conocida, más clientes por alcanzar.',
      html:
        '<p>AGL ya tenía una identidad visual definida, que marcó el diseño y la personalidad del sitio: elegante y profesional. El objetivo era atraer más clientes dando a conocer los servicios que ofrecen.</p>',
    },
    site: {
      label: 'El sitio web',
      title: 'Todo lo que un hotel o una empresa pregunta antes de contratar transporte.',
      items: [
        { term: 'Tres servicios, tres públicos', desc: 'Transporte hotelero, empresarial y turístico, cada uno explicado en sus propios términos y con su botón para cotizar.' },
        { term: 'Los conductores, al frente', desc: 'Servicio al cliente, presentación con uniforme, capacitación constante y conductores bilingües: lo que un hotel necesita saber antes de entregarle sus huéspedes.' },
        { term: 'Protocolos de bioseguridad', desc: 'Una sección con video que muestra cómo se limpian y desinfectan los vehículos.' },
        { term: 'La app, a un toque', desc: 'La app AGL Plus presentada con sus funciones y enlaces a App Store, Play Store y Huawei AppGallery.' },
        { term: 'Pagos en el sitio', desc: 'Datos de transferencia, la lista de bancos y Aval Pay, para que pagar no requiera otra conversación.' },
        { term: 'La confianza, a la vista', desc: 'Los hoteles con los que trabaja, un testimonio de John Crane Colombia y una página de PQRS para peticiones y quejas.' },
      ],
    },
    booking: {
      label: 'Reservas',
      title: 'Una solicitud de cotización que ya trae los datos.',
      html:
        '<p>El formulario de reserva pide justo lo que necesita una cotización de transporte: el servicio, origen, destino, fecha y hora y número de personas, además de la aceptación de la política de datos. La cotización llega al correo, y WhatsApp está a la mano en todas las páginas.</p>',
    },
    process: {
      label: 'Lo que hicimos',
      title: 'Del moodboard al lanzamiento.',
      html:
        '<p>Un moodboard con referentes, la base de datos, el hosting y el dominio, el diseño UI/UX del sitio, el desarrollo, las pruebas con usuarios, la optimización SEO y el lanzamiento.</p>',
    },
    quote: {
      label: 'Testimonio',
      html: '<p>“Diseñaron el sitio web de nuestra empresa familiar y solo tenemos cosas buenas que decir de la experiencia de construirlo junto a su equipo.”</p><p>Nicolás Galvis, AGL Vans</p>',
    },
    details: [
      { title: 'Servicios', html: '<p>Diseño UI/UX, desarrollo web, SEO.</p>' },
      { title: 'Entregables', html: '<p>Sitio web con servicios, conductores, bioseguridad, app, pagos, clientes, formulario de reserva y PQRS.</p>' },
      { title: 'Sector', html: '<p>Transporte especial para hoteles, empresas y turismo en Bogotá.</p>' },
    ],
    cta: {
      title: '¿Vendes un servicio que se reserva?',
      text: 'Diseñamos y construimos el sitio que lo explica, genera confianza y te trae la solicitud con los datos listos.',
    },
  },
};

export function aglVans(lang: Lang): CaseDoc {
  const t = TEXT[lang];
  return {
    name: 'AGL Vans',
    theme: 'dark',
    accent: '#22b050',
    onAccent: '#0a0a0a',
    metaTitle: t.metaTitle,
    description: t.description,
    year: '',
    tagline: t.tagline,
    intro: t.intro,
    facts: t.facts,
    hero: NAV(lang),
    site: 'https://aglvans.com/',
    blocks: [
      { kind: 'text', style: 'lead', ...t.brief },
      { kind: 'media', layout: 'full', items: [LAPTOP(lang)] },
      { kind: 'cards', ...t.site },
      { kind: 'media', layout: 'pair', items: [SITE_SERVICES(lang), SITE_DRIVERS(lang)] },
      { kind: 'media', layout: 'wide', items: [BIO(lang)] },
      { kind: 'media', layout: 'pair', items: [SITE_APP(lang), SITE_PAY(lang)] },
      { kind: 'text', style: 'lead', ...t.booking },
      { kind: 'media', layout: 'pair', items: [SITE_CLIENTS(lang), SITE_BOOKING(lang)] },
      { kind: 'media', layout: 'trio', items: [M_HERO(lang), M_SERVICES(lang), M_APP(lang)] },
      { kind: 'text', style: 'statement', ...t.quote },
      { kind: 'text', style: 'lead', ...t.process },
      { kind: 'details', cols: t.details },
      { kind: 'cta', ...t.cta, link: { href: 'mailto:contacto@mattriz.com', label: 'contacto@mattriz.com' } },
    ],
  };
}
