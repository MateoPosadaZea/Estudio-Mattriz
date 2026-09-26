// Rutas de las páginas de proyecto (las mismas en /project/ y /es/project/).
import type { Dict } from '../components/project/translate';

const models = import.meta.glob('./projects/*.json', { eager: true }) as Record<string, { default: any }>;
const dicts = import.meta.glob('./projects/i18n/*.json', { eager: true }) as Record<string, { default: Dict }>;

const slugOf = (path: string) => path.split('/').pop()!.replace('.json', '');

export const PROJECT_SLUGS = Object.keys(models).map(slugOf);

export const projectPaths = () =>
  Object.entries(models).map(([path, mod]) => {
    const slug = slugOf(path);
    return { params: { slug }, props: { slug, model: mod.default, dict: dicts[`./projects/i18n/${slug}.json`]?.default } };
  });
