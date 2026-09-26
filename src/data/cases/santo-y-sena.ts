// v2: caso de estudio de Santo & Seña (2026), escrito a mano.
//
// Español: resumen del documento del estudio (santo-y-sena.md, 26 de septiembre de 2026), sin cifras
// nuevas; las rayas largas (—) pasan a coma, punto o dos puntos (regla de marca).
// Inglés: traducción de ese texto (pendiente de revisión, ver reference/TRADUCCIONES.md).
// Colores tomados del sitio de Santo & Seña: menta #f0fefb y tinta #1a1a1a.
// Imágenes: capturas de casasantoysena.com → public/media/projects/santo-y-sena/*.webp.

import type { Lang } from '../../i18n';
import type { CaseDoc, CaseMedia } from '../../components/case/doc';

const DIR = '/media/projects/santo-y-sena';
type L = Record<Lang, string>;
const desk = (base: string, alt: L, caption?: L) => (lang: Lang): CaseMedia => ({
  type: 'img',
  local: { dir: DIR, base: `ss-${base}`, width: 1600, height: 1000, widths: [1600, 1200, 700] },
  alt: alt[lang],
  caption: caption?.[lang],
});
const phone = (base: string, alt: L) => (lang: Lang): CaseMedia => ({
  type: 'img',
  local: { dir: DIR, base: `ss-m-${base}`, width: 900, height: 1948, widths: [900, 600] },
  alt: alt[lang],
});

const HOME = desk('home', {
  en: 'Santo & Seña home page: search, sections and the event of the week',
  es: 'Portada de Santo & Seña: buscador, secciones y el evento de la semana',
}, {
  en: 'The home page recomposes itself every day with what arrives at the shop.',
  es: 'La portada se recompone sola cada día con lo que va llegando a la tienda.',
});
const SHOP = desk('libros', {
  en: 'Santo & Seña shop with category filters and sorting',
  es: 'Tienda de Santo & Seña con filtros por categoría y orden',
}, {
  en: 'The shop, served by the new site. Checkout still runs on WordPress, on the same domain.',
  es: 'La tienda, servida por el sitio nuevo. El pago sigue saliendo de WordPress, en el mismo dominio.',
});
const SEARCH = desk('buscar', {
  en: 'Instant search results for “cortázar”',
  es: 'Resultados instantáneos para «cortázar»',
}, {
  en: 'Search answers without the network: the index ships to the browser.',
  es: 'El buscador responde sin red: el índice viaja al navegador.',
});
const LISTEN = desk('escucha', {
  en: 'Listening page with a turntable and the latest vinyl records',
  es: 'Página de escucha con un tocadiscos y los últimos vinilos',
}, {
  en: 'Pick a record, hear 30 seconds, take it home.',
  es: 'Escoge un disco, escucha 30 segundos y llévatelo.',
});
const RECORD = desk('disco', {
  en: 'Record page for Happy Today by Jeff Parker ETA IVtet, with a preview player',
  es: 'Ficha del disco Happy Today de Jeff Parker ETA IVtet, con reproductor de fragmento',
}, {
  en: 'Artist and album resolved against Discogs, MusicBrainz and iTunes, overnight.',
  es: 'Artista y álbum resueltos de noche contra Discogs, MusicBrainz e iTunes.',
});
const READINGS = desk('lecturas', {
  en: 'Reading recommendations page for Fernanda Melchor',
  es: 'Página de recomendaciones de lectura de Fernanda Melchor',
});
const M_HOME = phone('home', { en: 'Santo & Seña home on a phone', es: 'Portada de Santo & Seña en el celular' });
const M_RECORD = phone('disco', { en: 'Record page on a phone', es: 'Ficha de un disco en el celular' });
const M_LISTEN = phone('escucha', { en: 'Turntable page on a phone', es: 'Tocadiscos en el celular' });
const FLOW = (lang: Lang): CaseMedia => ({
  type: 'video',
  local: { dir: DIR, base: 'ss-flow', width: 1440, height: 900 },
  alt: { en: 'Browsing the home page, opening the shop, adding a book to the cart', es: 'Recorrido por la portada, la tienda y un libro añadido al carrito' }[lang],
  caption: { en: 'From the home page to the cart: catalogue, product page and cart served by the new site.', es: 'De la portada al carrito: catálogo, ficha y carrito servidos por el sitio nuevo.' }[lang],
});

const TEXT = {
  en: {
    metaTitle: 'Santo & Seña Case Study | Mattriz Studio',
    description:
      'A new site for a Bogotá bookshop and record store with three locations and 3,538 products, launched in twelve days without touching the operation behind the till.',
    tagline: 'A bookshop with three locations, 3,538 products and a till that couldn’t stop.',
    intro:
      'Twelve days from the first line of code to launch, without migrating the operation. Santo & Seña got a site that looks like the house, while WordPress kept running the shop, the invoicing and the point of sale.',
    facts: [
      { label: 'Client', value: 'Santo & Seña' },
      { label: 'Location', value: 'Bogotá, Colombia' },
      { label: 'Live since', value: 'September 10, 2026' },
    ],
    brief: {
      label: 'The brief',
      title: 'A new site, without touching the operation.',
      html:
        '<p>Santo & Seña is a bookshop and record store in Bogotá with three locations and a catalogue of 3,538 products. Its operation (inventory, invoicing, point of sale) lived on WordPress and WooCommerce, and it worked. What didn’t work was the face: the site was the usual WordPress theme, slow to load and foreign to what the house is.</p><p>The brief wasn’t “rebuild the shop”. It was harder: <strong>make a new site without touching the operation</strong>. The till couldn’t stop invoicing for a single day, and the 6,115 addresses Google had already indexed couldn’t be lost.</p>',
    },
    constraint: {
      label: 'The central constraint',
      title: 'There was no maintenance window.',
      intro:
        'WordPress wasn’t migrated, switched off or frozen. It stayed as the engine. On top of it we built a bridge: the new site serves what it knows (catalogue, product pages, events, blog, search) and asks WordPress for the rest behind the scenes. Checkout, customer accounts and the admin keep coming from WordPress, on the same domain, with no visible redirect.',
      items: [
        { term: 'Launch with no risk to the till', desc: 'On launch day invoicing stayed exactly the same, because nobody touched the system that invoices.' },
        { term: 'Roll back in five minutes', desc: 'The rollback plan was a DNS record with a 300-second TTL, with the previous alias and CNAME written down, name and value, next to the rest of the launch.' },
        { term: 'Keep the SEO', desc: 'The 6,115 live addresses are honoured with permanent 301 redirects, which pass the old page’s authority to the new one instead of leaving them to compete.' },
      ],
    },
    decisions: {
      label: 'Six decisions',
      title: 'Six decisions and what they cost.',
      intro: 'A case study without trade-offs is a brochure. These are the decisions that carry the most weight, with what they cost.',
      items: [
        { term: 'Music is precomputed, not resolved live', desc: 'WooCommerce doesn’t know which artist each record is. Matching every product against Discogs, MusicBrainz and iTunes happens overnight and is versioned in the repository. Cost: a generated file Git can’t merge. Result: 102 records resolved, 48 vinyls playing on the site’s turntable.' },
        { term: 'Search runs in the browser', desc: 'Searching 3,538 products live meant one request per keystroke against a shared server. The index is built at compile time instead. Cost: 830 KB downloaded once, weighed against a search box that sometimes doesn’t answer.' },
        { term: 'In-house analytics that identify nobody', desc: 'A counter on Upstash Redis, no cookies, no personal data, and a private panel. No funnels or attribution, but it shows what no third-party tool can: what people searched for and didn’t find.' },
        { term: 'The shop iPad is its own piece', desc: 'The iPad where customers listen to records isn’t a smaller screen, it’s another problem: no links, everything by touch, and it resets itself for the next customer. Cost: code duplicated on purpose.' },
        { term: 'Everything rotates by the day, not at random', desc: 'Categories, new arrivals, the record of the day and the featured location rotate by the day number in Bogotá. Everyone sees the same thing the same day; whoever comes back tomorrow finds something else.' },
        { term: 'Three scheduled jobs, one allowed to fail', desc: 'Catalogue (daily), monthly report (daily) and health (13 checks, eight times a day). A fourth one ends in red on purpose when a hand-written list points to something sold out.' },
      ],
    },
    wrong: {
      label: 'What went wrong',
      title: 'Three hard weeks, documented with the measurement that closed them.',
      items: [
        { term: 'The hosting mistook our own traffic for an attack', desc: 'Product pages started failing, and so did the point of sale. A temporary diagnostic route proved the block depended on where the request came from; with that, the provider found our requests in its own logs and lifted the protection. What stayed: a direct door for the team, a smarter health check and a one-page runbook.' },
        { term: 'The network budget was longer than the function’s deadline', desc: 'One in 25 product pages failed on first visit, always at 15 seconds: the code gave each query 20 seconds, the platform killed the function at 15. Fix: six seconds per query and a 30-second deadline on the busiest routes. Twelve random cold pages afterwards: all between 0.17 and 1.87 seconds.' },
        { term: 'The bill doubled, and the culprit wasn’t the obvious one', desc: 'Image optimisation was 82 cents out of 23 dollars. 88% of the bill was 117 production deploys in thirteen days, plus link prefetching that rendered the uncached shop page once per filter option. Prefetching is now off where it costs and on where it’s free: from 35 prefetches on the home page, 9 uncached, down to 24, none uncached.' },
        { term: 'Three regressions, reverted the same day', desc: 'Trimming image widths broke pages already cached in browsers, measuring too hard tripped the build twice, and the publish guard kept a bad version for two hours. The health check now verifies the home page’s sections, not just that it answers.' },
      ],
    },
    method: {
      label: 'The method',
      title: 'A directed AI agent, not an automatic one.',
      html:
        '<p>Of 343 commits, 239 were written by an AI agent and 80 by the studio. That explains the pace, and also the limits. Every decision is documented in the code itself, and every diagnosis was closed by measuring, not by opinion.</p><p>What didn’t work: verification needs the same discipline as development. And human direction isn’t optional: the most valuable decisions (not migrating, the bridge, in-house analytics, the iPad as its own piece) came from the business, not from the code.</p>',
    },
    today: {
      label: 'Where it is today',
      title: 'Sixteen days in production.',
      intro: 'The music catalogue regenerates every night, the monthly report builds itself, the home page recomposes with what arrives at the shop, and health is checked eight times a day.',
      stats: [
        { value: '12', label: 'Days from first commit to launch' },
        { value: '6,115', label: 'Indexed addresses preserved' },
        { value: '13/13', label: 'Health checks passing' },
      ],
      quote: 'Pages respond in 0.18 to 0.66 seconds. Cold product pages load in 0.17 to 1.87 seconds, with no failures. Across nine pages, 1,755 of 1,755 images verified.',
    },
    next: {
      label: 'What’s next',
      title: 'The work isn’t closed, and the case doesn’t pretend it is.',
      items: [
        { term: 'Degraded catalogue mode', desc: 'Serve yesterday’s data, with a notice, when the back-office doesn’t respond. It’s the root of most incidents in this period.' },
        { term: 'Cache the shop page', desc: 'It’s the only purchase page that is drawn from scratch on every visit.' },
        { term: 'Turn the data into action', desc: 'The panel already shows what people searched for and didn’t find, and what they left in the cart. Next: a mailing list of their own and a “back in stock” alert.' },
      ],
    },
    details: [
      { title: 'Front end', html: '<p>Next.js 16, React 19, Tailwind CSS 4, TypeScript on Vercel. Eight direct dependencies: no component library, state manager or ORM.</p>' },
      { title: 'Back office', html: '<p>WooCommerce on WordPress (Hostinger), not migrated. Point of sale: Pliego, the client’s own plugin, invoicing to Siigo.</p>' },
      { title: 'Data & automation', html: '<p>Upstash Redis for sessions and analytics. Discogs, MusicBrainz and iTunes for the catalogue. GitHub Actions for three scheduled jobs.</p>' },
    ],
    cta: {
      title: 'Your operation works, but your site doesn’t look like you?',
      text: 'We can build the new face without touching what keeps the business running. That’s what Mattriz does.',
    },
  },
  es: {
    metaTitle: 'Caso de estudio Santo & Seña | Mattriz Studio',
    description:
      'Un sitio nuevo para una librería y tienda de discos de Bogotá con tres sedes y 3.538 productos, lanzado en doce días sin tocar la operación que sostiene la caja.',
    tagline: 'Una librería con tres sedes, 3.538 productos y una caja que no podía parar.',
    intro:
      'Doce días de la primera línea al lanzamiento, sin migrar la operación. Santo & Seña estrenó un sitio que se parece a la casa, mientras WordPress siguió moviendo la tienda, la facturación y el punto de venta.',
    facts: [
      { label: 'Cliente', value: 'Santo & Seña' },
      { label: 'Ubicación', value: 'Bogotá, Colombia' },
      { label: 'En línea desde', value: '10 de septiembre de 2026' },
    ],
    brief: {
      label: 'El encargo',
      title: 'Un sitio nuevo, sin tocar la operación.',
      html:
        '<p>Santo & Seña es una librería y tienda de discos en Bogotá, con tres sedes y un catálogo de 3.538 productos. Su operación (inventario, facturación, punto de venta) vivía sobre WordPress y WooCommerce, y funcionaba. Lo que no funcionaba era la cara: el sitio era el tema de WordPress de siempre, lento de cargar y ajeno a lo que la casa es.</p><p>El encargo no fue «rehagan la tienda». Fue más difícil: <strong>hacer un sitio nuevo sin tocar la operación</strong>. La caja no podía dejar de facturar un solo día, y las 6.115 direcciones que Google ya tenía indexadas no se podían perder.</p>',
    },
    constraint: {
      label: 'La restricción central',
      title: 'No había ventana de mantenimiento.',
      intro:
        'WordPress no se migró, no se apagó, no se congeló. Siguió siendo el motor. Encima se construyó un puente: el sitio nuevo sirve lo que sabe servir (el catálogo, las fichas, los eventos, el blog, el buscador) y lo que no sabe se lo pide a WordPress por detrás. El pago, la cuenta del cliente y el escritorio de administración siguen saliendo de WordPress, en el mismo dominio y sin una redirección visible.',
      items: [
        { term: 'Lanzar sin riesgo de caja', desc: 'El día del cambio, la facturación siguió exactamente igual, porque nadie tocó el sistema que factura.' },
        { term: 'Volver atrás en cinco minutos', desc: 'El plan de reversa era un registro DNS con TTL de 300 segundos, con el alias y el CNAME anteriores anotados, con nombre y valor, junto al resto del lanzamiento.' },
        { term: 'Conservar el SEO', desc: 'Las 6.115 direcciones vivas se honran con redirecciones 301 permanentes, que traspasan la autoridad de la página vieja a la nueva en vez de dejarlas compitiendo.' },
      ],
    },
    decisions: {
      label: 'Seis decisiones',
      title: 'Seis decisiones y lo que costaron.',
      intro: 'Un caso de estudio sin contrapartidas es un folleto. Estas son las decisiones que más peso tienen, con lo que costaron.',
      items: [
        { term: 'La música se precomputa, no se resuelve en vivo', desc: 'WooCommerce no sabe qué artista es cada disco. El cruce de cada producto contra Discogs, MusicBrainz e iTunes se hace de noche y se versiona en el repositorio. Costo: un archivo generado que Git no sabe fusionar. Resultado: 102 discos resueltos y 48 vinilos sonando en el tocadiscos del sitio.' },
        { term: 'El buscador corre en el navegador', desc: 'Buscar en 3.538 productos en vivo era una petición por tecla contra un servidor compartido. El índice se genera al compilar. Costo: 830 KB que se descargan una vez, pesados contra un buscador que a veces no responde.' },
        { term: 'Analítica propia que no identifica a nadie', desc: 'Un contador sobre Upstash Redis, sin cookies ni datos personales, y un panel privado. Sin embudos ni atribución, pero muestra lo que ninguna herramienta de terceros da: lo que la gente buscó y no encontró.' },
        { term: 'El iPad de la tienda es una pieza aparte', desc: 'El iPad donde los clientes escuchan discos no es una pantalla más pequeña, es otro problema: sin enlaces, todo con el dedo, y se reinicia solo para el siguiente cliente. Costo: código duplicado a propósito.' },
        { term: 'Todo lo que rota, rota por el día y no al azar', desc: 'Las categorías, las novedades, el disco del día y la sede destacada rotan por el número de día en Bogotá. Todo el mundo ve lo mismo el mismo día, y quien vuelve mañana encuentra otra cosa.' },
        { term: 'Tres tareas programadas, y una que puede fallar queriendo', desc: 'Catálogo (diaria), reporte del mes (diaria) y salud (13 comprobaciones, ocho veces al día). Una cuarta termina en rojo a propósito cuando una lista escrita a mano apunta a algo agotado.' },
      ],
    },
    wrong: {
      label: 'Lo que salió mal',
      title: 'Tres semanas duras, documentadas con la medición que las cerró.',
      items: [
        { term: 'El hosting confundió el tráfico propio con un ataque', desc: 'Las fichas de producto empezaron a fallar, y el punto de venta también. Una ruta de diagnóstico temporal demostró que el bloqueo dependía de por dónde salía la petición; con ese dato, el proveedor encontró nuestras peticiones en sus registros y retiró la protección. Quedó una puerta directa para el equipo, una comprobación de salud más fina y un documento de una página.' },
        { term: 'El presupuesto de red era mayor que el plazo de la función', desc: 'Una de cada veinticinco fichas fallaba en la primera visita, siempre a los quince segundos: el código daba veinte a cada consulta y la plataforma mataba la función a los quince. Arreglo: seis segundos por consulta y plazo de treinta en las rutas que más piden. Doce fichas frías al azar después: todas entre 0,17 y 1,87 segundos.' },
        { term: 'La factura se duplicó, y el culpable no era el que parecía', desc: 'La optimización de imágenes eran 82 centavos de veintitrés dólares. El 88 % de la factura eran 117 envíos a producción en trece días, más la precarga de enlaces, que renderizaba la tienda sin caché una vez por cada opción de filtro. Ahora la precarga está apagada donde cuesta: la portada pasó de 35 precargas, 9 sin caché, a 24, ninguna sin caché.' },
        { term: 'Tres regresiones, revertidas el mismo día', desc: 'Recortar los anchos de imagen rompió páginas ya guardadas en los navegadores, medir sin cuidado tumbó la compilación dos veces y el guardián de publicación conservó una versión mala durante dos horas. La comprobación de salud ahora verifica las secciones de la portada, no solo que responda.' },
      ],
    },
    method: {
      label: 'El método',
      title: 'Un agente de IA dirigido, no automático.',
      html:
        '<p>De los 343 commits, 239 los escribió un agente de IA y 80 el estudio. Eso explica el ritmo, y también los límites. Cada decisión quedó documentada en el propio código, y cada diagnóstico se cerró midiendo, no opinando.</p><p>Lo que no funcionó: la verificación necesita la misma disciplina que el desarrollo. Y la dirección humana no es opcional: las decisiones que más valor tuvieron (no migrar, el puente, la analítica propia, el iPad como pieza aparte) salieron del negocio, no del código.</p>',
    },
    today: {
      label: 'Dónde está hoy',
      title: 'Dieciséis días en producción.',
      intro: 'El catálogo de música se regenera cada noche, el informe del mes se arma solo, la portada se recompone con lo que va llegando a la tienda y la salud se comprueba ocho veces al día.',
      stats: [
        { value: '12', label: 'Días del primer commit al lanzamiento' },
        { value: '6.115', label: 'Direcciones indexadas conservadas' },
        { value: '13/13', label: 'Comprobaciones de salud en verde' },
      ],
      quote: 'Las páginas responden en 0,18 a 0,66 segundos. Las fichas frías cargan en 0,17 a 1,87 segundos, sin caídas. En nueve páginas, 1.755 de 1.755 imágenes verificadas.',
    },
    next: {
      label: 'Lo que sigue',
      title: 'El trabajo no está cerrado y el caso tampoco lo finge.',
      items: [
        { term: 'Modo degradado del catálogo', desc: 'Que la tienda sirva los datos de ayer, con aviso, cuando el back-office no responda. Es la raíz de la mayoría de los incidentes de este periodo.' },
        { term: 'Cachear la página de tienda', desc: 'Es la única página de compra que se dibuja entera en cada visita.' },
        { term: 'Convertir el dato en acción', desc: 'El panel ya muestra qué buscó la gente y no encontró, y qué dejó en el carrito sin pagar. Falta lo que sigue: una lista de correo propia y un aviso de «vuelve a estar disponible».' },
      ],
    },
    details: [
      { title: 'Front', html: '<p>Next.js 16, React 19, Tailwind CSS 4 y TypeScript sobre Vercel. Ocho dependencias directas: sin librería de componentes, gestor de estado ni ORM.</p>' },
      { title: 'Back-office', html: '<p>WooCommerce sobre WordPress (Hostinger), sin migrar. Punto de venta: Pliego, plugin propio del cliente, facturando a Siigo.</p>' },
      { title: 'Datos y automatización', html: '<p>Upstash Redis para sesiones y analítica. Discogs, MusicBrainz e iTunes para el catálogo. GitHub Actions para tres tareas programadas.</p>' },
    ],
    cta: {
      title: '¿Tu operación funciona, pero tu sitio no se parece a ti?',
      text: 'Podemos construir la cara nueva sin tocar lo que sostiene el negocio. Eso es lo que hace Mattriz.',
    },
  },
};

export function santoYSena(lang: Lang): CaseDoc {
  const t = TEXT[lang];
  return {
    name: 'Santo & Seña',
    theme: 'light',
    bg: '#f0fefb',
    accent: '#1a1a1a',
    onAccent: '#f0fefb',
    metaTitle: t.metaTitle,
    ogImage: `${DIR}/ss-home-1200.webp`,
    description: t.description,
    year: '2026',
    tagline: t.tagline,
    intro: t.intro,
    facts: t.facts,
    hero: HOME(lang),
    site: 'https://casasantoysena.com/',
    blocks: [
      { kind: 'text', style: 'lead', ...t.brief },
      { kind: 'media', layout: 'full', items: [FLOW(lang)] },
      { kind: 'media', layout: 'pair', items: [SHOP(lang), SEARCH(lang)] },
      { kind: 'list', ...t.constraint },
      { kind: 'cards', ...t.decisions },
      { kind: 'media', layout: 'pair', items: [LISTEN(lang), RECORD(lang)] },
      { kind: 'media', layout: 'trio', items: [M_HOME(lang), M_RECORD(lang), M_LISTEN(lang)] },
      { kind: 'list', ...t.wrong },
      { kind: 'text', style: 'lead', ...t.method },
      { kind: 'stats', ...t.today },
      { kind: 'media', layout: 'inset', items: [READINGS(lang)] },
      { kind: 'list', ...t.next },
      { kind: 'details', cols: t.details },
      { kind: 'cta', ...t.cta, link: { href: 'mailto:contacto@mattriz.com', label: 'contacto@mattriz.com' } },
    ],
  };
}
