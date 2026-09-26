// v2: casos de las páginas de proyecto antiguas (2021–2022: Posada Carcamo, Let it Go, AGL Vans
// Tours, Luciana Cabañas). Su estructura es otra: titular en h2, botón al sitio, imagen de fondo a
// pantalla completa, y tres etiquetas ("Servicios", "Resumen del proyecto", "Lo que hicimos").
// Se leen del modelo original (etiquetas en español, estables) y el contenido del traducido.
import { plain } from './extract';
import type { CaseBlock, CaseDoc, CaseMedia } from './doc';
import type { Lang } from '../../i18n';

export type LegacyBlock = { section: 'summary' | 'whatwedid' } | { media: number[]; layout: 'full' | 'pair' | 'trio' | 'inset' | 'wide'; parallax?: boolean };

export type LegacyCase = {
  legacy: true;
  name: string;
  theme: 'dark' | 'light';
  bg?: string;
  accent: string;
  onAccent: string;
  hero: number;
  flow: LegacyBlock[];
  /** Texto sobre el dominio al final (por defecto "Visita el sitio en vivo"). */
  siteLabel?: Record<Lang, string>;
};

type Node = any;

/** Recorre filas y elementos en orden; las imágenes/videos de fondo de fila cuentan como media. */
function flatten(rows: Node[]): Node[] {
  const out: Node[] = [];
  const walk = (n: Node) => {
    if (Array.isArray(n)) return n.forEach(walk);
    if (!n || typeof n !== 'object') return;
    if (n.type === 'row') {
      if (n.bgImage?.local) out.push({ type: 'img', local: n.bgImage.local, alt: '' });
      if (n.bgVideo?.local) out.push({ type: 'video', local: n.bgVideo.local });
      return walk(n.cols);
    }
    if (n.type) out.push(n);
    for (const v of Object.values(n)) if (v && typeof v === 'object') walk(v);
  };
  walk(rows);
  return out;
}

const LABELS: Record<string, 'services' | 'summary' | 'whatwedid'> = {
  servicios: 'services',
  'resumen del proyecto': 'summary',
  'lo que hicimos': 'whatwedid',
};

export function fromLegacy(cfg: LegacyCase, orig: any, localized: any, lang: Lang): CaseDoc {
  // La última fila es "Explore More" (marquesina + grilla).
  const a = flatten(orig.rows.slice(0, -1));
  const b = flatten(localized.rows.slice(0, -1));
  const media: CaseMedia[] = [];
  const sections: Record<string, { label: string; html: string }> = {};
  let tagline = '';
  let site: string | undefined;
  let siteLabel = '';
  let current: string | null = null;

  a.forEach((node, i) => {
    const loc = b[i] ?? node;
    if ((node.type === 'img' || node.type === 'video') && node.local) {
      media.push({ type: node.type, local: node.local, alt: loc.alt });
      return;
    }
    if (node.type === 'cta' && !site) {
      site = node.href;
      siteLabel = loc.label;
    }
    if (node.type !== 'html' && node.type !== 'list') return;
    if (!tagline && /^<h2>/.test(node.html.trim())) {
      tagline = plain(loc.html);
      return;
    }
    const key = LABELS[plain(node.html).toLowerCase().replace(/\s+/g, ' ').trim()];
    if (key) {
      current = key;
      sections[key] = { label: plain(loc.html), html: '' };
      return;
    }
    if (current) sections[current].html += loc.html;
  });

  const services = (sections.services?.html ?? '')
    .split(/<br\s*\/?>|<\/li>|<\/p>/i)
    .map((s) => plain(s))
    .filter(Boolean);
  const steps = [...(sections.whatwedid?.html ?? '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, li]) => ({ term: plain(li), desc: '' }));

  const blocks: CaseBlock[] = cfg.flow.map((f): CaseBlock => {
    if ('media' in f) return { kind: 'media', layout: f.layout, parallax: f.parallax, items: f.media.map((i) => media[i]).filter(Boolean) };
    if (f.section === 'summary') return { kind: 'text', label: sections.summary?.label ?? '', html: sections.summary?.html ?? '', style: 'lead', link: site ? { href: site, label: siteLabel } : undefined };
    return { kind: 'list', label: sections.whatwedid?.label ?? '', items: steps };
  });

  return {
    name: cfg.name,
    theme: cfg.theme,
    bg: cfg.bg,
    accent: cfg.accent,
    onAccent: cfg.onAccent,
    metaTitle: localized.title,
    description: localized.description || tagline,
    year: '',
    tagline,
    facts: [
      { label: lang === 'es' ? 'Cliente' : 'Client', value: cfg.name },
      { label: sections.services?.label || (lang === 'es' ? 'Servicios' : 'Services'), chips: services },
    ],
    hero: media[cfg.hero],
    blocks,
    site,
    siteLabel: cfg.siteLabel?.[lang],
  };
}

/** Lista de media en orden (para armar la configuración de cada caso). */
export const legacyMedia = (orig: any) => flatten(orig.rows.slice(0, -1)).filter((n) => (n.type === 'img' || n.type === 'video') && n.local);
