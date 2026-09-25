import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://mattriz.com',
  // WordPress sirve todas las páginas con barra final (/about/). Se conserva igual.
  build: { format: 'directory' },
  trailingSlash: 'ignore',
});
