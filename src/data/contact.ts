import type { Lang } from '../i18n';

// Contenido de /contact/: mismos campos del formulario WPForms del vivo.
// Testimonio de Diego: rayas largas reemplazadas por comas (regla de marca).

export const CONTACT = {
  title: 'Let’s talk about your project.',
  services: ['Web development', 'Booking & operations systems', 'Payment integration', 'Custom admin panels', 'Automation & follow-ups', 'Something else'],
  budgets: ['Not sure / want guidance', '$500–$1,000', '$1,000–$2,500', '$2,500–$5,000', '$5,000–$10,000', '$10,000+'],
  submit: 'Get a proposal',
  // Mensajes del brief (sección 4).
  success: 'Thanks. We’ll get back to you within one business day.',
  error: 'Something went wrong and your message wasn’t sent. Write to us directly at contacto@mattriz.com.',
  metaTitle: 'Contact Mattriz Studio | Get a Project Quote',
  metaDescription: 'Contact Mattriz Studio about booking, payment and operations systems for your service business. Tell us about your project and we’ll reply within one business day.',
  breadcrumb: 'Contact',
  fields: {
    name: 'Name',
    namePh: 'Full Name',
    email: 'Email',
    emailPh: 'Email Address',
    phone: 'Phone / Whatsapp (optional)',
    help: 'How can we help you?',
    helpNote: 'Select all that apply.',
    budget: 'Estimated budget (USD)',
    details: 'More details about your project',
    detailsPh: 'What are you building? Timeline? Links? Goals?',
  },
};

export const CONTACT_CASE = {
  badge: 'Spot On Mobile California',
  video: '/media/work/spot-on.mp4',
  poster: '/media/contact/spot-on-poster-1000.webp',
  quote: [
    'I had the opportunity to work with Mattriz on building my business website, and the experience exceeded our expectations. From the very beginning, we received very positive feedback, even from people who work at large technology companies here in the United States.',
    'We decided to trust this company not so much for its cost, which is competitive and in many cases even better than that of local companies in California, but for the quality and professionalism they demonstrated from the outset.',
  ],
  name: 'Diego',
  role: 'CEO at Spot On Mobile California',
  link: { label: 'Go to live project', href: 'https://mobilespotoncalifornia.com/' },
};

// ---------------------------------------------------------------------------
// Español (/es/contact/). Los valores enviados en el correo también van en español.

export const CONTACT_ES = {
  CONTACT: {
    title: 'Hablemos de tu proyecto.',
    services: ['Desarrollo web', 'Sistemas de reservas y operación', 'Integración de pagos', 'Paneles de administración', 'Automatización y seguimiento', 'Otra cosa'],
    budgets: ['No estoy seguro / quiero orientación', '$500–$1,000', '$1,000–$2,500', '$2,500–$5,000', '$5,000–$10,000', '$10,000+'],
    submit: 'Pedir una propuesta',
    success: 'Gracias. Te respondemos en un día hábil.',
    error: 'Algo salió mal y tu mensaje no se envió. Escríbenos directamente a contacto@mattriz.com.',
    metaTitle: 'Contacta a Mattriz Studio | Pide una cotización',
    metaDescription: 'Contacta a Mattriz Studio para sistemas de reservas, pagos y operación para tu negocio de servicios. Cuéntanos tu proyecto y te respondemos en un día hábil.',
    breadcrumb: 'Contacto',
    fields: {
      name: 'Nombre',
      namePh: 'Nombre completo',
      email: 'Correo',
      emailPh: 'Correo electrónico',
      phone: 'Teléfono / WhatsApp (opcional)',
      help: '¿Cómo podemos ayudarte?',
      helpNote: 'Selecciona todas las que apliquen.',
      budget: 'Presupuesto estimado (USD)',
      details: 'Más detalles de tu proyecto',
      detailsPh: '¿Qué estás construyendo? ¿Plazos? ¿Enlaces? ¿Objetivos?',
    },
  },
  CONTACT_CASE: {
    ...CONTACT_CASE,
    quote: [
      'Tuve la oportunidad de trabajar con Mattriz en el sitio web de mi negocio y la experiencia superó nuestras expectativas. Desde el principio recibimos comentarios muy positivos, incluso de personas que trabajan en grandes empresas de tecnología aquí en Estados Unidos.',
      'Decidimos confiar en esta empresa no tanto por su costo, que es competitivo y en muchos casos incluso mejor que el de empresas locales en California, sino por la calidad y el profesionalismo que demostraron desde el principio.',
    ],
    role: 'CEO de Spot On Mobile California',
    link: { ...CONTACT_CASE.link, label: 'Ver el proyecto en vivo' },
  },
};

export const contact = (lang: Lang) => (lang === 'es' ? CONTACT_ES : { CONTACT, CONTACT_CASE });
