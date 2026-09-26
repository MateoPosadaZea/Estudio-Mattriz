// Proyectos en dos idiomas: el modelo guarda el texto original (español o inglés, según el vivo) y
// src/data/projects/i18n/<slug>.json trae la traducción de cada texto al otro idioma.
// Si falta una traducción, el build falla con la lista de textos pendientes (nada queda a medias).
import type { Lang } from '../../i18n';

export type Dict = { source: Lang; strings: Record<string, string> };

const FIELDS: Record<string, string> = { html: 'html', list: 'html', split: 'text', cta: 'label', scrolling: 'text', badge: 'text', img: 'alt' };

export function localizeModel(model: any, dict: Dict | undefined, lang: Lang, slug: string) {
  if (!dict || dict.source === lang) return model;
  const missing: string[] = [];
  const tr = (s: string) => {
    if (!s) return s;
    const out = dict.strings[s];
    if (out === undefined) missing.push(s);
    return out ?? s;
  };
  const walk = (n: any): any => {
    if (Array.isArray(n)) return n.map(walk);
    if (!n || typeof n !== 'object') return n;
    const copy: any = {};
    for (const [k, v] of Object.entries(n)) copy[k] = walk(v);
    const field = FIELDS[n.type];
    if (field && copy[field]) copy[field] = tr(copy[field]);
    return copy;
  };
  const out = { ...model, title: tr(model.title), description: model.description ? tr(model.description) : model.description, rows: walk(model.rows) };
  if (missing.length) throw new Error(`Faltan traducciones (${lang}) en ${slug}:\n${missing.map((m) => '  ' + JSON.stringify(m)).join('\n')}`);
  return out;
}
