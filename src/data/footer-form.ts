// v2: formulario del footer escrito como una frase con espacios para llenar
// (src/components/FooterForm.astro). Servicios, presupuestos y mensajes salen de contact.ts
// (los mismos del formulario de /contact/); aquí solo va el texto de la frase.
import type { Lang } from '../i18n';

const EN = {
  label: 'Tell us about your project',
  // La frase va por partes: texto, campo, texto, campo…
  parts: {
    hi: 'Hi Mattriz, I’m',
    help: 'and I’m looking for help with',
    budget: '. My budget is around',
    idea: '. The idea:',
    reach: '. You can reach me at',
  },
  ph: { name: 'your name', idea: 'a few words about the project', email: 'you@company.com' },
  a11y: { name: 'Your name', service: 'Service', budget: 'Estimated budget (USD)', idea: 'About the project', email: 'Your email' },
  send: 'Send',
  sending: 'Sending…',
  call: 'Prefer a call?',
  callLink: 'Book a free call',
};

const ES: typeof EN = {
  label: 'Cuéntanos de tu proyecto',
  parts: {
    hi: 'Hola Mattriz, soy',
    help: 'y busco ayuda con',
    budget: '. Mi presupuesto es de',
    idea: '. La idea:',
    reach: '. Me pueden escribir a',
  },
  ph: { name: 'tu nombre', idea: 'unas palabras sobre el proyecto', email: 'tu@empresa.com' },
  a11y: { name: 'Tu nombre', service: 'Servicio', budget: 'Presupuesto estimado (USD)', idea: 'Sobre el proyecto', email: 'Tu correo' },
  send: 'Enviar',
  sending: 'Enviando…',
  call: '¿Prefieres una llamada?',
  callLink: 'Agenda una llamada gratis',
};

export const footerForm = (lang: Lang) => (lang === 'es' ? ES : EN);
