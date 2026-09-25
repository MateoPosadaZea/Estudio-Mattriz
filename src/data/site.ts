// Datos compartidos del sitio (tomados del sitio vivo, Fase 0).

export const SITE = {
  name: 'Mattriz Studio',
  url: 'https://mattriz.com',
  email: 'contacto@mattriz.com',
  calendly: 'https://calendly.com/contacto-mattriz/30min',
  instagram: 'https://www.instagram.com/estudiomattriz/',
  linkedin: 'https://www.linkedin.com/company/estudio-mattriz/',
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
