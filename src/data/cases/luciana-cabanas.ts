// v2: caso de estudio de Luciana Cabañas Boutique, escrito a mano (reemplaza la versión que venía del
// WordPress anterior).
//
// Fuentes: el texto del caso original (cómo llegamos al lugar y la lista de lo que hicimos) y el sitio en
// vivo, lucianacabanasboutique.com, recorrido el 27 de septiembre de 2026 (sin llenar ni enviar nada).
// Lo que se describe del sitio es lo que se ve en él. Sin métricas: no hay datos medidos del sitio.
// Las 430+ evaluaciones de Airbnb son del negocio (lo dice su propio sitio), no un resultado nuestro.
// Sin año: el caso anterior no lo tenía. Testimonio pendiente (Mateo lo consigue). Sin rayas largas.
// Colores: café oscuro #2a1006 y el tono arena #bf9571 del logotipo, como en la versión anterior.

import type { Lang } from '../../i18n';
import type { CaseDoc, CaseMedia } from '../../components/case/doc';

const DIR = '/media/projects/luciana-cabanas';
type L = Record<Lang, string>;
const pic = (base: string, width: number, height: number, widths: number[], alt: L, caption?: L) => (lang: Lang): CaseMedia => ({
  type: 'img',
  local: { dir: DIR, base, width, height, widths },
  alt: alt[lang],
  caption: caption?.[lang],
});
const site = (base: string, alt: L, caption?: L) => pic(`lc-site-${base}`, 1600, 1000, [1600, 1200, 700], alt, caption);
const phone = (base: string, alt: L) => pic(`lc-m-${base}`, 900, 1948, [900, 600], alt);

const NAV = (lang: Lang): CaseMedia => ({
  type: 'video',
  local: { dir: DIR, base: 'lc-nav', width: 1440, height: 900 },
  alt: {
    en: 'Browsing the site: the thatched cabin hero, the cabin gallery with its filters, guest reviews, the comparison table and the booking form',
    es: 'Recorrido por el sitio: la portada con la cabaña de paja, la galería de cabañas con sus filtros, las reseñas, la tabla comparativa y el formulario de reserva',
  }[lang],
  caption: {
    en: 'The live site, from the first photo to the booking form.',
    es: 'El sitio en vivo, de la primera foto al formulario de reserva.',
  }[lang],
});

const LOGO = pic('mattrizpost5', 1080, 1080, [1080, 700], {
  en: 'Luciana Cabañas Boutique logo: a cabin under the sun and the mountains, drawn in a single line',
  es: 'Logotipo de Luciana Cabañas Boutique: una cabaña bajo el sol y las montañas, dibujada en una sola línea',
});
const PHOTO = pic('niv0576-scaled', 1600, 1068, [1600, 1200, 700], {
  en: 'The thatched chalet in Guateque, with the Valle de Tenza mountains behind it',
  es: 'El chalet de paja en Guateque, con las montañas del Valle de Tenza detrás',
}, {
  en: 'The logo borrows its shapes from the place: the A-frame roof, the sun over the valley, the pines.',
  es: 'El logotipo toma sus formas del lugar: el techo en A, el sol sobre el valle, los pinos.',
});
const MOSAIC = pic('mattrizpost6', 1080, 1080, [1080, 700], {
  en: 'A mosaic of the website’s pages on the brand’s sand colour',
  es: 'Un mosaico de las páginas del sitio sobre el color arena de la marca',
});

const SITE_CASITA = site('grid', { en: 'La Casita de Thomas in the cabin gallery', es: 'La Casita de Thomas en la galería de cabañas' });
const SITE_STUDIO = site('grid3', { en: 'El Estudio, with its hammock, in the cabin gallery', es: 'El Estudio, con su hamaca, en la galería de cabañas' }, {
  en: 'Six cabins, each with its own page. The gallery filters them by name.',
  es: 'Seis cabañas, cada una con su página. La galería las filtra por nombre.',
});
const SITE_REVIEWS = site('reviews', { en: 'Guest reviews, each one linked to Airbnb', es: 'Reseñas de huéspedes, cada una con su enlace a Airbnb' }, {
  en: 'Reviews come from Airbnb and link back to it, so anyone can check them.',
  es: 'Las reseñas vienen de Airbnb y enlazan a la fuente, para que cualquiera las pueda comprobar.',
});
const SITE_TABLE = site('table', { en: 'Comparison table of the six cabins', es: 'Tabla comparativa de las seis cabañas' });
const SITE_BOOKING = site('reserva', { en: 'Direct booking request form with the 10% discount', es: 'Formulario de reserva directa con el 10% de descuento' }, {
  en: 'Compare, then ask: the table and the booking form sit one after the other.',
  es: 'Comparar y pedir: la tabla y el formulario de reserva van uno detrás del otro.',
});
const SITE_FOOTER = site('footer', { en: 'Footer with both locations, WhatsApp and the direct booking badge', es: 'Pie de página con las dos ubicaciones, WhatsApp y el sello de reserva directa' });
const M_HERO = phone('hero', { en: 'Home page on a phone', es: 'Portada en el celular' });
const M_TABLE = phone('table', { en: 'The comparison table becomes one card per cabin on a phone', es: 'En el celular, la tabla comparativa se vuelve una tarjeta por cabaña' });
const M_BOOKING = phone('reserva', { en: 'Booking form on a phone', es: 'Formulario de reserva en el celular' });

const TEXT = {
  en: {
    metaTitle: 'Luciana Cabañas Boutique Case Study: Logo & Website | Mattriz Studio',
    description:
      'Logo, UI/UX design and website for Luciana Cabañas Boutique, six cabins in Guateque, Boyacá: cabin pages, comparison table, guest reviews and direct booking.',
    tagline: 'Six cabins in the Valle de Tenza, a new logo and a website that takes bookings directly.',
    intro:
      'Brand identity, UI/UX design and development of the website for Luciana Cabañas Boutique, in Guateque, Boyacá. From the story of the place to a site where guests compare cabins, read real reviews and book without an intermediary.',
    facts: [
      { label: 'Client', value: 'Luciana Cabañas Boutique' },
      { label: 'Location', value: 'Guateque, Boyacá, Colombia' },
      { label: 'Services', chips: ['Brand identity', 'UI/UX design', 'Web development', 'SEO'] },
    ],
    brief: {
      label: 'How it started',
      title: 'We arrived as guests.',
      html:
        '<p>Wanting to get out of the city, we found these cabins on Airbnb and were taken by the architecture and the landscape. It turned out the owner wanted to redesign the image of the business and have more of a presence online.</p><p>The business already lived on Airbnb, where it had built its reputation. What it lacked was a brand of its own and a place of its own on the internet, where guests could find it, choose and book directly.</p>',
    },
    identity: {
      label: 'Identity',
      title: 'A logo drawn from the place.',
      html:
        '<p>We started by researching and getting to know the story behind the place, then sketched until the shapes came from it: the A-frame roof of the thatched chalet, the sun over the valley, the pines. A single-line drawing in the sand tone of the cabins’ wood, with the name set in capitals underneath.</p>',
    },
    site: {
      label: 'The website',
      title: 'Everything a guest asks before booking, answered on the page.',
      intro: 'The design follows the order of the questions someone has when choosing where to spend a weekend.',
      items: [
        { term: 'Six cabins, six pages', desc: 'San Sebastián, the Industrial Loft, El Estudio, La Casa Colonial, the Thatched Chalet and La Casita de Thomas, each with its own page and a gallery that filters them.' },
        { term: 'A comparison table', desc: 'Capacity, location, who it suits, jacuzzi, pets and starting price per night, side by side. On a phone it turns into one card per cabin.' },
        { term: 'Reviews you can check', desc: 'A carousel of guest reviews, each with the cabin it refers to and a link to the original on Airbnb.' },
        { term: 'Frequently asked questions', desc: 'How to get there from Bogotá, what’s included, pets, check-in and check-out times, seasonal prices and the cancellation policy.' },
        { term: 'Content about the region', desc: 'A blog and a guide to what to do in Guateque and the Valle de Tenza, written to be found by people planning the trip.' },
        { term: 'Two languages', desc: 'The site is also available in English.' },
      ],
    },
    booking: {
      label: 'Direct booking',
      title: 'From Airbnb to its own front door.',
      intro: 'The site’s job is to let a guest book without an intermediary, and to make that the better option for them too.',
      items: [
        { term: 'A reason to book direct', desc: 'Booking through the website carries a 10% discount, stated in the booking section, in the table and in the footer.' },
        { term: 'A request, not a checkout', desc: 'The form asks for the cabin, number of guests and dates, and the business replies with a personalised quote.' },
        { term: 'WhatsApp, always at hand', desc: 'A floating button and the number in the footer, because that is where the business answers fastest.' },
        { term: 'Clear expectations', desc: 'Response hours and the cancellation policy are written right where the guest makes the decision.' },
      ],
    },
    process: {
      label: 'What we did',
      title: 'From research to launch.',
      html:
        '<p>Researching the story behind the place, building a database, sketching, designing the logo, buying the hosting and domain, UI/UX design of the website, building it in HTML and CSS, setting up email, user testing, SEO and launch.</p>',
    },
    details: [
      { title: 'Services', html: '<p>Brand identity, UI/UX design, web development, SEO.</p>' },
      { title: 'Deliverables', html: '<p>Logo, website with six cabin pages, booking form, blog, email and domain.</p>' },
      { title: 'Place', html: '<p>Guateque and the Valle de Tenza, Boyacá, about three hours from Bogotá.</p>' },
    ],
    cta: {
      title: 'Running a place people travel to?',
      text: 'We design the brand and build the site that lets your guests find you and book with you directly.',
    },
  },
  es: {
    metaTitle: 'Caso de estudio Luciana Cabañas Boutique: logotipo y sitio web | Mattriz Studio',
    description:
      'Logotipo, diseño UI/UX y sitio web para Luciana Cabañas Boutique, seis cabañas en Guateque, Boyacá: páginas por cabaña, tabla comparativa, reseñas y reserva directa.',
    tagline: 'Seis cabañas en el Valle de Tenza, un logotipo nuevo y un sitio que recibe reservas directas.',
    intro:
      'Identidad de marca, diseño UI/UX y desarrollo del sitio web de Luciana Cabañas Boutique, en Guateque, Boyacá. De la historia del lugar a un sitio donde los huéspedes comparan cabañas, leen reseñas reales y reservan sin intermediarios.',
    facts: [
      { label: 'Cliente', value: 'Luciana Cabañas Boutique' },
      { label: 'Ubicación', value: 'Guateque, Boyacá, Colombia' },
      { label: 'Servicios', chips: ['Identidad de marca', 'Diseño UI/UX', 'Desarrollo web', 'SEO'] },
    ],
    brief: {
      label: 'Cómo empezó',
      title: 'Llegamos como huéspedes.',
      html:
        '<p>Las ganas de salir de la ciudad nos llevaron a estas cabañas, que encontramos en Airbnb. Quedamos fascinados con la arquitectura y la naturaleza del lugar. Resultó que el dueño quería rediseñar la imagen de su negocio y tener más presencia en internet.</p><p>El negocio ya vivía en Airbnb, donde había construido su reputación. Le faltaba una marca propia y un lugar propio en internet, donde los huéspedes lo encontraran, eligieran y reservaran directamente.</p>',
    },
    identity: {
      label: 'Identidad',
      title: 'Un logotipo que sale del lugar.',
      html:
        '<p>Empezamos por investigar y conocer la historia detrás del lugar, y bocetamos hasta que las formas salieron de ahí: el techo en A del chalet de paja, el sol sobre el valle, los pinos. Un dibujo de una sola línea en el tono arena de la madera de las cabañas, con el nombre en mayúsculas debajo.</p>',
    },
    site: {
      label: 'El sitio web',
      title: 'Todo lo que un huésped pregunta antes de reservar, respondido en la página.',
      intro: 'El diseño sigue el orden de las preguntas de alguien que está eligiendo dónde pasar un fin de semana.',
      items: [
        { term: 'Seis cabañas, seis páginas', desc: 'San Sebastián, el Loft Industrial, El Estudio, La Casa Colonial, el Chalet de Paja y La Casita de Thomas, cada una con su página y una galería que las filtra.' },
        { term: 'Una tabla comparativa', desc: 'Capacidad, ubicación, para quién es ideal, jacuzzi, mascotas y precio desde por noche, lado a lado. En el celular se convierte en una tarjeta por cabaña.' },
        { term: 'Reseñas que se pueden comprobar', desc: 'Un carrusel de reseñas de huéspedes, cada una con la cabaña a la que se refiere y el enlace a la original en Airbnb.' },
        { term: 'Preguntas frecuentes', desc: 'Cómo llegar desde Bogotá, qué incluye la estadía, mascotas, horarios de entrada y salida, precios por temporada y la política de cancelación.' },
        { term: 'Contenido sobre la región', desc: 'Un blog y una guía de qué hacer en Guateque y el Valle de Tenza, escritos para que los encuentre quien está planeando el viaje.' },
        { term: 'Dos idiomas', desc: 'El sitio también está en inglés.' },
      ],
    },
    booking: {
      label: 'Reserva directa',
      title: 'De Airbnb a su propia puerta.',
      intro: 'El trabajo del sitio es que un huésped pueda reservar sin intermediarios, y que para él también sea la mejor opción.',
      items: [
        { term: 'Una razón para reservar directo', desc: 'Reservar por la web tiene un 10% de descuento, y se dice en la sección de reserva, en la tabla y en el pie de página.' },
        { term: 'Una solicitud, no un pago', desc: 'El formulario pide la cabaña, el número de personas y las fechas, y el negocio responde con una cotización personalizada.' },
        { term: 'WhatsApp siempre a la mano', desc: 'Un botón flotante y el número en el pie de página, porque ahí es donde el negocio contesta más rápido.' },
        { term: 'Expectativas claras', desc: 'El horario de respuesta y la política de cancelación están escritos justo donde el huésped toma la decisión.' },
      ],
    },
    process: {
      label: 'Lo que hicimos',
      title: 'De la investigación al lanzamiento.',
      html:
        '<p>Investigar y conocer la historia detrás del lugar, generar la base de datos, bocetar, diseñar el logotipo, adquirir el hosting y el dominio, diseñar la experiencia y la interfaz del sitio, construirlo en HTML y CSS, configurar el correo, hacer pruebas con usuarios, optimizar el SEO y lanzar.</p>',
    },
    details: [
      { title: 'Servicios', html: '<p>Identidad de marca, diseño UI/UX, desarrollo web, SEO.</p>' },
      { title: 'Entregables', html: '<p>Logotipo, sitio web con seis páginas de cabañas, formulario de reserva, blog, correo y dominio.</p>' },
      { title: 'Lugar', html: '<p>Guateque y el Valle de Tenza, Boyacá, a unas tres horas de Bogotá.</p>' },
    ],
    cta: {
      title: '¿Tienes un lugar al que la gente viaja?',
      text: 'Diseñamos la marca y construimos el sitio para que tus huéspedes te encuentren y reserven contigo directamente.',
    },
  },
};

export function lucianaCabanas(lang: Lang): CaseDoc {
  const t = TEXT[lang];
  return {
    name: 'Luciana Cabañas',
    theme: 'dark',
    bg: '#2a1006',
    accent: '#bf9571',
    onAccent: '#2a1006',
    metaTitle: t.metaTitle,
    description: t.description,
    year: '',
    tagline: t.tagline,
    intro: t.intro,
    facts: t.facts,
    hero: NAV(lang),
    site: 'https://lucianacabanasboutique.com/',
    blocks: [
      { kind: 'text', style: 'lead', ...t.brief },
      { kind: 'media', layout: 'pair', items: [LOGO(lang), PHOTO(lang)] },
      { kind: 'text', style: 'lead', ...t.identity },
      { kind: 'cards', ...t.site },
      { kind: 'media', layout: 'pair', items: [SITE_CASITA(lang), SITE_STUDIO(lang)] },
      { kind: 'media', layout: 'wide', items: [SITE_REVIEWS(lang)] },
      { kind: 'list', ...t.booking },
      { kind: 'media', layout: 'pair', items: [SITE_TABLE(lang), SITE_BOOKING(lang)] },
      { kind: 'media', layout: 'trio', items: [M_HERO(lang), M_TABLE(lang), M_BOOKING(lang)] },
      { kind: 'text', style: 'lead', ...t.process },
      { kind: 'media', layout: 'pair', items: [MOSAIC(lang), SITE_FOOTER(lang)] },
      { kind: 'details', cols: t.details },
      { kind: 'cta', ...t.cta, link: { href: 'mailto:contacto@mattriz.com', label: 'contacto@mattriz.com' } },
    ],
  };
}
