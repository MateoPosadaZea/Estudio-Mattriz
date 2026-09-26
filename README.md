# mattriz.com

Sitio del estudio Mattriz: port de WordPress (Salient) a **Astro** estático, desplegado en **Cloudflare Workers** (assets estáticos, `wrangler.jsonc`). Paridad visual con el sitio vivo; ver el brief del proyecto y `reference/`.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera dist/
npm run preview   # sirve dist/
```

Cloudflare (Workers Builds, conectado al repo): build `npm run build`, deploy `npx wrangler deploy`; las ramas que no son `main` suben una versión con URL de preview (`npx wrangler versions upload`).

| Carpeta | Contenido |
|---|---|
| `src/styles/` | `tokens.css` (medidos del vivo), `fonts.css`, `global.css` |
| `src/components/` | Header, menú mobile, footer, gradiente animado |
| `src/scripts/` | Menú mobile, gradiente animado (ruido simplex) |
| `public/` | Fuentes, logo, favicons |
| `reference/` | Captura del sitio vivo (Fase 0): URLs, tokens, capturas, interacciones |
| `tools/capture/` | Scripts de Playwright para capturar y comparar contra el vivo |

Pendientes y decisiones abiertas: `reference/FASE-0-RESUMEN.md` y `MEJORAS-FUTURAS.md`.
