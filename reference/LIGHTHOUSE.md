# Lighthouse (mobile) — Fase 4

Medido con Lighthouse 12 (móvil, throttling por defecto) sobre `wrangler dev` (mismo runtime que Cloudflare),
con la analítica activa. SEO local da 69 solo por `is-crawlable`: en hosts que no son mattriz.com el Worker
sirve `robots.txt` con `Disallow: /` a propósito; el resto de auditorías de SEO pasan.

| Página | Perf | A11y | Best practices | LCP | CLS |
|---|---|---|---|---|---|
| / | 100 | 100 | 100 | 1.5 s | 0 |
| /about/ | 100 | 100 | 100 | 1.4 s | 0 |
| /contact/ | 100 | 100 | 100 | 1.7 s | 0 |
| /project/civilus/ | 100 | 100 | 100 | 1.7 s | 0 |
| /project/the-grid/ | 98 | 100 | 100 | 2.4 s | 0 |
| /project/spot-on-mobile-wash-detailing/ | 96 | 100 | 100 | 2.7 s | 0 |
| /project/posada-carcamo-abogados/ | 99 | 100 | 100 | 2.2 s | 0 |
| /project/let-it-go/ | 100 | 100 | 100 | 1.7 s | 0 |
| /project/aglvanstours/ | 97 | 100 | 100 | 2.6 s | 0 |
| /project/luciana-cabanas/ | 98 | 100 | 100 | 2.4 s | 0 |

Referencia del vivo (WordPress, mismo día, misma herramienta): performance entre 38 y 84, best practices 79,
LCP de 3.2 a 6.2 s, TBT de hasta 6.6 s en Spot On.

`/work/spot-on/case-study.html` es una copia exacta del archivo del vivo (perf 68: carga Google Fonts y un PNG
de 780 KB). No se tocó porque el brief pide conservarlo; optimizarlo es un cambio aparte.
