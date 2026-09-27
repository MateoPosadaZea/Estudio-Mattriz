// v2: caso de estudio del Dr. Daniel De Zubiría (2026), escrito a mano.
//
// Español: resumen del documento del estudio (26 de septiembre de 2026). Sin métricas de tráfico ni
// de citas: el sitio lleva menos de tres meses y no hay datos medidos; no se afirma nada que no esté
// en el documento. Sin testimonio (pedido). Sin rayas largas (regla de marca).
// Inglés: traducción de ese texto (pendiente de revisión).
// Colores de la marca del doctor: navy #1B3A94, tinta #1B2C52, ámbar claro #E9A94E.
// Imágenes: piezas del paquete de identidad (identidad-dezubiria.zip) → public/media/projects/dezubiria/.
// Capturas y video de la navegación: drdanieldezubiria.com, 27 de septiembre de 2026 (sin agendar nada).

import type { Lang } from '../../i18n';
import type { CaseDoc, CaseMedia } from '../../components/case/doc';

const DIR = '/media/projects/dezubiria';
type L = Record<Lang, string>;
const pic = (base: string, width: number, height: number, widths: number[], alt: L, caption?: L) => (lang: Lang): CaseMedia => ({
  type: 'img',
  local: { dir: DIR, base, width, height, widths },
  alt: alt[lang],
  caption: caption?.[lang],
});

const HERO = pic('dz-og', 1200, 630, [1200, 700], {
  en: 'Dr. Daniel De Zubiría, allergy specialist in Bogotá: navy brand card with the typographic logo',
  es: 'Dr. Daniel De Zubiría, alergólogo en Bogotá: pieza de marca en navy con el logotipo tipográfico',
});
const CARD_FRONT = pic('dz-tarjeta-frente', 1134, 661, [1134, 700], {
  en: 'Business card, front: the logo on navy with the amber rule',
  es: 'Tarjeta de presentación, frente: el logotipo sobre navy con la línea ámbar',
});
const CARD_BACK = pic('dz-tarjeta-reverso', 1134, 661, [1134, 700], {
  en: 'Business card, back: contact details on paper white',
  es: 'Tarjeta de presentación, reverso: datos de contacto sobre papel',
}, {
  en: 'The business card. Every print file has its text converted to curves, so the printer never needs the fonts.',
  es: 'La tarjeta de presentación. Todos los archivos de impresión tienen el texto convertido a curvas, para que la imprenta no dependa de las fuentes.',
});
const LINKEDIN = pic('dz-linkedin', 1584, 396, [1584, 1200, 700], {
  en: 'LinkedIn banner with the horizontal logo',
  es: 'Banner de LinkedIn con el logotipo horizontal',
});
const WHATSAPP = pic('dz-whatsapp', 1200, 400, [1200, 700], {
  en: 'WhatsApp Business cover with address and phone',
  es: 'Portada de WhatsApp Business con dirección y teléfono',
});
const GOOGLE = pic('dz-google', 1080, 608, [1080, 700], {
  en: 'Google Business Profile cover',
  es: 'Portada del perfil de Google Business',
}, {
  en: 'The same system on WhatsApp Business and Google Business Profile.',
  es: 'El mismo sistema en WhatsApp Business y en el perfil de Google Business.',
});
const LETTERHEAD = pic('dz-membrete', 1200, 1552, [1200, 700], {
  en: 'Letterhead with the logo and the practice address',
  es: 'Membrete con el logotipo y la dirección del consultorio',
}, {
  en: 'One of three letterhead variants.',
  es: 'Una de las tres variantes de membrete.',
});

const site = (base: string, alt: L, caption?: L) => pic(`dz-site-${base}`, 1600, 1000, [1600, 1200, 700], alt, caption);
const phone = (base: string, alt: L) => pic(`dz-m-${base}`, 900, 1948, [900, 600], alt);

const NAV = (lang: Lang): CaseMedia => ({
  type: 'video',
  local: { dir: DIR, base: 'dz-nav', width: 1440, height: 900 },
  alt: { en: 'Browsing the site: particle field, light and dark mode, conditions and the asthma page', es: 'Recorrido por el sitio: campo de partículas, modo claro y oscuro, condiciones y la página de asma' }[lang],
  caption: { en: 'The real site: the hand-made particle field reacting to the cursor, light and dark mode, what we treat and a condition page.', es: 'El sitio real: el campo de partículas hecho a mano reaccionando al cursor, modo claro y oscuro, qué tratamos y una página de condición.' }[lang],
});
const SITE_HOME = site('home', { en: 'Home page in light mode', es: 'Portada en modo claro' });
const SITE_DARK = site('home-dark', { en: 'Home page in dark mode, on the brand navy', es: 'Portada en modo oscuro, sobre el navy de la marca' }, {
  en: 'Light and dark mode, with the same palette declared once as tokens.',
  es: 'Modo claro y oscuro, con la misma paleta declarada una sola vez como tokens.',
});
const SITE_CONDITIONS = site('tratamos', { en: 'What we treat: eight conditions', es: 'Qué tratamos: ocho condiciones' });
const SITE_ASTHMA = site('asma', { en: 'Asthma condition page with its own booking card', es: 'Página de asma con su propia tarjeta para agendar' }, {
  en: 'Each condition page has its own call to action: book online first, WhatsApp second.',
  es: 'Cada condición tiene su propio llamado: primero la agenda en línea, después WhatsApp.',
});
const SITE_DOCTOR = site('doctor', { en: 'The doctor’s profile and training', es: 'Perfil y formación del doctor' });
const M_HOME = phone('home', { en: 'Home page on a phone', es: 'Portada en el celular' });
const M_ASTHMA = phone('asma', { en: 'Asthma page on a phone', es: 'Página de asma en el celular' });
const M_HIVES = phone('urticaria', { en: 'Hives and angioedema page on a phone', es: 'Página de urticaria y angioedema en el celular' });

const TEXT = {
  en: {
    metaTitle: 'Dr. Daniel De Zubiría Case Study | Mattriz Studio',
    description:
      'Brand identity, an 11-page website, online scheduling and the full infrastructure for an allergy practice in Bogotá: domain, hosting, analytics, SEO and Google Business.',
    tagline: 'An allergy practice in Bogotá: a complete brand, 11 pages and everything behind them.',
    intro:
      'A full identity, an 11-page website and the whole infrastructure behind it (domain, hosting, analytics, SEO, Google Business) for a pediatric and adult allergy practice. Four fronts from one place, nothing subcontracted, built between July and September 2026.',
    facts: [
      { label: 'Client', value: 'Dr. Daniel De Zubiría' },
      { label: 'Specialty', value: 'Pediatric & adult allergy' },
      { label: 'Location', value: 'Bogotá, Colombia' },
    ],
    brief: {
      label: 'The brief',
      title: 'A new practice, ready from day one.',
      html:
        '<p>A doctor opening his practice needs more than a website: a brand that works on a business card and on WhatsApp, pages that explain conditions the way patients search for them, a clear path to an appointment, and the infrastructure to keep all of it running.</p><p>So the work covered four fronts from the same place: identity, website, scheduling and infrastructure. Nothing was subcontracted.</p>',
    },
    identity: {
      label: 'Identity',
      title: 'Three typefaces, three colours, one system.',
      html:
        '<p>A type system where each font has one job: Instrument Serif for the logo, Newsreader for headlines, Karla for body text. A three-colour palette (navy #1B3A94, ink #1B2C52, amber #C9822F) declared once as tokens, so the website and the printed pieces never drift apart.</p>',
      bullets: [
        'Logo in three lockups (horizontal, stacked, name only), each in navy and in white',
        '39 application files: WhatsApp and Google profiles, banners, share image, favicons, letterheads in three variants and a business card',
        'Vectors with text converted to curves, so the printer doesn’t depend on having the fonts',
        'An identity manual with usage rules and minimum sizes',
      ],
    },
    site: {
      label: 'The website',
      title: '11 pages, built by hand.',
      intro: 'All the medical content is Daniel’s own words. Not a line was rewritten: in healthcare, the copy isn’t the designer’s.',
      items: [
        { term: 'Home', desc: 'Hero, what we treat (8 conditions), services and procedures (7), immunotherapy and recommendations, the doctor’s profile and a closing call to action.' },
        { term: '8 condition pages', desc: 'Each with symptoms, treatment, cross-links to related conditions and its own call to action.' },
        { term: 'Blog', desc: 'With its first article, on the skin prick test.' },
        { term: 'A particle field in canvas', desc: 'Hand-made, not from a library: organic drift from phase-shifted sines, depth layers, cursor repulsion. It pauses off-screen and switches off if the system asks for less motion.' },
        { term: 'Light and dark mode', desc: 'Remembered between visits, including when going back in the browser history. Plus a defence against iOS forced dark mode, which broke text contrast.' },
        { term: 'Smooth scrolling', desc: 'With Lenis, on desktop only.' },
      ],
    },
    scheduling: {
      label: 'Scheduling',
      title: 'A deliberate hierarchy, from visit to appointment.',
      items: [
        { term: 'Book online first, WhatsApp second', desc: 'The primary button goes to the SaludTools online calendar; a secondary text link goes to WhatsApp.' },
        { term: 'Two exceptions where talking is right', desc: 'The header and the “Not sure which is your case?” card lead only to WhatsApp.' },
        { term: 'A message that changes with the page', desc: 'The WhatsApp message comes pre-written and depends on where the patient is: someone reading about allergic rhinitis writes differently from someone reading about hives.' },
        { term: 'Every booking link is tagged', desc: 'Links to SaludTools carry UTM parameters, so each booking can be attributed to its page.' },
      ],
    },
    infra: {
      label: 'Infrastructure & SEO',
      title: 'Two migrations, not one broken URL.',
      intro: 'The site first lived on Netlify and then moved to Cloudflare Pages; the domain moved from alergologodezubiria.com to drdanieldezubiria.com while it cost nothing: no printed cards and no rankings to lose.',
      items: [
        { term: 'Domain', desc: 'drdanieldezubiria.com on Cloudflare; the previous alergologodezubiria.com redirects with a 301 and keeps the path.' },
        { term: 'Hosting', desc: 'Cloudflare Pages with an automatic deploy on every push.' },
        { term: 'Structured data', desc: 'Physician, MedicalCondition and MedicalSignOrSymptom, plus sitemap, dynamic robots.txt and Open Graph.' },
        { term: 'Google Search Console', desc: 'Domain property verified and sitemap submitted.' },
        { term: 'Analytics without cookies', desc: 'Cloudflare Web Analytics: no cookies and no consent banner.' },
        { term: 'Google Business Profile', desc: 'Created, verified and branded.' },
      ],
    },
    next: {
      label: 'First weeks on Google',
      title: 'A site that has just been born, already found.',
      intro: 'Google Search Console, August 18 to September 24, 2026. The practice had just opened and nothing was paid for: these are early numbers, not a trend.',
      stats: [
        { value: '801', label: 'Times it showed up on Google' },
        { value: '48', label: 'Visits from search, no ads' },
        { value: '3.1', label: 'Average position for “alergólogo bogotá”' },
      ],
      after:
        '<p>89% of those appearances were in Colombia and 69% on a phone. The average position improved from 11.5 in the first half of the period to 7.8 in the second. What comes next is ongoing work: monthly maintenance and a chatbot for patients.</p><p>It was a graduation gift. The scope wasn’t cut because of that.</p>',
    },
    details: [
      { title: 'Stack', html: '<p>Astro 5, hand-written CSS with design tokens, vanilla JavaScript. No styling frameworks.</p>' },
      { title: 'Type', html: '<p>Instrument Serif (logo), Newsreader (headlines), Karla (body).</p>' },
      { title: 'Timeline', html: '<p>From the first scoping conversation on July 20, 2026 to a complete brand and site in a little over two months.</p>' },
    ],
    cta: {
      title: 'Opening a practice, a studio, a business?',
      text: 'We build the brand, the site and everything behind them, and keep it running every month. That’s what Mattriz does.',
    },
  },
  es: {
    metaTitle: 'Caso de estudio Dr. Daniel De Zubiría | Mattriz Studio',
    description:
      'Identidad de marca, sitio web de 11 páginas, agendamiento en línea y toda la infraestructura de un consultorio de alergología en Bogotá: dominio, hosting, analítica, SEO y Google Business.',
    tagline: 'Un consultorio de alergología en Bogotá: marca completa, 11 páginas y todo lo que hay detrás.',
    intro:
      'Identidad completa, un sitio de 11 páginas y toda la infraestructura detrás (dominio, hosting, analítica, SEO, Google Business) para un consultorio de alergología pediátrica y de adultos. Cuatro frentes desde el mismo lugar, nada subcontratado, entre julio y septiembre de 2026.',
    facts: [
      { label: 'Cliente', value: 'Dr. Daniel De Zubiría' },
      { label: 'Especialidad', value: 'Alergología pediátrica y de adultos' },
      { label: 'Ubicación', value: 'Bogotá, Colombia' },
    ],
    brief: {
      label: 'El encargo',
      title: 'Un consultorio nuevo, listo desde el primer día.',
      html:
        '<p>Un médico que abre su consultorio necesita más que una página: una marca que funcione en una tarjeta y en WhatsApp, páginas que expliquen las condiciones como los pacientes las buscan, un camino claro hacia la cita y la infraestructura para que todo siga funcionando.</p><p>Por eso el trabajo cubrió cuatro frentes, todos desde el mismo lugar: identidad, sitio, agendamiento e infraestructura. Nada se subcontrató.</p>',
    },
    identity: {
      label: 'Identidad',
      title: 'Tres fuentes, tres colores, un sistema.',
      html:
        '<p>Un sistema tipográfico de tres fuentes, cada una con un trabajo: Instrument Serif para el logotipo, Newsreader para titulares, Karla para el cuerpo. Una paleta de tres colores (navy #1B3A94, tinta #1B2C52, ámbar #C9822F) declarada una sola vez como tokens, para que la web y lo impreso no se separen con el tiempo.</p>',
      bullets: [
        'Logotipo en tres bloqueos (horizontal, apilado, solo nombre), cada uno en navy y en blanco',
        '39 archivos de aplicación: perfiles de WhatsApp y Google, banners, imagen para compartir, favicons, membretes en tres variantes y tarjeta de presentación',
        'Vectores con el texto convertido a curvas, para que la imprenta no dependa de tener la fuente',
        'Manual de identidad con reglas de uso y tamaños mínimos',
      ],
    },
    site: {
      label: 'El sitio',
      title: '11 páginas, hechas a mano.',
      intro: 'Todo el contenido médico es texto literal de Daniel. No se reescribió una línea: en salud, el copy no es del diseñador.',
      items: [
        { term: 'Inicio', desc: 'Hero, qué tratamos (8 condiciones), servicios y procedimientos (7), inmunoterapia y recomendaciones, perfil del doctor y cierre.' },
        { term: '8 páginas de condición', desc: 'Cada una con síntomas, tratamiento, enlaces cruzados entre condiciones y su propio llamado a la acción.' },
        { term: 'Blog', desc: 'Con su primer artículo, sobre la prueba de prick.' },
        { term: 'Campo de partículas en canvas', desc: 'Hecho a mano, no traído de una librería: deriva orgánica por senos desfasados, capas de profundidad, repulsión al cursor. Se pausa fuera de pantalla y se apaga si el sistema pide menos movimiento.' },
        { term: 'Modo claro y oscuro', desc: 'Se recuerda entre visitas, incluso al volver atrás en el historial. Más una defensa contra el modo oscuro forzado de iOS, que rompía el contraste del texto.' },
        { term: 'Scroll suave', desc: 'Con Lenis, solo en escritorio.' },
      ],
    },
    scheduling: {
      label: 'Agendamiento',
      title: 'Una jerarquía deliberada, de la visita a la cita.',
      items: [
        { term: 'Primero la agenda, después WhatsApp', desc: 'El botón primario va a la agenda en línea de SaludTools; un enlace secundario de texto va a WhatsApp.' },
        { term: 'Dos excepciones donde conversar es lo correcto', desc: 'El header y la tarjeta «¿No sabes cuál es tu caso?» llevan solo a WhatsApp.' },
        { term: 'Un mensaje que cambia con la página', desc: 'El mensaje de WhatsApp viene pre-escrito y cambia según la página: quien entra por rinitis alérgica escribe distinto a quien entra por urticaria.' },
        { term: 'Cada enlace de reserva va marcado', desc: 'Los enlaces a SaludTools llevan UTM, para poder atribuir cada reserva a su página.' },
      ],
    },
    infra: {
      label: 'Infraestructura y SEO',
      title: 'Dos migraciones, ni una URL rota.',
      intro: 'El sitio vivió primero en Netlify y pasó a Cloudflare Pages; el dominio pasó de alergologodezubiria.com a drdanieldezubiria.com mientras no costaba nada: sin tarjetas impresas y sin posicionamiento que perder.',
      items: [
        { term: 'Dominio', desc: 'drdanieldezubiria.com en Cloudflare; el anterior alergologodezubiria.com redirige con 301 conservando la ruta.' },
        { term: 'Hosting', desc: 'Cloudflare Pages con deploy automático en cada push.' },
        { term: 'Datos estructurados', desc: 'Physician, MedicalCondition y MedicalSignOrSymptom, más sitemap, robots.txt dinámico y Open Graph.' },
        { term: 'Google Search Console', desc: 'Propiedad de dominio verificada y sitemap enviado.' },
        { term: 'Analítica sin cookies', desc: 'Cloudflare Web Analytics: sin cookies y sin banner de consentimiento.' },
        { term: 'Perfil de Google Business', desc: 'Creado, verificado y con la marca aplicada.' },
      ],
    },
    next: {
      label: 'Primeras semanas en Google',
      title: 'Un sitio recién nacido que ya encuentran.',
      intro: 'Google Search Console, del 18 de agosto al 24 de septiembre de 2026. El consultorio acababa de abrir y no hubo nada pago: son cifras tempranas, no una tendencia.',
      stats: [
        { value: '801', label: 'Veces que apareció en Google' },
        { value: '48', label: 'Visitas desde el buscador, sin anuncios' },
        { value: '3,1', label: 'Posición promedio para “alergólogo bogotá”' },
      ],
      after:
        '<p>El 89% de esas apariciones fueron en Colombia y el 69% en celular. La posición promedio pasó de 11,5 en la primera mitad del periodo a 7,8 en la segunda. Lo que sigue es trabajo continuo: el mantenimiento mensual y un chatbot para pacientes.</p><p>Fue un regalo de grado. El alcance no se recortó por eso.</p>',
    },
    details: [
      { title: 'Tecnología', html: '<p>Astro 5, CSS propio con design tokens, JavaScript vanilla. Sin frameworks de estilos.</p>' },
      { title: 'Tipografía', html: '<p>Instrument Serif (logotipo), Newsreader (titulares), Karla (cuerpo).</p>' },
      { title: 'Tiempos', html: '<p>De la primera conversación de alcance, el 20 de julio de 2026, a una marca y un sitio completos en poco más de dos meses.</p>' },
    ],
    cta: {
      title: '¿Vas a abrir un consultorio, un estudio, un negocio?',
      text: 'Construimos la marca, el sitio y todo lo que hay detrás, y lo mantenemos funcionando mes a mes. Eso es lo que hace Mattriz.',
    },
  },
};

export function drDanielDeZubiria(lang: Lang): CaseDoc {
  const t = TEXT[lang];
  return {
    name: 'Dr. Daniel De Zubiría',
    theme: 'dark',
    bg: '#1B3A94',
    accent: '#E9A94E',
    onAccent: '#1B2C52',
    metaTitle: t.metaTitle,
    description: t.description,
    year: '2026',
    tagline: t.tagline,
    intro: t.intro,
    facts: t.facts,
    hero: NAV(lang),
    site: 'https://drdanieldezubiria.com/',
    blocks: [
      { kind: 'text', style: 'lead', ...t.brief },
      { kind: 'media', layout: 'pair', items: [SITE_HOME(lang), SITE_DARK(lang)] },
      { kind: 'media', layout: 'pair', items: [CARD_FRONT(lang), CARD_BACK(lang)] },
      { kind: 'text', style: 'lead', ...t.identity },
      { kind: 'media', layout: 'wide', items: [LINKEDIN(lang)] },
      { kind: 'media', layout: 'pair', items: [WHATSAPP(lang), GOOGLE(lang)] },
      { kind: 'cards', ...t.site },
      { kind: 'media', layout: 'pair', items: [SITE_CONDITIONS(lang), SITE_ASTHMA(lang)] },
      { kind: 'media', layout: 'trio', items: [M_HOME(lang), M_ASTHMA(lang), M_HIVES(lang)] },
      { kind: 'list', ...t.scheduling },
      { kind: 'list', ...t.infra },
      { kind: 'media', layout: 'pair', items: [SITE_DOCTOR(lang), HERO(lang)] },
      { kind: 'media', layout: 'inset', items: [LETTERHEAD(lang)] },
      { kind: 'stats', ...t.next },
      { kind: 'details', cols: t.details },
      { kind: 'cta', ...t.cta, link: { href: 'mailto:contacto@mattriz.com', label: 'contacto@mattriz.com' } },
    ],
  };
}
