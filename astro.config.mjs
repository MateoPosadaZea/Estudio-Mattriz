import { defineConfig } from 'astro/config';
import { rename, rm } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

// Cloudflare sirve el 404.html más cercano a la ruta pedida. Astro solo genera /404.html en la raíz;
// la versión en español sale como /es/404/index.html y aquí se mueve a /es/404.html.
const spanish404 = {
  name: 'mattriz-es-404',
  hooks: {
    'astro:build:done': async ({ dir }) => {
      const root = fileURLToPath(dir);
      await rename(`${root}es/404/index.html`, `${root}es/404.html`);
      await rm(`${root}es/404`, { recursive: true });
    },
  },
};

export default defineConfig({
  site: 'https://mattriz.com',
  // WordPress sirve todas las páginas con barra final (/about/). Se conserva igual.
  build: { format: 'directory' },
  trailingSlash: 'ignore',
  integrations: [spanish404],
});
