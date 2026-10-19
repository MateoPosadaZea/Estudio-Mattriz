// v2: caso de estudio de Spot On (2026), escrito a mano.
//
// Inglés: el texto de /work/spot-on/case-study.html, igual salvo las rayas largas (—), que se
// cambiaron por coma, punto o dos puntos (regla de marca). Esa página no se toca.
// Español: traducción de ese texto (pendiente de revisión, ver reference/TRADUCCIONES.md).
// Colores tomados del sitio nuevo de Spot On: azul noche #091629 y amarillo #ffcc02.
// Imágenes: public/work/spot-on/img/*.png → public/media/projects/spot-on-case/*.webp.

import type { Lang } from '../../i18n';
import type { CaseDoc, CaseMedia } from '../../components/case/doc';

const DIR = '/media/projects/spot-on-case';
const img = (base: string, width: number, height: number, widths: number[], alt: Record<Lang, string>, caption: Record<Lang, string>) => (lang: Lang): CaseMedia => ({
  type: 'img',
  local: { dir: DIR, base, width, height, widths },
  alt: alt[lang],
  caption: caption[lang],
});

// Pantallas del sitio en el celular (octubre de 2026), para el bloque "una web que trae clientes".
const SCREEN = (base: string, alt: Record<Lang, string>, caption: Record<Lang, string>) => img(base, 780, 1400, [780, 500], alt, caption);
const CITY = SCREEN('spot-on-city', {
  en: 'Spot On city page for Danville, with its own booking button and real work',
  es: 'Página de ciudad de Spot On para Danville, con su propio botón de reserva y trabajos reales',
}, { en: 'A page for every city on the route.', es: 'Una página para cada ciudad de la ruta.' });
const BLOG = SCREEN('spot-on-blog', {
  en: 'Spot On blog with guides on detailing',
  es: 'Blog de Spot On con guías sobre detailing',
}, { en: 'Seven guides that answer what customers ask before booking.', es: 'Siete guías que responden lo que el cliente pregunta antes de reservar.' });
const GIFT = SCREEN('spot-on-gift', {
  en: 'Spot On eGift card, from $50 and delivered by email',
  es: 'Tarjeta de regalo de Spot On, desde US$50 y enviada por correo',
}, { en: 'Gift cards: delivered by email, no expiration, for any service.', es: 'Tarjetas de regalo: llegan por correo, no vencen y sirven para cualquier servicio.' });

const video = (base: string, alt: Record<Lang, string>, caption: Record<Lang, string>) => (lang: Lang): CaseMedia => ({
  type: 'video',
  local: { dir: DIR, base, width: 1920, height: 1200 },
  alt: alt[lang],
  caption: caption[lang],
});

// Videos del sitio nuevo (grabados el 19 de octubre de 2026 a 1920x1200, sin llenar datos ni pagar).
const HOME = video('spot-on-home-v2', {
  en: 'The new Spot On site: the hero with real work, the stats and the booking on the home page',
  es: 'El sitio nuevo de Spot On: la portada con trabajos reales, las cifras y la reserva en la misma página',
}, {
  en: 'The new site: real work in the hero, the booking right on the home page, recent jobs and reviews.',
  es: 'El sitio nuevo: trabajos reales en la portada, la reserva en la misma página, trabajos recientes y reseñas.',
});

const ROUTE = video('spot-on-route', {
  en: 'The route map on the Spot On site, drawn stop by stop as you scroll',
  es: 'El mapa de la ruta en el sitio de Spot On, que se dibuja parada por parada al bajar',
}, {
  en: 'The route as you scroll: Livermore, Pleasanton, Dublin, San Ramon, Danville, Blackhawk, Diablo, Alamo and Walnut Creek, each with a real job.',
  es: 'La ruta al bajar: Livermore, Pleasanton, Dublin, San Ramon, Danville, Blackhawk, Diablo, Alamo y Walnut Creek, cada una con un trabajo real.',
});

const PLANS = video('spot-on-plans', {
  en: 'Spot On membership plans, with prices that change by vehicle type',
  es: 'Los planes de membresía de Spot On, con precios que cambian según el vehículo',
}, {
  en: 'Choosing the vehicle changes the price of every plan, live.',
  es: 'Al elegir el vehículo, el precio de cada plan cambia en vivo.',
});

const CORPORATE_FLOW = video('spot-on-corporate-v2', {
  en: 'The new Spot On corporate program page in motion',
  es: 'La página nueva del programa corporativo de Spot On en movimiento',
}, {
  en: 'The new corporate page: why companies keep it running, the four steps, what the company provides and the program’s numbers.',
  es: 'La página corporativa nueva: por qué las empresas lo mantienen, los cuatro pasos, lo que pone la empresa y las cifras del programa.',
});

const TEXT = {
  en: {
    metaTitle: 'Spot On Mobile Detailing Case Study | Mattriz Studio',
    description:
      'How a mobile detailer went from taking bookings by DM to a system that books, charges and follows up on its own, including a corporate fleet contract running on autopilot.',
    tagline: 'One mobile detailer, one system that runs itself.',
    intro:
      'How Spot On Mobile Detailing went from taking bookings by DM to a system that books, charges and follows up on its own, including a recurring corporate fleet contract that runs without manual coordination.',
    facts: [
      { label: 'Client', value: 'Spot On Mobile Detailing' },
      { label: 'Location', value: 'California, USA' },
      { label: 'Live since', value: 'March 2026' },
    ],
    problem: {
      label: 'The problem',
      title: 'Running a detailing business out of a phone.',
      html: '<p>Spot On had the demand. What it didn’t have was a system. Every booking, every quote, every payment lived in text threads and DMs, which meant the business only moved as fast as its owner could reply.</p>',
      bullets: [
        'Bookings taken through Instagram DMs and texts, with no formal confirmation or close',
        'Response times stretching up to two days, with leads going cold while waiting',
        'Quotes sent with no tracking: no way to know who opened, who booked, who walked',
        'No way to take a deposit or payment before the job',
        'No way to collect tips or structured feedback',
        'Every corporate session coordinated by hand, slot by slot',
      ],
    },
    built: {
      label: 'What we built',
      title: 'A booking and payment engine, end to end.',
      intro: 'A system where a customer books, pays and schedules on their own. No back-and-forth, no manual step. The owner stopped being the bottleneck.',
      items: [
        { term: 'Self-service booking', desc: 'Customers pick a service, vehicle size, add-ons, date and time, and pay by card, all in one guided flow. The price is calculated live, and the appointment is scheduled automatically.' },
        { term: 'Payments that just work', desc: 'Cards are charged the moment a booking is confirmed. If a charge goes through but the slot can’t be scheduled, the system refunds automatically, so no customer ever pays without an appointment.' },
        { term: 'Recurring memberships', desc: 'Customers can subscribe to a monthly plan instead of booking one-off, turning one-time jobs into predictable recurring revenue.' },
        { term: 'Tips & reviews, automated', desc: 'After each service, the system asks for a tip and a review through its own link, capturing revenue and reputation that were slipping through before.' },
        { term: 'Automatic follow-ups', desc: 'Confirmations, reminders and review requests all send themselves on schedule. Nobody has to remember to chase anyone.' },
        { term: 'Owner dashboard', desc: 'A private, secure panel to see every booking, manage cancellations, charge extras, run promos and pull reports: the whole operation in one place.' },
      ],
    },
    scrolly: {
      label: 'The booking',
      title: 'Six steps. The price changes with every choice.',
      steps: [
        { term: 'Service', desc: 'Every service shows its price from the first tap.' },
        { term: 'Vehicle', desc: 'The vehicle size adjusts the price.' },
        { term: 'Add-ons', desc: 'Every add-on adds up live.' },
        { term: 'Date & time', desc: 'Only open slots show up.' },
        { term: 'Details', desc: 'Address and contact, in a single step.' },
        { term: 'Payment', desc: '25% is charged at booking. The rest, on the day of the service.' },
      ],
      endAlt: 'Booking summary with the service, add-ons and total, paid securely through Square',
    },
    route: {
      label: 'The route',
      title: 'Nine stops, one route. And a page for every city.',
      html: '<p>Spot On doesn’t serve “the Bay Area”: it drives a route. From Livermore to Walnut Creek, along the 580 and the 680, with Dublin as home base. The new site draws that route as you scroll, stop by stop, each one with its coordinates, a real job done there and a link to its own page.</p><p>Each of the eight cities has a page of its own, with its services, prices, recent work and local questions. So Spot On shows up when someone searches for detailing in Danville or Pleasanton, not only when they search for its name.</p>',
    },
    plans: {
      label: 'Memberships',
      title: 'Three plans, one price a month.',
      html: '<p>Memberships went from a feature to a product with its own place on the site. Three plans (Signature, Refresh and Elite Double), from $95 a month, and the price adjusts to the vehicle as you choose it. Sign-up and card in a single step, billed automatically on the 1st of every month, cancel anytime.</p>',
    },
    growth: {
      label: 'A site that brings clients',
      title: 'The site stopped being a brochure. It sells.',
      intro: 'Around the booking, the new site does the work a salesperson would: it answers, it shows proof and it gives people more than one way to buy.',
      items: [
        { term: 'A page for every city', desc: 'Eight city pages along the route, each with its services, prices, recent work and the questions people ask there.' },
        { term: 'A blog that answers', desc: 'Seven guides on what customers ask before booking: whether ceramic coating is worth it, how often to detail, how to prepare the car, detailing before selling or returning a lease.' },
        { term: 'Real work, real reviews', desc: 'Recent jobs with the car, the city and the service, and Google reviews, on the home page and on every city page.' },
        { term: 'Gift cards', desc: 'eGift cards from $50, delivered by email right away, with no expiration and redeemable for any service.' },
      ],
    },
    corporate: {
      label: 'The differentiator',
      title: 'A recurring corporate fleet contract, running on autopilot.',
      intro: 'The biggest win wasn’t the website. It was landing a recurring contract with a law firm in Palo Alto and building the entire program to run itself. Scheduled sessions, fixed program pricing, and a waitlist that manages its own slots.',
      items: [
        { term: 'Scheduled sessions with limited slots', desc: 'Each session runs on a fixed capacity (10 confirmed spots plus 3 on standby), booked against a specific date at a set program rate.' },
        { term: 'A waitlist that promotes itself', desc: 'When a spot frees up, the system sends a payment link and promotes the next person to a confirmed slot on its own. Unpaid holds expire automatically. No manual slot-shuffling.' },
        { term: 'Session & access reminders', desc: 'Coordinators get automatic reminders for sessions and key/access handoffs, coordination that used to happen by hand.' },
        { term: 'Executive reporting', desc: 'The corporate client gets clean, branded reports in Spot On’s own voice, professional enough for an institutional account.' },
      ],
    },
    results: {
      label: 'Results',
      title: 'Built fast. Running in production.',
      intro: 'The system went live in March 2026 and has been in production since, adding capabilities every few weeks without breaking what was already running.',
      stats: [
        { value: '153', label: 'Bookings through the system in five months' },
        { value: '$23,770', label: 'Booked and charged through the system' },
        { value: '93%', label: 'Slot occupancy in the corporate program, 9.3 vehicles per session' },
        { value: '2.7×', label: 'Online bookings per month, from 7 in June to 19 in September' },
        { value: '65', label: 'Vehicles serviced in 7 corporate sessions, every two weeks since May' },
        { value: '118', label: 'Post-service follow-ups sent on their own, with a link to leave a Google review' },
      ],
      after: '<p>Bookings, revenue and follow-ups: data as of October 7, 2026, straight from the system’s database, counting bookings made through the site and the owner’s panel, excluding tests and internal ones. Sales Spot On closes outside the system are not included. Corporate program: the figures published on its page in October 2026.</p>',
      quote:
        'The turning point was mid-May. Before then, the digital side was essentially a quote-capture form. After it, a customer could book, pay and schedule with zero human involvement, with automatic charging and refunds built in. That single shift is what took the owner out of the critical path.',
    },
    timeline: {
      label: 'How it came together',
      title: 'From zero to a full operating system, shipping every few weeks.',
      items: [
        { date: 'Mar 2026', title: 'System goes live.', text: 'Site unified on a single payment and scheduling backbone.' },
        { date: 'Apr 2026', title: 'Memberships & automated follow-ups.', text: 'Recurring plans and self-sending review requests.' },
        { date: 'Apr 2026', title: 'Corporate fleet program launches.', text: 'Sessions, slots and waitlist for the institutional contract.' },
        { date: 'May 2026', title: 'Full self-service booking + payment.', text: 'The turning point: customers close on their own.' },
        { date: 'Jun 2026', title: 'Session & access reminders.', text: 'Manual coordination becomes automatic.' },
        { date: 'Jul 2026', title: 'Self-promoting waitlist.', text: 'Slots that used to move by hand now manage themselves.' },
        { date: 'Jul 2026', title: 'Online deposit.', text: '25% is charged at booking; the rest on the day of the service.' },
        { date: 'Sep 2026', title: 'One domain, eight city pages.', text: 'Three versions of the domain consolidated into one, plus a page for each city served.' },
        { date: 'Oct 2026', title: 'A new site.', text: 'The route map, memberships with live prices, gift cards, a blog and a redesigned corporate page.' },
      ],
    },
    cta: {
      title: 'Run a service business that runs on you?',
      text: 'If your bookings, payments and follow-ups still live in your phone, there’s a system waiting to take that off your plate. That’s what Mattriz builds.',
    },
  },
  es: {
    metaTitle: 'Caso de estudio Spot On Mobile Detailing | Mattriz Studio',
    description:
      'Cómo un negocio de detailing a domicilio pasó de agendar por mensajes directos a un sistema que reserva, cobra y hace seguimiento solo, incluido un contrato corporativo que funciona en piloto automático.',
    tagline: 'Un detailer a domicilio, un sistema que funciona solo.',
    intro:
      'Cómo Spot On Mobile Detailing pasó de agendar por mensajes directos a un sistema que reserva, cobra y hace seguimiento por su cuenta, incluido un contrato recurrente con una flota corporativa que funciona sin coordinación manual.',
    facts: [
      { label: 'Cliente', value: 'Spot On Mobile Detailing' },
      { label: 'Ubicación', value: 'California, EE. UU.' },
      { label: 'En línea desde', value: 'Marzo de 2026' },
    ],
    problem: {
      label: 'El problema',
      title: 'Un negocio de detailing manejado desde un celular.',
      html: '<p>Spot On tenía la demanda. Lo que no tenía era un sistema. Cada reserva, cada cotización y cada pago vivían en chats y mensajes directos, así que el negocio solo avanzaba tan rápido como su dueño alcanzara a responder.</p>',
      bullets: [
        'Reservas por mensajes directos de Instagram y por texto, sin confirmación ni cierre formal',
        'Respuestas que tardaban hasta dos días, con clientes potenciales que se enfriaban esperando',
        'Cotizaciones sin seguimiento: imposible saber quién las abrió, quién reservó y quién se fue',
        'Sin forma de cobrar un anticipo o el pago antes del servicio',
        'Sin forma de recibir propinas ni opiniones estructuradas',
        'Cada sesión corporativa coordinada a mano, cupo por cupo',
      ],
    },
    built: {
      label: 'Lo que construimos',
      title: 'Un motor de reservas y pagos, de principio a fin.',
      intro: 'Un sistema en el que el cliente reserva, paga y agenda por su cuenta. Sin idas y vueltas, sin pasos manuales. El dueño dejó de ser el cuello de botella.',
      items: [
        { term: 'Reserva autoservicio', desc: 'El cliente elige el servicio, el tamaño del vehículo, los adicionales, la fecha y la hora, y paga con tarjeta, todo en un solo flujo guiado. El precio se calcula en vivo y la cita se agenda automáticamente.' },
        { term: 'Pagos que simplemente funcionan', desc: 'La tarjeta se cobra en el momento en que se confirma la reserva. Si el cobro pasa pero el horario no se puede agendar, el sistema reembolsa automáticamente, así que ningún cliente paga sin tener cita.' },
        { term: 'Membresías recurrentes', desc: 'El cliente puede suscribirse a un plan mensual en vez de reservar una sola vez, y los trabajos puntuales se convierten en ingresos recurrentes y predecibles.' },
        { term: 'Propinas y reseñas, automáticas', desc: 'Después de cada servicio, el sistema pide una propina y una reseña con su propio enlace, y así captura ingresos y reputación que antes se perdían.' },
        { term: 'Seguimiento automático', desc: 'Las confirmaciones, los recordatorios y las solicitudes de reseña se envían solos a tiempo. Nadie tiene que acordarse de perseguir a nadie.' },
        { term: 'Panel del dueño', desc: 'Un panel privado y seguro para ver cada reserva, gestionar cancelaciones, cobrar adicionales, lanzar promociones y sacar reportes: toda la operación en un solo lugar.' },
      ],
    },
    scrolly: {
      label: 'La reserva',
      title: 'Seis pasos. El precio cambia con cada elección.',
      steps: [
        { term: 'Servicio', desc: 'Cada servicio con su precio desde el primer toque.' },
        { term: 'Vehículo', desc: 'El tamaño del vehículo ajusta el precio.' },
        { term: 'Extras', desc: 'Cada extra suma en vivo.' },
        { term: 'Fecha y hora', desc: 'Solo aparecen los cupos libres.' },
        { term: 'Datos', desc: 'Dirección y contacto, en un solo paso.' },
        { term: 'Pago', desc: 'Queda pagada al 25 % al reservar. El resto, el día del servicio.' },
      ],
      endAlt: 'Resumen de la reserva con el servicio, los extras y el total, con pago seguro por Square',
    },
    route: {
      label: 'La ruta',
      title: 'Nueve paradas, una ruta. Y una página para cada ciudad.',
      html: '<p>Spot On no atiende “el Área de la Bahía”: recorre una ruta. De Livermore a Walnut Creek, por la 580 y la 680, con Dublin como base. El sitio nuevo dibuja esa ruta mientras bajas, parada por parada, cada una con sus coordenadas, un trabajo real hecho ahí y un enlace a su propia página.</p><p>Cada una de las ocho ciudades tiene su página, con sus servicios, precios, trabajos recientes y las preguntas de la zona. Así Spot On aparece cuando alguien busca detailing en Danville o en Pleasanton, no solo cuando busca su nombre.</p>',
    },
    plans: {
      label: 'Membresías',
      title: 'Tres planes, un precio al mes.',
      html: '<p>Las membresías pasaron de ser una función a ser un producto con su propio lugar en el sitio. Tres planes (Signature, Refresh y Elite Double), desde US$95 al mes, y el precio se ajusta al vehículo mientras lo eliges. Inscripción y tarjeta en un solo paso, cobro automático el 1.º de cada mes y se cancela cuando quieras.</p>',
    },
    growth: {
      label: 'Una web que trae clientes',
      title: 'El sitio dejó de ser un folleto. Vende.',
      intro: 'Alrededor de la reserva, el sitio nuevo hace el trabajo de un vendedor: responde, muestra pruebas y da más de una forma de comprar.',
      items: [
        { term: 'Una página por ciudad', desc: 'Ocho páginas de ciudad a lo largo de la ruta, cada una con sus servicios, precios, trabajos recientes y las preguntas que se hacen ahí.' },
        { term: 'Un blog que responde', desc: 'Siete guías sobre lo que el cliente pregunta antes de reservar: si vale la pena el recubrimiento cerámico, cada cuánto hacer detailing, cómo preparar el carro, el detailing antes de vender o devolver un leasing.' },
        { term: 'Trabajos y reseñas reales', desc: 'Trabajos recientes con el carro, la ciudad y el servicio, y reseñas de Google, en la portada y en cada página de ciudad.' },
        { term: 'Tarjetas de regalo', desc: 'Tarjetas de regalo desde US$50, que llegan por correo al instante, no vencen y sirven para cualquier servicio.' },
      ],
    },
    corporate: {
      label: 'El diferencial',
      title: 'Un contrato corporativo recurrente, en piloto automático.',
      intro: 'El mayor logro no fue el sitio web. Fue cerrar un contrato recurrente con una firma de abogados en Palo Alto y construir todo el programa para que funcionara solo. Sesiones programadas, precio fijo del programa y una lista de espera que maneja sus propios cupos.',
      items: [
        { term: 'Sesiones programadas con cupos limitados', desc: 'Cada sesión tiene una capacidad fija (10 cupos confirmados y 3 en espera) y se reserva para una fecha específica con una tarifa fija del programa.' },
        { term: 'Una lista de espera que se mueve sola', desc: 'Cuando se libera un cupo, el sistema envía un enlace de pago y pasa a la siguiente persona a un cupo confirmado por su cuenta. Las reservas sin pagar vencen solas. Nada de mover cupos a mano.' },
        { term: 'Recordatorios de sesión y de acceso', desc: 'Los coordinadores reciben recordatorios automáticos de las sesiones y de la entrega de llaves y accesos, una coordinación que antes se hacía a mano.' },
        { term: 'Reportes ejecutivos', desc: 'El cliente corporativo recibe reportes claros, con la marca y la voz de Spot On, a la altura de una cuenta institucional.' },
      ],
    },
    results: {
      label: 'Resultados',
      title: 'Construido rápido. Funcionando en producción.',
      intro: 'El sistema salió en marzo de 2026 y está en producción desde entonces, sumando funciones cada pocas semanas sin romper lo que ya funcionaba.',
      stats: [
        { value: '153', label: 'Reservas por el sistema en cinco meses' },
        { value: 'US$23.770', label: 'Reservados y cobrados por el sistema' },
        { value: '93 %', label: 'Ocupación de cupos del programa corporativo: 9,3 vehículos por sesión' },
        { value: '2,7×', label: 'Reservas en línea al mes, de 7 en junio a 19 en septiembre' },
        { value: '65', label: 'Vehículos atendidos en 7 sesiones corporativas, cada dos semanas desde mayo' },
        { value: '118', label: 'Seguimientos después del servicio enviados solos, con enlace para dejar reseña en Google' },
      ],
      after: '<p>Reservas, ingresos y seguimientos: datos al 7 de octubre de 2026, tomados directo de la base del sistema, con las reservas hechas por el sitio y por el panel del dueño, sin pruebas ni internas. No incluye las ventas que Spot On cierra por fuera del sistema. Programa corporativo: las cifras publicadas en su página en octubre de 2026.</p>',
      quote:
        'El punto de quiebre fue a mediados de mayo. Hasta entonces, lo digital era básicamente un formulario para pedir cotizaciones. Desde ahí, un cliente podía reservar, pagar y agendar sin intervención humana, con cobros y reembolsos automáticos. Ese cambio fue lo que sacó al dueño del camino crítico.',
    },
    timeline: {
      label: 'Cómo se armó',
      title: 'De cero a un sistema operativo completo, con entregas cada pocas semanas.',
      items: [
        { date: 'Mar 2026', title: 'El sistema sale en vivo.', text: 'El sitio se unifica sobre una sola base de pagos y agenda.' },
        { date: 'Abr 2026', title: 'Membresías y seguimiento automático.', text: 'Planes recurrentes y solicitudes de reseña que se envían solas.' },
        { date: 'Abr 2026', title: 'Arranca el programa corporativo.', text: 'Sesiones, cupos y lista de espera para el contrato institucional.' },
        { date: 'May 2026', title: 'Reserva y pago 100 % autoservicio.', text: 'El punto de quiebre: los clientes cierran solos.' },
        { date: 'Jun 2026', title: 'Recordatorios de sesión y de acceso.', text: 'La coordinación manual se vuelve automática.' },
        { date: 'Jul 2026', title: 'Lista de espera que se mueve sola.', text: 'Los cupos que antes se movían a mano ahora se manejan solos.' },
        { date: 'Jul 2026', title: 'Depósito en línea.', text: 'Se cobra el 25 % al reservar; el resto, el día del servicio.' },
        { date: 'Sep 2026', title: 'Un solo dominio, ocho páginas de ciudad.', text: 'Tres versiones del dominio se consolidan en una, con una página por cada ciudad que atiende.' },
        { date: 'Oct 2026', title: 'Un sitio nuevo.', text: 'El mapa de la ruta, membresías con precios en vivo, tarjetas de regalo, un blog y la página corporativa rehecha.' },
      ],
    },
    cta: {
      title: '¿Tu negocio de servicios depende de ti para todo?',
      text: 'Si tus reservas, pagos y seguimientos todavía viven en tu celular, hay un sistema esperando para quitarte eso de encima. Eso es lo que construye Mattriz.',
    },
  },
};

export function spotOn(lang: Lang): CaseDoc {
  const t = TEXT[lang];
  return {
    name: 'Spot On',
    theme: 'dark',
    bg: '#091629',
    accent: '#ffcc02',
    onAccent: '#091629',
    metaTitle: t.metaTitle,
    ogImage: '/work/spot-on/img/spot-on-hero.png',
    description: t.description,
    year: '2026',
    tagline: t.tagline,
    intro: t.intro,
    facts: t.facts,
    hero: HOME(lang),
    site: 'https://www.mobilespotoncalifornia.com/',
    blocks: [
      { kind: 'text', style: 'lead', ...t.problem },
      { kind: 'cards', ...t.built },
      {
        kind: 'scrolly', label: t.scrolly.label, title: t.scrolly.title, steps: t.scrolly.steps,
        // La reserva real grabada en el celular (sin llenar datos ni pagar): 176 cuadros a 8 por segundo.
        frames: { dir: `${DIR}/scrolly`, count: 176, width: 540, height: 1168 },
        starts: [0, 16, 33, 88, 150, 175],
        end: { src: `${DIR}/scrolly/pago.webp`, alt: t.scrolly.endAlt },
      },
      // La ruta, al centro del caso: el mapa del sitio nuevo y una página por ciudad.
      { kind: 'text', style: 'lead', ...t.route },
      { kind: 'media', layout: 'wide', items: [ROUTE(lang)] },
      { kind: 'text', style: 'lead', ...t.plans },
      { kind: 'media', layout: 'wide', items: [PLANS(lang)] },
      { kind: 'cards', ...t.growth },
      { kind: 'media', layout: 'trio', items: [CITY(lang), BLOG(lang), GIFT(lang)] },
      { kind: 'list', ...t.corporate },
      { kind: 'media', layout: 'wide', items: [CORPORATE_FLOW(lang)] },
      { kind: 'stats', ...t.results },
      { kind: 'timeline', ...t.timeline },
      { kind: 'cta', ...t.cta, link: { href: 'mailto:contacto@mattriz.com', label: 'contacto@mattriz.com' } },
    ],
  };
}
