// Idiomas del sitio: inglés en la raíz (/) y español bajo /es/.
// El idioma sale de la URL, así cada componente lo resuelve solo con Astro.url.

export type Lang = 'en' | 'es';
export const LANGS: Lang[] = ['en', 'es'];

export const langOf = (url: URL | string): Lang => {
  const path = typeof url === 'string' ? url : url.pathname;
  return path === '/es' || path.startsWith('/es/') ? 'es' : 'en';
};

/** Quita el prefijo de idioma: /es/about/ → /about/ */
export const basePath = (path: string) => (path === '/es' ? '/' : path.startsWith('/es/') ? path.slice(3) : path);

/** Ruta en un idioma: localize('/about/', 'es') → /es/about/; localize('/#work', 'es') → /es/#work */
export const localize = (path: string, lang: Lang) => {
  if (lang === 'en' || /^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return path.startsWith('/') ? `/es${path}` : path;
};

/** La misma página en el otro idioma (o en el pedido). */
export const alternate = (url: URL, lang: Lang) => localize(basePath(url.pathname), lang);

/** Elige el valor del idioma: pick(lang, { en: 'Home', es: 'Inicio' }) */
export const pick = <T>(lang: Lang, values: Record<Lang, T>): T => values[lang];

// Categorías de proyecto: el nombre en inglés es la clave (también para los filtros).
export const CATEGORY_ES: Record<string, string> = {
  'Brand Identity': 'Identidad de marca',
  'SEO Optimization': 'Optimización SEO',
  'UI/UX Design': 'Diseño UI/UX',
  'Web Development': 'Desarrollo web',
};

export const category = (name: string, lang: Lang) => (lang === 'es' ? CATEGORY_ES[name] ?? name : name);

// Textos de interfaz (header, menú, footer, botones, etiquetas accesibles).
export const UI = {
  en: {
    nav: ['Home', 'How we work', 'Projects', 'Services', 'Contact'],
    talk: 'Let’s talk',
    menu: 'Menu',
    closeMenu: 'Close Menu',
    close: 'Close',
    mainNav: 'Main',
    skip: 'Skip to main content',
    toTop: 'Back to top',
    accepting: 'Currently accepting new clients',
    social: 'Social',
    localTime: 'Bogotá, local time',
    copy: 'Copy',
    copied: 'Copied',
    copyEmail: 'Copy email address',
    switchLabel: 'Ver en español',
    switchShort: 'ES',
    themeLight: 'Light theme',
    switchLong: 'Español',
    locale: 'en_US',
    htmlLang: 'en-US',
    breadcrumbHome: 'Home',
    notFound: 'Page Not Found',
    backHome: 'Back Home',
    notFoundTitle: 'Page not found – Mattriz Studio',
    notFoundDesc: 'This page doesn’t exist.',
  },
  es: {
    nav: ['Inicio', 'Cómo trabajamos', 'Proyectos', 'Servicios', 'Contacto'],
    talk: 'Hablemos',
    menu: 'Menú',
    closeMenu: 'Cerrar menú',
    close: 'Cerrar',
    mainNav: 'Principal',
    skip: 'Saltar al contenido',
    toTop: 'Volver arriba',
    accepting: 'Estamos recibiendo nuevos clientes',
    social: 'Redes',
    localTime: 'Hora en Bogotá',
    copy: 'Copiar',
    copied: 'Copiado',
    copyEmail: 'Copiar el correo',
    switchLabel: 'View in English',
    switchShort: 'EN',
    themeLight: 'Tema claro',
    switchLong: 'English',
    locale: 'es_CO',
    htmlLang: 'es',
    breadcrumbHome: 'Inicio',
    notFound: 'Página no encontrada',
    backHome: 'Volver al inicio',
    notFoundTitle: 'Página no encontrada – Mattriz Studio',
    notFoundDesc: 'Esta página no existe.',
  },
} as const;

export const ui = (lang: Lang) => UI[lang];
