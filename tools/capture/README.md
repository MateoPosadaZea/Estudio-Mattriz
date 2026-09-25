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
