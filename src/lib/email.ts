// Correo de aviso interno (formulario de contacto y pedido del escáner) con la marca de Mattriz.
// HTML de tablas con estilos en línea, que es lo único que Gmail, Outlook y Apple Mail respetan igual.
// Blanco y negro; el verde de marca solo en la etiqueta de arriba.

export type EmailField = { label: string; value: string; href?: string };

export type LeadEmail = {
  /** Etiqueta verde de arriba ("Nuevo proyecto"). */
  tag: string;
  /** Titular grande. */
  title: string;
  /** Texto largo destacado (la idea del cliente o el resumen del escaneo). */
  message?: string;
  messageLabel?: string;
  fields: EmailField[];
  /** Botones: el primero negro, el resto con borde. */
  actions: { label: string; href: string }[];
  /** Línea pequeña del pie (origen y fecha). */
  footer: string;
};

const LOGO = 'https://mattriz.com/images/logo-mattriz.png';
const SANS = "'Helvetica Neue', Helvetica, Arial, sans-serif";
const SERIF = "Georgia, 'Times New Roman', serif";

export function esc(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]!);
}

const br = (s: string) => esc(s).replace(/\n/g, '<br>');

export function renderLeadEmail(e: LeadEmail): { html: string; text: string } {
  const fields = e.fields
    .filter((f) => f.value)
    .map(
      (f) => `
        <tr>
          <td style="padding:14px 0;border-top:1px solid #e6e6e3;font:13px/1.4 ${SANS};color:#77776f;width:38%;vertical-align:top">${esc(f.label)}</td>
          <td style="padding:14px 0;border-top:1px solid #e6e6e3;font:15px/1.45 ${SANS};color:#0a0a0a;vertical-align:top">${
            f.href ? `<a href="${esc(f.href)}" style="color:#0a0a0a;text-decoration:underline">${br(f.value)}</a>` : br(f.value)
          }</td>
        </tr>`,
    )
    .join('');

  const actions = e.actions
    .map((a, i) =>
      i === 0
        ? `<a href="${esc(a.href)}" style="display:inline-block;margin:0 8px 8px 0;padding:13px 22px;border-radius:999px;background:#0a0a0a;color:#ffffff;font:15px/1 ${SANS};text-decoration:none">${esc(a.label)}</a>`
        : `<a href="${esc(a.href)}" style="display:inline-block;margin:0 8px 8px 0;padding:12px 21px;border-radius:999px;border:1px solid #0a0a0a;color:#0a0a0a;font:15px/1 ${SANS};text-decoration:none">${esc(a.label)}</a>`,
    )
    .join('');

  const message = e.message
    ? `
        <tr><td style="padding:28px 0 6px;font:13px/1.4 ${SANS};color:#77776f">${esc(e.messageLabel || '')}</td></tr>
        <tr><td style="padding:0 0 28px;font:20px/1.5 ${SERIF};color:#0a0a0a">${br(e.message)}</td></tr>`
    : '';

  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:#f2f2ef">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2ef">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:20px">
        <tr><td style="padding:32px 36px 0">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr>
            <td><img src="${LOGO}" width="34" height="28" alt="Mattriz" style="display:block;border:0"></td>
            <td align="right"><span style="display:inline-block;padding:6px 12px;border-radius:999px;background:#00ff7f;color:#0a0a0a;font:600 12px/1 ${SANS};letter-spacing:.02em">${esc(e.tag)}</span></td>
          </tr></table>
        </td></tr>
        <tr><td style="padding:36px 36px 0;font:32px/1.15 ${SERIF};color:#0a0a0a;letter-spacing:-.01em">${esc(e.title)}</td></tr>
        <tr><td style="padding:0 36px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${message}</table>
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">${fields}</table>
        </td></tr>
        <tr><td style="padding:28px 36px 12px">${actions}</td></tr>
        <tr><td style="padding:12px 36px 32px;font:12px/1.5 ${SANS};color:#9a9a92">${esc(e.footer)}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;

  const text = [
    e.title,
    e.message ? `\n${e.messageLabel}:\n${e.message}` : '',
    ...e.fields.filter((f) => f.value).map((f) => `\n${f.label}: ${f.value}`),
    `\n${e.footer}`,
  ].join('\n');

  return { html, text };
}

/** Fecha y hora de Bogotá para el pie del correo. */
export function bogotaNow() {
  return new Intl.DateTimeFormat('es-CO', { dateStyle: 'long', timeStyle: 'short', timeZone: 'America/Bogota' }).format(new Date());
}

/** Enlace de WhatsApp a partir de lo que escribió la persona. Sin indicativo: 10 dígitos que empiezan
 *  por 3 son un celular de Colombia (+57); otros 10 dígitos, un número de EE. UU. (+1). */
export function whatsappLink(phone: string) {
  let digits = phone.replace(/\D/g, '');
  if (digits.length < 7) return '';
  if (!phone.trim().startsWith('+') && digits.length === 10) digits = (digits.startsWith('3') ? '57' : '1') + digits;
  return `https://wa.me/${digits}`;
}

/** Respuesta automática a quien escribe desde el formulario, en su idioma y firmada por Mateo.
 *  No repite lo que la persona escribió (solo su primer nombre, recortado): así nadie puede usar el
 *  formulario para mandar texto arbitrario desde mattriz.com a la dirección de otra persona. */
export function renderAutoReply(lang: 'en' | 'es', fullName: string): { subject: string; html: string; text: string } {
  const name = (fullName.trim().split(/\s+/)[0] || '').replace(/[^\p{L}\p{M}'-]/gu, '').slice(0, 30);
  const es = lang === 'es';
  const work = es ? 'https://mattriz.com/es/#projects' : 'https://mattriz.com/#projects';
  const subject = es ? `Recibimos tu mensaje${name ? `, ${name}` : ''}` : `We got your message${name ? `, ${name}` : ''}`;
  const paras = es
    ? [
        `Hola${name ? `, ${name}` : ''}:`,
        'Gracias por escribirnos. Tu mensaje ya nos llegó y lo vamos a leer con calma.',
        'Te respondemos personalmente a este mismo correo. Si quieres adelantar algo, como referencias, enlaces o un documento, puedes responder aquí mismo.',
      ]
    : [
        `Hi${name ? ` ${name}` : ''},`,
        'Thanks for reaching out. Your message came through and we’ll read it carefully.',
        'We’ll reply personally to this same email. If you’d like to share anything else, like references, links or a brief, just reply here.',
      ];
  const workLine = es ? ['Mientras tanto, puedes ver algunos de nuestros proyectos en ', 'mattriz.com'] : ['In the meantime, you can see some of our work at ', 'mattriz.com'];
  const sign = es ? 'Un saludo,' : 'Best,';
  const tagline = es ? 'Mattriz · Desde Bogotá, para clientes en todo el mundo' : 'Mattriz · Based in Bogotá, working worldwide';

  const p = (html: string) => `<tr><td style="padding:0 0 18px;font:16px/1.6 ${SANS};color:#0a0a0a">${html}</td></tr>`;
  const html = `<!doctype html>
<html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="color-scheme" content="light only"></head>
<body style="margin:0;padding:0;background:#f2f2ef">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f2f2ef">
    <tr><td align="center" style="padding:32px 16px">
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;background:#ffffff;border-radius:20px">
        <tr><td style="padding:32px 36px 0"><img src="${LOGO}" width="34" height="28" alt="Mattriz" style="display:block;border:0"></td></tr>
        <tr><td style="padding:36px 36px 8px">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
            ${paras.map((t) => p(esc(t))).join('')}
            ${p(`${esc(workLine[0])}<a href="${work}" style="color:#0a0a0a;text-decoration:underline">${workLine[1]}</a>.`)}
            <tr><td style="padding:8px 0 0;font:16px/1.6 ${SANS};color:#0a0a0a">${sign}</td></tr>
            <tr><td style="padding:2px 0 0;font:24px/1.3 ${SERIF};color:#0a0a0a">Mateo</td></tr>
          </table>
        </td></tr>
        <tr><td style="padding:20px 36px 32px;font:12px/1.5 ${SANS};color:#9a9a92">${esc(tagline)}</td></tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
  const text = [...paras, `${workLine[0]}${work}.`, `${sign}\nMateo`, tagline].join('\n\n');
  return { subject, html, text };
}
