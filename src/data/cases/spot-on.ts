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

const HERO = img('spot-on-hero', 1600, 787, [1600, 1200, 700], {
  en: 'Spot On Mobile Detailing website, premium mobile detailing in the San Francisco Bay Area',
  es: 'Sitio web de Spot On Mobile Detailing, detailing premium a domicilio en el Área de la Bahía de San Francisco',
}, {
  en: 'The Spot On site: 350+ vehicles detailed, 4.9★ rating, 95% repeat clients.',
  es: 'El sitio de Spot On: más de 350 vehículos atendidos, calificación de 4.9★ y 95 % de clientes que vuelven.',
});

const BOOKING = img('spot-on-booking', 1600, 782, [1600, 1200, 700], {
  en: 'Spot On booking flow: customers pick a service and see live pricing',
  es: 'Flujo de reserva de Spot On: el cliente elige un servicio y ve el precio en vivo',
}, {
  en: 'Step-by-step booking: service, vehicle, add-ons, date and payment, with the price calculated live.',
  es: 'Reserva paso a paso: servicio, vehículo, adicionales, fecha y pago, con el precio calculado en vivo.',
});

const CALENDAR = img('spot-on-calendar', 1600, 1053, [1600, 1200, 700], {
  en: 'Spot On availability calendar with real-time slots',
  es: 'Calendario de disponibilidad de Spot On con horarios en tiempo real',
}, {
  en: 'Customers pick from real available slots. No back-and-forth, no phone tag.',
  es: 'El cliente elige entre horarios realmente disponibles. Sin idas y vueltas, sin llamadas perdidas.',
});

const CORPORATE = img('spot-on-corporate', 1396, 1232, [1396, 1200, 700], {
  en: 'Spot On corporate program landing page for on-site office detailing',
  es: 'Página del programa corporativo de Spot On para detailing en la oficina',
}, {
  en: 'A dedicated landing for the corporate program: employees book on-site office detailing in a fixed biweekly window.',
  es: 'Una página dedicada al programa corporativo: los empleados reservan el detailing en la oficina en una franja fija cada dos semanas.',
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
        { term: 'Recurring memberships', desc: 'Customers can subscribe to a maintenance plan instead of booking one-off, turning one-time jobs into predictable recurring revenue.' },
        { term: 'Tips & reviews, automated', desc: 'After each service, the system asks for a tip and a review through its own link, capturing revenue and reputation that were slipping through before.' },
        { term: 'Automatic follow-ups', desc: 'Confirmations, reminders and review requests all send themselves on schedule. Nobody has to remember to chase anyone.' },
        { term: 'Owner dashboard', desc: 'A private, secure panel to see every booking, manage cancellations, charge extras, run promos and pull reports: the whole operation in one place.' },
      ],
    },
    corporate: {
      label: 'The differentiator',
      title: 'A recurring corporate fleet contract, running on autopilot.',
      intro: 'The biggest win wasn’t the website. It was landing a recurring contract with a corporate legal firm and building the entire program to run itself. Scheduled sessions, fixed program pricing, and a waitlist that manages its own slots.',
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
        { value: '350+', label: 'Vehicles detailed' },
        { value: '4.9★', label: 'Customer rating' },
        { value: '95%', label: 'Repeat clients' },
      ],
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
        { term: 'Membresías recurrentes', desc: 'El cliente puede suscribirse a un plan de mantenimiento en vez de reservar una sola vez, y los trabajos puntuales se convierten en ingresos recurrentes y predecibles.' },
        { term: 'Propinas y reseñas, automáticas', desc: 'Después de cada servicio, el sistema pide una propina y una reseña con su propio enlace, y así captura ingresos y reputación que antes se perdían.' },
        { term: 'Seguimiento automático', desc: 'Las confirmaciones, los recordatorios y las solicitudes de reseña se envían solos a tiempo. Nadie tiene que acordarse de perseguir a nadie.' },
        { term: 'Panel del dueño', desc: 'Un panel privado y seguro para ver cada reserva, gestionar cancelaciones, cobrar adicionales, lanzar promociones y sacar reportes: toda la operación en un solo lugar.' },
      ],
    },
    corporate: {
      label: 'El diferencial',
      title: 'Un contrato corporativo recurrente, en piloto automático.',
      intro: 'El mayor logro no fue el sitio web. Fue cerrar un contrato recurrente con una firma de abogados corporativa y construir todo el programa para que funcionara solo. Sesiones programadas, precio fijo del programa y una lista de espera que maneja sus propios cupos.',
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
        { value: '350+', label: 'Vehículos atendidos' },
        { value: '4.9★', label: 'Calificación de clientes' },
        { value: '95 %', label: 'Clientes que vuelven' },
      ],
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
    hero: HERO(lang),
    site: 'https://www.mobilespotoncalifornia.com/',
    blocks: [
      { kind: 'text', style: 'lead', ...t.problem },
      { kind: 'cards', ...t.built },
      { kind: 'media', layout: 'pair', items: [BOOKING(lang), CALENDAR(lang)] },
      { kind: 'list', ...t.corporate },
      { kind: 'media', layout: 'inset', items: [CORPORATE(lang)] },
      { kind: 'stats', ...t.results },
      { kind: 'timeline', ...t.timeline },
      { kind: 'cta', ...t.cta, link: { href: 'mailto:contacto@mattriz.com', label: 'contacto@mattriz.com' } },
    ],
  };
}
