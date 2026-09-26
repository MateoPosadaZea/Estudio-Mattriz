// v2: arma el caso de estudio a partir del modelo del proyecto (el mismo JSON que usa la página
// de paridad), sin duplicar textos. Las etiquetas de sección se leen del modelo original (claves
// estables en inglés) y el contenido del modelo ya traducido: los dos tienen la misma estructura.

export type CaseMedia = { type: 'img' | 'video'; local: any; alt?: string };

export type CaseContent = {
  tagline: string;
  categories: string[];
  cta?: { href: string; label: string };
  /** Clave en inglés (Year, Client, The Challenge, Approach…) → { etiqueta traducida, html }. */
  sections: Record<string, { label: string; html: string }>;
  media: CaseMedia[];
};

const flatten = (n: any, out: any[] = []): any[] => {
  if (Array.isArray(n)) n.forEach((x) => flatten(x, out));
  else if (n && typeof n === 'object') {
    if (n.type && n.type !== 'row') out.push(n);
    for (const v of Object.values(n)) if (v && typeof v === 'object') flatten(v, out);
  }
  return out;
};

const headingOf = (html?: string) => html?.match(/^<h[56]>(?:<strong>)?(.*?)(?:<\/strong>)?<\/h[56]>$/)?.[1]?.trim();
const text = (html: string) => html.replace(/<[^>]+>/g, '').replace(/&amp;/g, '&').trim();

export function extractCase(orig: any, localized: any): CaseContent {
  // La última fila es "Explore More" (marquesina + grilla): no forma parte del caso.
  const a = flatten(orig.rows.slice(0, -1));
  const b = flatten(localized.rows.slice(0, -1));
  const out: CaseContent = { tagline: '', categories: [], sections: {}, media: [] };
  let current: string | null = null;

  a.forEach((node, i) => {
    const loc = b[i];
    if (node.type === 'split' && !out.tagline) out.tagline = loc.text;
    else if (node.type === 'meta' && !out.categories.length) out.categories = node.items.map((it: any) => it.label);
    else if (node.type === 'cta' && !out.cta) out.cta = { href: node.href, label: loc.label };
    else if ((node.type === 'img' || node.type === 'video') && node.local) out.media.push({ type: node.type, local: node.local, alt: loc.alt });
    else if (node.type === 'html' || node.type === 'list') {
      const key = headingOf(node.html);
      if (key) {
        current = key.replace(/^What We Do$/, 'What we do');
        if (!out.sections[current]) out.sections[current] = { label: text(loc.html), html: '' };
        else current = null; // Etiqueta repetida (p. ej. "Year" en otra fila): se ignora.
        return;
      }
      if (/^<h3>/.test(node.html)) return; // Nombre del cliente repetido en la columna fija.
      if (current && out.sections[current]) out.sections[current].html += loc.html;
    }
  });

  return out;
}

export const plain = text;
