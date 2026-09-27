// v2: caso de estudio del Dr. Daniel de Zubiría (2026), escrito a mano.
//
// BORRADOR: todavía no está registrado en src/data/cases.ts (MANUAL_CASES) ni en la lista de
// proyectos, así que no se publica. Falta, cuando haya acceso a drdanieldezubiria.com:
// - Confirmar el nombre exacto (con o sin tilde) y la especialidad del doctor.
// - Capturas (escritorio 2x, celular 3x), video de la navegación para la portada y el hero, y los
//   colores de la marca (bg / accent / onAccent).
// - Resultados: solo con datos reales (Cloudflare Analytics, Search Console, PageSpeed, Google
//   Business). No se afirma ningún número de citas atribuibles al sitio: no se puede medir.
// - Testimonio del doctor (pedido; todavía no hay).
// Texto: lo que hizo el estudio según Mateo (27 de septiembre de 2026). Sin rayas largas.

import type { Lang } from '../../i18n';
import type { CaseDoc } from '../../components/case/doc';

const TEXT = {
  en: {
    metaTitle: 'Dr. Daniel de Zubiría Case Study | Mattriz Studio',
    description:
      'Brand identity, an 11-page website, technical SEO, online scheduling and local presence for a medical practice, built in July 2026.',
    tagline: 'A doctor’s brand, website and local presence, built in one month.',
    intro:
      'In July 2026 we built the complete digital presence of Dr. Daniel de Zubiría’s practice: a visual identity, an 11-page website with his own medical content, online scheduling and a verified Google Business profile. Live since late July.',
    facts: [
      { label: 'Client', value: 'Dr. Daniel de Zubiría' },
      { label: 'Project', value: 'July 2026' },
      { label: 'Live since', value: 'Late July 2026' },
    ],
    brief: {
      label: 'The brief',
      title: 'Everything a practice needs to be found, trusted and booked.',
      html:
        '<p>A doctor’s website isn’t a brochure. It has to explain conditions in plain language, show up when a patient searches for them, and turn that visit into an appointment without friction. And it has to look like a practice you would trust with your health.</p><p>So the work covered the whole chain: the brand, the site and its content, the technical SEO, the scheduling and the local presence on Google.</p>',
    },
    work: {
      label: 'What we did',
      title: 'From the logo to the appointment.',
      items: [
        { term: 'Visual identity', desc: 'A typographic logo with a system of three versions, colour palette, type system, brand manual and print-ready files with vectorised strokes.' },
        { term: 'Website design & development', desc: 'An 11-page site with light and dark mode, a hand-made generative particle background and smooth scrolling.' },
        { term: 'Content architecture', desc: 'Eight condition pages written with the doctor’s own medical content, a services and procedures section, and a blog.' },
        { term: 'Technical SEO', desc: 'Physician and medical-condition schema, sitemap, Open Graph, Search Console and internal linking between conditions, services and articles.' },
        { term: 'Online scheduling', desc: 'Integration with SaludTools for appointments, with WhatsApp as the next step in a clear conversion hierarchy.' },
        { term: 'Local presence', desc: 'A Google Business Profile created, verified and branded, so the practice shows up where patients look first.' },
        { term: 'Infrastructure', desc: 'Own domain, hosting on Cloudflare Pages and automatic deploys from GitHub: every change goes live in minutes.' },
        { term: 'Brand pieces', desc: 'WhatsApp Business profile and cover, LinkedIn, and logos for the clinical record.' },
      ],
    },
    details: [
      { title: 'Stack', html: '<p>Astro (static site), Cloudflare Pages, deploys from GitHub.</p>' },
      { title: 'Scheduling', html: '<p>SaludTools, with WhatsApp as a secondary channel.</p>' },
      { title: 'Search', html: '<p>Schema.org (Physician and MedicalCondition), sitemap, Open Graph, Search Console and Google Business Profile.</p>' },
    ],
    cta: {
      title: 'A practice that deserves to be found?',
      text: 'We build the brand, the site and the path from search to appointment, and keep it running every month. That’s what Mattriz does.',
    },
  },
  es: {
    metaTitle: 'Caso de estudio Dr. Daniel de Zubiría | Mattriz Studio',
    description:
      'Identidad visual, sitio web de 11 páginas, SEO técnico, agendamiento en línea y presencia local para un consultorio médico, hecho en julio de 2026.',
    tagline: 'La marca, el sitio y la presencia local de un médico, en un mes.',
    intro:
      'En julio de 2026 construimos la presencia digital completa del consultorio del Dr. Daniel de Zubiría: identidad visual, un sitio de 11 páginas con su propio contenido médico, agendamiento en línea y un perfil de Google Business verificado. En línea desde finales de julio.',
    facts: [
      { label: 'Cliente', value: 'Dr. Daniel de Zubiría' },
      { label: 'Proyecto', value: 'Julio de 2026' },
      { label: 'En línea desde', value: 'Finales de julio de 2026' },
    ],
    brief: {
      label: 'El encargo',
      title: 'Todo lo que un consultorio necesita para que lo encuentren, confíen y agenden.',
      html:
        '<p>El sitio de un médico no es un folleto. Tiene que explicar condiciones en lenguaje claro, aparecer cuando un paciente las busca y convertir esa visita en una cita sin fricción. Y tiene que verse como un consultorio al que uno le confiaría su salud.</p><p>Por eso el trabajo cubrió toda la cadena: la marca, el sitio y su contenido, el SEO técnico, el agendamiento y la presencia local en Google.</p>',
    },
    work: {
      label: 'Lo que hicimos',
      title: 'Del logotipo a la cita.',
      items: [
        { term: 'Identidad visual', desc: 'Logotipo tipográfico con un sistema de tres versiones, paleta, sistema tipográfico, manual de marca y archivos de imprenta con trazos vectorizados.' },
        { term: 'Diseño y desarrollo web', desc: 'Un sitio de 11 páginas con modo claro y oscuro, un fondo generativo de partículas hecho a mano y scroll suave.' },
        { term: 'Arquitectura de contenido', desc: 'Ocho páginas de condiciones con el contenido médico del propio doctor, una sección de servicios y procedimientos, y un blog.' },
        { term: 'SEO técnico', desc: 'Schema de médico y de condiciones, sitemap, Open Graph, Search Console y enlaces internos entre condiciones, servicios y artículos.' },
        { term: 'Agendamiento en línea', desc: 'Integración con SaludTools para las citas, con WhatsApp como siguiente paso en una jerarquía de conversión clara.' },
        { term: 'Presencia local', desc: 'Perfil de Google Business creado, verificado y con la marca aplicada, para que el consultorio aparezca donde los pacientes buscan primero.' },
        { term: 'Infraestructura', desc: 'Dominio propio, hosting en Cloudflare Pages y deploy automático desde GitHub: cada cambio sale en vivo en minutos.' },
        { term: 'Piezas de marca', desc: 'Perfil y portada de WhatsApp Business, LinkedIn y logos para la historia clínica.' },
      ],
    },
    details: [
      { title: 'Tecnología', html: '<p>Astro (sitio estático), Cloudflare Pages, deploy desde GitHub.</p>' },
      { title: 'Agendamiento', html: '<p>SaludTools, con WhatsApp como canal secundario.</p>' },
      { title: 'Búsqueda', html: '<p>Schema.org (Physician y MedicalCondition), sitemap, Open Graph, Search Console y Google Business Profile.</p>' },
    ],
    cta: {
      title: '¿Un consultorio que merece que lo encuentren?',
      text: 'Construimos la marca, el sitio y el camino de la búsqueda a la cita, y lo mantenemos funcionando mes a mes. Eso es lo que hace Mattriz.',
    },
  },
};

// Pendiente: hero y bloques de media (capturas y video), y colores de la marca.
export function drDanielDeZubiria(lang: Lang): Omit<CaseDoc, 'hero'> {
  const t = TEXT[lang];
  return {
    name: 'Dr. Daniel de Zubiría',
    theme: 'dark',
    accent: '#ffffff',
    onAccent: '#0a0a0a',
    metaTitle: t.metaTitle,
    description: t.description,
    year: '2026',
    tagline: t.tagline,
    intro: t.intro,
    facts: t.facts,
    site: 'https://drdanieldezubiria.com/',
    blocks: [
      { kind: 'text', style: 'lead', ...t.brief },
      { kind: 'cards', ...t.work },
      { kind: 'details', cols: t.details },
      { kind: 'cta', ...t.cta, link: { href: 'mailto:contacto@mattriz.com', label: 'contacto@mattriz.com' } },
    ],
  };
}
