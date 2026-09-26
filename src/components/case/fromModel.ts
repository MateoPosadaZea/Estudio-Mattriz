// v2: arma un CaseDoc a partir del modelo del proyecto (mismo contenido que el vivo) y de la
// puesta en página definida en src/data/cases.ts.
import { extractCase, plain } from './extract';
import type { CaseBlock, CaseDoc } from './doc';
import type { ModelCase } from '../../data/cases';
import { category, type Lang } from '../../i18n';

export function fromModel(cfg: ModelCase, orig: any, model: any, lang: Lang): CaseDoc {
  const c = extractCase(orig, model);
  const s = c.sections;
  const label = (key: string) => s[key]?.label ?? key;

  // "What we do": cada ítem es "<strong>Término</strong> descripción".
  const items = [...(s['What we do']?.html ?? '').matchAll(/<li>([\s\S]*?)<\/li>/g)].map(([, li]) => {
    const m = li.match(/^\s*<strong>([\s\S]*?)<\/strong>([\s\S]*)$/);
    if (!m) return { term: '', desc: li };
    return { term: plain(m[1]).replace(/[:\s]+$/, ''), desc: m[2].replace(/^\s*:\s*/, '').trim() };
  });

  const blocks: CaseBlock[] = cfg.flow.map((b): CaseBlock => {
    if ('media' in b) return { kind: 'media', layout: b.layout, parallax: b.parallax, items: b.media.map((i) => c.media[i]) };
    switch (b.section) {
      case 'challenge':
        return { kind: 'text', label: label('The Challenge'), html: s['The Challenge']?.html ?? '', style: 'lead', link: c.cta };
      case 'approach':
        return { kind: 'text', label: label('Approach'), html: s['Approach']?.html ?? '', style: 'statement' };
      case 'whatwedo':
        return { kind: 'list', label: label('What we do'), items };
      case 'impact':
        return cfg.stats
          ? { kind: 'stats', label: label('Impact'), stats: cfg.stats[lang], after: s['Impact']?.html }
          : { kind: 'text', label: label('Impact'), html: s['Impact']?.html ?? '', style: 'statement' };
      case 'details':
        return { kind: 'details', cols: ['Services', 'Stack', 'Deliverables', 'Timeline'].filter((k) => s[k]).map((k) => ({ title: s[k].label, html: s[k].html })) };
    }
  });

  return {
    name: cfg.name,
    theme: cfg.theme,
    accent: cfg.accent,
    onAccent: cfg.onAccent,
    metaTitle: model.title,
    description: model.description || c.tagline,
    year: plain(s['Year']?.html ?? ''),
    tagline: c.tagline,
    facts: [
      { label: label('Client'), value: plain(s['Client']?.html ?? '') },
      { label: label('Industry'), value: plain(s['Industry']?.html ?? '') },
      { label: label('What we did'), chips: c.categories.map((cat) => category(cat, lang)) },
    ],
    hero: c.media[cfg.hero],
    blocks,
    site: c.cta?.href,
  };
}
