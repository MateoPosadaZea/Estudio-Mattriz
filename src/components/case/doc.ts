// v2: forma común de un caso de estudio. La vista (src/views/CaseStudy.astro) solo dibuja esto.
// Un caso puede venir del modelo del proyecto (The Grid, src/components/case/fromModel.ts)
// o escribirse a mano en src/data/cases/<caso>.ts (Spot On).

export type CaseMedia = { type: 'img' | 'video'; local: any; alt?: string; caption?: string };

export type Fact = { label: string; value?: string; chips?: string[] };

export type Item = { term: string; desc: string };

export type CaseBlock =
  /** Texto con etiqueta numerada. lead: párrafos medianos · statement: frase grande en Noe Display. */
  | { kind: 'text'; label: string; title?: string; html: string; style?: 'lead' | 'statement'; bullets?: string[]; link?: { href: string; label: string } }
  /** Lista numerada a todo el ancho (término + descripción). */
  | { kind: 'list'; label: string; title?: string; intro?: string; items: Item[] }
  /** Tarjetas en grilla (término + descripción). */
  | { kind: 'cards'; label: string; title?: string; intro?: string; items: Item[] }
  /** Cifras grandes, con texto antes y una cita o lista después. */
  | { kind: 'stats'; label: string; title?: string; intro?: string; stats: { value: string; label: string }[]; after?: string; quote?: string }
  /** Cronología: fecha, hito y detalle. */
  | { kind: 'timeline'; label: string; title?: string; items: { date: string; title: string; text: string }[] }
  /** Columnas de detalle sin numerar (servicios, herramientas, entregables…). */
  | { kind: 'details'; cols: { title: string; html: string }[] }
  /** Llamado final con enlace. */
  | { kind: 'cta'; title: string; text: string; link: { href: string; label: string } }
  | { kind: 'media'; layout: 'full' | 'pair' | 'trio' | 'inset' | 'wide'; items: CaseMedia[]; parallax?: boolean };

export type CaseDoc = {
  name: string;
  theme: 'dark' | 'light';
  /** Fondo de la página; por defecto negro (dark) o blanco (light). */
  bg?: string;
  accent: string;
  /** Color del texto sobre el acento (bloque "Siguiente proyecto"). */
  onAccent: string;
  metaTitle: string;
  /** Imagen para redes (por defecto la del sitio). */
  ogImage?: string;
  description: string;
  year: string;
  tagline: string;
  intro?: string;
  facts: Fact[];
  hero: CaseMedia;
  blocks: CaseBlock[];
  site?: string;
  siteLabel?: string;
};
