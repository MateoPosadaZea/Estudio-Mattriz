# Captura del sitio vivo (Fase 0)

Scripts de Playwright que generan la referencia en `reference/`.

```bash
cd tools/capture
npm install
npm run all        # crawl → tokens → screenshots → interactions
```

| Script | Salida |
|---|---|
| `crawl.mjs` | `reference/URLS.md`, `html/`, `css/`, `static/`, `crawl.json`, `pages.json` |
| `tokens.mjs` | `reference/tokens.json`, `COPY-VIVO.md` |
| `screenshots.mjs` | `reference/screenshots/{desktop,mobile}/` |
| `interactions.mjs` | `reference/interactions.json`, `interactions/` (videos y capturas de estados) |

- `CAPTURE_BASE` cambia el origen (por defecto `https://mattriz.com`). Sirve para comparar el sitio nuevo contra las mismas mediciones.
- `/propuestas/` nunca se descarga (datos de clientes).
- El formulario de contacto se prueba vacío y con los POST bloqueados: no se envía nada.
- Detrás de un proxy de salida, Chromium usa `HTTPS_PROXY` y Node necesita `NODE_USE_ENV_PROXY=1` (ya puesto en los scripts de npm).

## Comparar el sitio nuevo con el vivo

| Script | Uso |
|---|---|
| `measure.mjs <url> <selector> [salida.json]` | Cajas y estilos de cada elemento visible de una región, en 1440 y 390. |
| `compare.mjs <nombre> <url-vivo> <sel-vivo> <url-nuevo> <sel-nuevo>` | Capturas lado a lado en `reference/compare/`. |

Los selectores aceptan el sufijo `@last` (último elemento visible que coincide). Ejemplo, con `npm run preview` corriendo:

```bash
node measure.mjs http://localhost:4321/ '.site-header' /tmp/header-nuevo.json
node compare.mjs footer https://mattriz.com/ '#ajax-content-wrap .row > .wpb_row:not(.inner_row)@last' http://localhost:4321/ '.site-footer'
```
