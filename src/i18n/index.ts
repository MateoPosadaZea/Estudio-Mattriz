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

/** Ruta en un idioma: localize('/about/', 'es') → /es/about/; localize('/#projects', 'es') → /es/#projects */
export const localize = (path: string, lang: Lang) => {
  if (lang === 'en' || /^(https?:|mailto:|tel:|#)/.test(path)) return path;
  return path.startsWith('/') ? `/es${path}` : path;
};

/** La misma página en el otro idioma (o en el pedido). */
// En la página 404 el cambio de idioma lleva al inicio del otro idioma (no hay /es/404/ navegable).
export const alternate = (url: URL, lang: Lang) => {
  const base = basePath(url.pathname);
  return localize(/^\/404(\.html|\/)?$/.test(base) ? '/' : base, lang);
};

/** Elige el valor del idioma: pick(lang, { en: 'Home', es: 'Inicio' }) */
export const pick = <T>(lang: Lang, values: Record<Lang, T>): T => values[lang];

// Categorías de proyecto: el nombre en inglés es la clave (también para los filtros).
export const CATEGORY_ES: Record<string, string> = {
  'Brand Identity': 'Identidad de marca',
  'UI/UX Design': 'Diseño UI/UX',
  'Web Development': 'Desarrollo web',
  'E-commerce': 'Tienda en línea',
  'Booking & Payments': 'Reservas y pagos',
  Automation: 'Automatización',
  SEO: 'SEO',
  // Nombres del sitio anterior que aún aparecen en datos viejos.
  'SEO Optimization': 'SEO',
  'Graphic Design': 'Diseño gráfico',
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
    accepting: 'Based in Bogotá, working worldwide',
    social: 'Social',
    localTime: 'Bogotá, local time',
    copy: 'Copy',
    copied: 'Copied',
    copyEmail: 'Copy email address',
    switchLabel: 'Ver en español',
    switchShort: 'ES',
    themeLight: 'Light theme',
    colorModes: 'Color mode',
    modeNames: ['White', 'Red', 'Dark'],
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
    accepting: 'Desde Bogotá, para clientes en todo el mundo',
    social: 'Redes',
    localTime: 'Hora en Bogotá',
    copy: 'Copiar',
    copied: 'Copiado',
    copyEmail: 'Copiar el correo',
    switchLabel: 'View in English',
    switchShort: 'EN',
    themeLight: 'Tema claro',
    colorModes: 'Modo de color',
    modeNames: ['Blanco', 'Rojo', 'Oscuro'],
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
