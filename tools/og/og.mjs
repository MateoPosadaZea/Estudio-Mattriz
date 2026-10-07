// Genera public/og/*.jpg (1200×630), las imágenes para redes, con la identidad actual: fondo blanco,
// texto negro #0D0D0D, rojo de marca como detalle, Noe Display y Maison Neue.
// - home.jpg / home-es.jpg: el titular del home.
// - <caso>.jpg / <caso>-es.jpg: nombre del caso, resumen y la portada del proyecto.
// - about, contact, scan, lab (+ -es): el titular de cada página y una línea corta; lab lleva sus portadas.
// Uso: se copia a tools/capture (que tiene Playwright) y se corre ahí: cp ../og/og.mjs _og.mjs && node _og.mjs
import { chromium } from 'playwright';
import fs from 'node:fs';

const ROOT = new URL('../../', import.meta.url).pathname;
const OUT = `${ROOT}public/og/`;
fs.mkdirSync(OUT, { recursive: true });

const font = (f) => `url(data:font/woff2;base64,${fs.readFileSync(`${ROOT}public/fonts/${f}`).toString('base64')})`;
const img = (p) => `data:image/${p.endsWith('.webp') ? 'webp' : 'jpeg'};base64,${fs.readFileSync(`${ROOT}public${p}`).toString('base64')}`;

// Mismo texto que el home y la lista de proyectos (src/data/home.ts); Let it Go no está en esa lista
// y su resumen sale de la descripción de su página.
const HOME = {
  en: { title: 'Systems that work while you sleep', sub: 'Websites, online stores, booking and payment systems. Designed, built and kept running every month.' },
  es: { title: 'Sistemas que trabajan mientras duermes', sub: 'Sitios web, tiendas en línea y sistemas de reservas y pagos. Diseñados, construidos y mantenidos cada mes.' },
};
const CASES = [
  ['spot-on-mobile-wash-detailing', 'Spot On Mobile Wash & Detailing', '/media/work/spot-on-nav-poster.webp',
    'Booking, payments and a corporate fleet program for a mobile detailer in California, running on their own.',
    'Reservas, pagos y un programa corporativo para un detailer a domicilio en California, funcionando solos.'],
  ['santo-y-sena', 'Santo & Seña', '/media/work/santo-y-sena-nav-poster.webp',
    'New site for a Bogotá bookshop and record store, built over its WooCommerce operation without migrating it.',
    'Sitio nuevo para una librería y tienda de discos de Bogotá, construido sobre su operación en WooCommerce sin migrarla.'],
  ['the-grid', 'The Grid', '/media/work/the-grid-cover-poster.webp',
    'Brand identity and Webflow website for a construction digital-twin consultancy.',
    'Identidad de marca y sitio en Webflow para una consultora de gemelos digitales en construcción.'],
  ['dr-daniel-de-zubiria', 'Dr. Daniel De Zubiría', '/media/work/dezubiria-cover-poster.webp',
    'Brand identity, an 11-page site, online booking and the full infrastructure for an allergy practice in Bogotá.',
    'Identidad de marca, sitio de 11 páginas, agenda en línea y toda la infraestructura de un consultorio de alergología en Bogotá.'],
  ['posada-carcamo-abogados', 'Posada Cárcamo Abogados', '/media/work/posada-nav-poster.webp',
    'Website for a law firm with eleven practice areas, built around its team and its transport clients.',
    'Sitio web para una firma de abogados con once áreas de práctica, pensado alrededor de su equipo y sus clientes de transporte.'],
  ['aglvanstours', 'AGL Vans', '/media/work/agl-nav-poster.webp',
    'Website for a special transport company serving hotels, companies and tourists in Bogotá.',
    'Sitio web para una empresa de transporte especial para hoteles, empresas y turismo en Bogotá.'],
  ['luciana-cabanas', 'Luciana Cabañas', '/media/work/luciana-cover-poster.webp',
    'Logo and a direct-booking website for six boutique cabins in the Valle de Tenza, Boyacá.',
    'Logotipo y sitio de reserva directa para seis cabañas boutique en el Valle de Tenza, Boyacá.'],
  ['civilus', 'Civilus', '/media/work/civilus-cover-poster.webp',
    'Brand identity and React website for an online structural-calculus platform.',
    'Identidad de marca y sitio en React para una plataforma de cálculo estructural en línea.'],
  ['let-it-go', 'Let it Go', '/media/work/let-it-go-1024x768.jpg',
    'Brand and UI design for a mobile app to swap and sell the clothes and books you no longer use.',
    'Marca y diseño de interfaz para una app para intercambiar y vender la ropa y los libros que ya no se usan.'],
];

// Páginas internas: [archivo, { en: [etiqueta, titular, línea], es: [...] }, imágenes opcionales].
const PAGES = [
  ['about', {
    en: ['About', 'We blend design and technology to grow your business.', 'A design and development studio in Bogotá. Websites, online stores and booking systems.'],
    es: ['Sobre Mattriz', 'Unimos diseño y tecnología para hacer crecer tu negocio.', 'Un estudio de diseño y desarrollo en Bogotá. Sitios web, tiendas en línea y sistemas de reservas.'],
  }],
  ['contact', {
    en: ['Contact', 'Let’s talk about your project.', 'Tell us what you need. We reply within one business day.'],
    es: ['Contacto', 'Hablemos de tu proyecto.', 'Cuéntanos qué necesitas. Te respondemos en un día hábil.'],
  }],
  ['scan', {
    en: ['Free tool', 'Scan your site.', 'See what your site runs on, what it is missing and what we would build, step by step.'],
    es: ['Herramienta gratis', 'Escanea tu sitio.', 'Mira en qué está hecho tu sitio, qué le falta y qué construiríamos, paso a paso.'],
  }],
  ['lab', {
    en: ['Mattriz Lab', 'Lab', 'Brand explorations, independent projects and tools.'],
    es: ['Mattriz', 'Laboratorio', 'Exploraciones de marca, proyectos independientes y herramientas.'],
  }, ['/media/lab/001-tipografia-poster.webp', '/media/lab/002-otra-lectura.webp', '/media/lab/003-calibre-perpetuo.webp']],
];

const css = `
  @font-face { font-family: Noe; src: ${font('Noe-Display.woff2')}; font-weight: 500; }
  @font-face { font-family: NoeBold; src: ${font('Noe-Display-Bold.woff2')}; font-weight: 700; }
  @font-face { font-family: Maison; src: ${font('Maison-Neue-Light.woff2')}; font-weight: 300; }
  * { box-sizing: border-box; margin: 0; }
  html, body { width: 1200px; height: 630px; background: #fff; color: #0d0d0d; }
  body { display: flex; flex-direction: column; padding: 56px 64px 52px; font: 300 24px/1.35 Maison, sans-serif; }
  .top { display: flex; justify-content: space-between; align-items: baseline; }
  .logo { font: 700 38px/1 NoeBold, serif; letter-spacing: -0.02em; }
  .url { font-size: 20px; color: rgba(13,13,13,.56); }
  .dot { color: #e52603; }
  h1 { font: 500 104px/0.94 Noe, serif; letter-spacing: -0.035em; }
  .home { margin-top: auto; display: grid; gap: 34px; }
  .home p { max-width: 34em; padding-top: 26px; border-top: 1px solid rgba(13,13,13,.16); color: rgba(13,13,13,.72); }
  .case { margin-top: auto; display: grid; grid-template-columns: 1fr 470px; gap: 48px; align-items: end; }
  .case .eyebrow { font-size: 19px; color: rgba(13,13,13,.56); margin-bottom: 20px; display: flex; gap: 10px; align-items: center; }
  .case .eyebrow i { width: 9px; height: 9px; border-radius: 50%; background: #e52603; }
  .case h1 { font-size: 76px; line-height: 0.98; max-width: none; margin-bottom: 26px; text-wrap: balance; }
  .case p { font-size: 22px; color: rgba(13,13,13,.72); max-width: 24em; }
  .pg { margin-top: auto; display: grid; grid-template-columns: 1fr auto; gap: 40px; align-items: end; }
  .pg .eyebrow { font-size: 19px; color: rgba(13,13,13,.56); margin-bottom: 20px; display: flex; gap: 10px; align-items: center; }
  .pg .eyebrow i { width: 9px; height: 9px; border-radius: 50%; background: #e52603; }
  .pg h1 { font-size: 88px; line-height: 0.96; margin-bottom: 26px; text-wrap: balance; max-width: 11em; }
  .pg p { font-size: 22px; color: rgba(13,13,13,.72); max-width: 26em; }
  .pg.has-imgs h1 { font-size: 96px; }
  .pg.has-imgs p { max-width: 15em; }
  .covers { display: flex; gap: 12px; }
  .covers img { width: 172px; height: 215px; object-fit: cover; display: block; }
  .shot { width: 470px; height: 352px; border-radius: 6px; overflow: hidden; background: #ebebeb; }
  .shot img { width: 100%; height: 100%; object-fit: cover; object-position: top center; display: block; }
`;

const page = (body) => `<!doctype html><meta charset="utf-8"><style>${css}</style>${body}`;
const top = '<div class="top"><div class="logo">Mattriz</div><div class="url">mattriz.com</div></div>';

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
const shoot = async (name, body) => {
  await p.setContent(page(body), { waitUntil: 'load' });
  await p.evaluate(() => document.fonts.ready);
  await p.screenshot({ path: `${OUT}${name}.jpg`, type: 'jpeg', quality: 88 });
  console.log(name);
};

for (const [lang, h] of Object.entries(HOME)) {
  // Dos líneas partidas por la mitad de la frase, como en el hero del sitio.
  const w = h.title.split(' ');
  const cut = Math.ceil(w.length / 2);
  const title = `${w.slice(0, cut).join(' ')}<br>${w.slice(cut).join(' ')}`;
  await shoot(lang === 'en' ? 'home' : 'home-es', `${top}<div class="home"><h1>${title}<span class="dot">.</span></h1><p>${h.sub}</p></div>`);
}
for (const [slug, name, shot, en, es] of CASES) {
  for (const [lang, text] of [['en', en], ['es', es]]) {
    const eyebrow = lang === 'en' ? 'Case study' : 'Caso de estudio';
    await shoot(lang === 'en' ? slug : `${slug}-es`, `${top}<div class="case"><div><div class="eyebrow"><i></i>${eyebrow}</div><h1>${name}</h1><p>${text}</p></div><div class="shot"><img src="${img(shot)}" alt=""></div></div>`);
  }
}
for (const [slug, copy, imgs] of PAGES) {
  for (const [lang, [eyebrow, title, text]] of Object.entries(copy)) {
    const covers = imgs ? `<div class="covers">${imgs.map((i) => `<img src="${img(i)}" alt="">`).join('')}</div>` : '';
    await shoot(lang === 'en' ? slug : `${slug}-es`, `${top}<div class="pg${imgs ? ' has-imgs' : ''}"><div><div class="eyebrow"><i></i>${eyebrow}</div><h1>${title}</h1><p>${text}</p></div>${covers}</div>`);
  }
}
await b.close();
