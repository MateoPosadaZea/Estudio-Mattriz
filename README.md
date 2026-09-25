# mattriz.com

Sitio del estudio Mattriz: port de WordPress (Salient) a **Astro** estático, para desplegar en **Cloudflare Pages**. Paridad visual con el sitio vivo; ver el brief del proyecto y `reference/`.

```bash
npm install
npm run dev       # http://localhost:4321
npm run build     # genera dist/
npm run preview   # sirve dist/
```

| Carpeta | Contenido |
|---|---|
| `src/styles/` | `tokens.css` (medidos del vivo), `fonts.css`, `global.css` |
| `src/components/` | Header, menú mobile, footer, gradiente animado |
| `src/scripts/` | Menú mobile, gradiente animado (ruido simplex) |
| `public/` | Fuentes, logo, favicons |
| `reference/` | Captura del sitio vivo (Fase 0): URLs, tokens, capturas, interacciones |
| `tools/capture/` | Scripts de Playwright para capturar y comparar contra el vivo |

Pendientes y decisiones abiertas: `reference/FASE-0-RESUMEN.md` y `MEJORAS-FUTURAS.md`.
