// Datos compartidos del sitio (tomados del sitio vivo, Fase 0).

export const SITE = {
  name: 'Mattriz Studio',
  url: 'https://mattriz.com',
  email: 'contacto@mattriz.com',
  calendly: 'https://calendly.com/contacto-mattriz/30min',
  instagram: 'https://www.instagram.com/estudiomattriz/',
  linkedin: 'https://www.linkedin.com/company/estudio-mattriz/',
  facebook: 'https://www.facebook.com/EstudioMattriz/',
  // Teléfono publicado en los datos estructurados del vivo (AIOSEO).
  telephone: '+573138433136',
  description: 'Booking, payments and operations systems for service businesses',
  // Verificación de Google Search Console (misma etiqueta del vivo; si se pierde, la propiedad deja de verificarse).
  googleSiteVerification: '_FvgwI41e7TbXI0h41WHi0g1FLguvW6AkNjGC9iJGWY',
  // Analítica del vivo: contenedor de Tag Manager y etiqueta de Google de Site Kit.
  gtm: 'GTM-WWG3RJFC',
  googleTag: 'GT-T5MFXVLQ',
} as const;

// Menú principal. En el vivo "How we work" apunta a "#how-we-work" también fuera
// de la home (enlace roto en /about/, /contact/…); aquí apunta siempre a la home.
export const NAV = [
  { label: 'Home', href: '/' },
  { label: 'How we work', href: '/#how-we-work' },
  { label: 'Projects', href: '/#work' },
  { label: 'Services', href: '/#services' },
  { label: 'Contact', href: '/contact/' },
] as const;
