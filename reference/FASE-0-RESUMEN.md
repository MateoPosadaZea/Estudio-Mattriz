# Fase 0: resumen y punto de parada

Captura del sitio vivo mattriz.com del 2026-09-25. **La Fase 1 no arranca hasta que Mateo apruebe este resumen y resuelva las decisiones abiertas.**

Entregables:

| Archivo | Contenido |
|---|---|
| `reference/URLS.md` | Inventario de URLs, estado, título, robots, tipo, canónico |
| `reference/html/`, `reference/css/` | HTML renderizado de 21 URLs y 33 hojas de estilo |
| `reference/static/work/spot-on/img/` | Las 4 imágenes del caso de Spot On |
| `reference/TOKENS.md`, `src/styles/tokens.css` | Colores, tipografía, layout y componentes |
| `reference/screenshots/{desktop,mobile}/` | Cada página completa a 1440 y 390, más la home por secciones |
| `reference/INTERACCIONES.md` | Animaciones, header, menú, hover, foco, formularios, embeds, analítica |
| `reference/COPY-VIVO.md` | Texto vivo por sección de cada página |
| `tools/capture/` | Scripts de Playwright para repetir la captura (`npm run all`) |

---

## 1. Páginas

**18 URLs responden 200**, todas en WordPress salvo el caso de Spot On:

| Grupo | URLs | Indexadas |
|---|---|---|
| Principales | `/`, `/about/`, `/contact/` | sí |
| Proyectos (portfolio) | `/project/civilus/`, `/project/spot-on-mobile-wash-detailing/`, `/project/the-grid/`, `/project/luciana-cabanas/`, `/project/aglvanstours/`, `/project/let-it-go/`, `/project/posada-carcamo-abogados/` | sí |
| Categorías de proyecto | `/project-type/brand-identity/`, `/project-type/web-development/`, `/project-type/ui-ux-design/`, `/project-type/seo-optimization/` | sí |
| WooCommerce | `/tienda/` (vacía), `/carrito/` y `/finalizar-compra/` (muestran el shortcode crudo `[woocommerce_cart]` / `[woocommerce_checkout]`) | sí |
| Estático | `/work/spot-on/case-study.html` | **no** (`noindex, nofollow`) |

Problemas encontrados en el sitio vivo:
- **`/work/` responde 403.** Está en el sitemap como página de WordPress, pero la carpeta física `/work/` (donde vive el caso de Spot On) la tapa. Hoy nadie puede verla.
- **Enlaces rotos (404):** `/trabajos/` (enlazado desde About, botones "View our work" y "Explore our work") y `/project/gravity-font/` (enlazado desde la página de Posada Carcamo).
- **Canónico:** `https://mattriz.com/` (sin www). `https://www.mattriz.com/` redirige con 301 a la versión sin www. Se mantiene así. Las variantes `http://` no se pudieron verificar desde este entorno (el proxy bloquea http plano); se verifican en el cutover.
- **El plugin de SEO es All in One SEO (AIOSEO 5.0.2), no Rank Math.** El sitemap es `/sitemap.xml` (`/sitemap_index.xml` redirige ahí con 302).
- `robots.txt` apunta a `/sitemap.xml` y `/sitemap.rss`.

### `/propuestas/`
Responde **403 sin listado de directorio**. No se puede inventariar desde afuera sin adivinar nombres de archivo, y no lo hice. **Se necesita un listado desde el hosting** (administrador de archivos o FTP). No se copió nada.

---

## 2. Fuentes

| Fuente | Uso | Origen | Licencia |
|---|---|---|---|
| **Noe Display** (1 cara: 500) | H1 de la home, About y Contact | Autohospedada con el plugin *Use Any Font* | **Comercial (Schick Toikka). No hay licencia web evidente.** |
| **Maison Neue** Light 300, Book 400, Bold 700 | Todo el resto del texto | Autohospedada con *Use Any Font* | **Comercial (Milieu Grotesque). No hay licencia web evidente.** |
| Playfair Display, Inter | Solo el caso de Spot On | Google Fonts | Libre (OFL) |
| icomoon, FontAwesome, nectar-brands | Iconos del theme Salient | Theme | Viene con Salient; no se migra |

Según el brief, **no las autohospedo hasta que haya licencia confirmada**. Detalle técnico: el H1 pide peso 600 sobre un archivo de peso 500, así que la negrita que se ve hoy la **sintetiza el navegador**.

---

## 3. Interacciones detectadas

1. Hero: revelado letra por letra desde abajo, ~1.2 s por letra, escalonado de 27 ms, solo en desktop.
2. ⚠️ Gradientes animados (canvas) continuos en el hero, en el bloque "One studio" y en el CTA/footer.
3. ⚠️ Los 5 títulos de "What we build" repiten el revelado letra por letra al hacer scroll.
4. ⚠️ Texto de "One studio" con opacidad atada al scroll (palabra por palabra, de 0.2 a 1).
5. ⚠️ Marquesina doble infinita (30 s por ciclo, direcciones opuestas).
6. Fade-in desde abajo en filas de servicios y proyectos. Divisores animados.
7. Carrusel de testimonios (Flickity).
8. Header fijo en píldora: no cambia al hacer scroll.
9. Menú mobile: panel desde la derecha, 0.8 s.
10. Hover con *text reveal* en el menú; relleno negro en botones y filas de proyectos; preview de imagen/video en filas de proyectos.
11. Formulario WPForms en `/contact/` (6 campos + honeypot) y enlaces a Calendly.
12. Analítica: GTM `GTM-WWG3RJFC` + Google tag `GT-T5MFXVLQ` en WordPress; GA4 `G-6CMGETX7FE` en el caso de Spot On.

Detalle completo en `INTERACCIONES.md`.

---

## 4. Diferencias entre el copy vivo y el brief (sección 4)

| Sección | Copy vivo | Brief | ¿Coincide? |
|---|---|---|---|
| Title / description | Iguales al brief | | ✅ |
| og:site_name | "Mattriz Studio - Booking, payments and operations systems for service businesses" | "Mattriz" | ❌ |
| H1 | "Systems that work while you sleep." | Igual, con `while you sleep.` en **itálica** | ⚠️ El vivo **no tiene itálica**, y Noe Display solo tiene la cara regular 500. La itálica sale del lenguaje del caso de Spot On (Playfair itálica). |
| Subtítulo | Igual | | ✅ |
| Botón principal | **"See how we work"** → `#how-we-work` (bloque "One studio") | **"See how it works"** → caso de Spot On | ❌ |
| Segundo botón del hero | No existe | "Let's talk" si existe | ✅ (no se agrega) |
| What we build | Mismos 5 servicios, **numerados 01–05** en el diseño | Igual | ⚠️ El servicio 2 tiene raya larga: "Square, Stripe, Wompi — integrated…" → brief: "Square, Stripe, Wompi. Integrated…". La numeración se mantiene porque el diseño la tiene. |
| Work | **"Selected Work"**: lista de 7 proyectos que enlazan a `/project/…`. La fila de Spot On va a `/project/spot-on-mobile-wash-detailing/`, no al caso. | Bloque único "Nº001. Spot On Mobile Detailing" + "Read the case" | ❌ Estructura distinta. |
| Studio | "One studio. Real systems." + "…The site is just the part you see **— behind it,** booking engines…" + botón "Let's talk about your project" (Calendly) + 3 estadísticas (5+ años, 3 clientes activos, 100 % retainer) | "…The site is just the part you see. **Behind it:** booking engines…" | ⚠️ Raya larga. El botón y las estadísticas no están en el brief. |
| Marquesina | "We build digital systems that perform · Webflow · WordPress · Shopify · WooCommerce" / "Web Development · UI/UX · E-commerce · SEO · Automation · Analytics · Retainers" | No aparece | ❌ Copy viejo (el tipo de texto que el brief pide reemplazar). |
| Testimonios | "What clients say": 4 testimonios (José Suárez, Carlos Posada, Daniela Barrios, Nicolás Galvis). Uno tiene raya larga. | No aparece | ❌ |
| CTA final | "Currently accepting new clients" + **"Book a free call"** → Calendly | "Run a service business that runs on you?" + texto + "Let's talk" | ❌ El texto del brief existe hoy **solo en el caso de Spot On**, no en la home. |
| Footer | "© 2026. Mattriz Studio.", contacto@mattriz.com, Instagram, LinkedIn. **Sin teléfono.** | Email + **+57 313 843 3136**; "One studio \| ©2026" solo si existe | ❌ Falta el teléfono. El microcopy "One studio" no existe. |
| Header "Let's talk" | → Calendly | | — |
| Formulario | WPForms: Name, Email, Phone/Whatsapp, "How can we help you?" (Web Design, Ecommerce, SEO, Process Automation, Branding), presupuesto, detalles. Botón "Get a proposal". | Mismos campos que el vivo; mensajes de éxito y error del brief | ⚠️ Las opciones del checkbox usan el posicionamiento viejo. |
| About | Copy viejo completo: "We blend design and technology…", "Webflow & WordPress", servicios "Brand Identity & Concept, Web Development, UI/UX Design, SEO & Site Speed". Title: "About Mattriz \| Web Development, SEO & Automation". Equipo: Mateo Posada, Alejandro Ortega. | El brief no trae copy para About | ❌ Sin copy aprobado. |
| Menú | Home, How we work, Projects, Services, Contact | — | — |

---

## 5. Lo que no encaja con el brief

1. **La home viva tiene 7 secciones; el brief describe 6 distintas.** Hero, What we build y Studio coinciden. Selected Work, marquesina, testimonios y "Book a free call" no están en el brief, y "Nº001 Spot On" y el CTA "Run a service business…" no están en la home. Paridad visual y copy del brief se contradicen en esas secciones.
2. **El hero no es el único momento cinético** (ver ⚠️ en la sección 3). Mantener paridad viola la regla de contención; cumplir la regla cambia el diseño.
3. **La itálica del H1** no existe en el vivo, y la fuente actual no tiene cara itálica.
4. **Rank Math → en realidad AIOSEO.** No cambia nada del port, solo la referencia.
5. **El caso de Spot On es crítico pero está en `noindex, nofollow`** y usa otro GA4 (`G-6CMGETX7FE`) y otras fuentes. Se migra tal cual, así que eso se mantiene salvo indicación.
6. **Piso de calidad vs. paridad:** el menú no tiene foco visible, y el texto de About a scroll 0 tiene contraste casi nulo (efecto de opacidad por scroll). Cumplir la sección 6 obliga a tocar ambos.
7. **Repo:** este repo (`Estudio-Mattriz`) tiene una exportación vieja de Webflow (plantilla "Fitus", 2022) que no es el sitio vivo. El brief sugiere un repo nuevo privado `mattriz-web`.

---

## 6. Decisiones abiertas para Mateo (con recomendación)

1. **Fuentes Noe Display y Maison Neue.** ¿Hay licencia web (Schick Toikka / Milieu Grotesque) que cubra autohospedarlas en Cloudflare? *Recomendación:* si hay licencia, subir los mismos `.woff2`. Si no, comprarla antes de la Fase 1; cualquier sustituto rompe la paridad.
2. **Estructura de la home** (paridad vs. brief). *Recomendación:* mantener las 7 secciones vivas y aplicar el copy del brief donde se solapa (hero, servicios, studio). Para Work, marquesina, testimonios y CTA, Mateo elige: (a) dejarlas como están, (b) reemplazarlas por los bloques del brief ("Nº001" y "Run a service business…") con el estilo visual del sitio, o (c) quitarlas.
3. **Interacciones fuera de la regla de contención** (gradientes animados, marquesina, reveal de los títulos de servicios, opacidad por scroll). *Recomendación:* portar los gradientes y la marquesina (son identidad visual), cambiar el reveal de servicios por fade simple y dejar el texto de studio quieto.
4. **Botón del hero:** "See how we work" → `#how-we-work` (vivo) o "See how it works" → caso de Spot On (brief). *Recomendación:* el del brief.
5. **Itálica del H1.** *Recomendación:* quitar la itálica del alcance (no existe hoy) o confirmar que Noe Display Italic está licenciada.
6. **Páginas sin copy nuevo:** About (copy viejo), 7 proyectos, 4 categorías y WooCommerce. *Recomendación:* migrar About y proyectos con su copy actual menos las rayas largas. Redirigir con 301 `/tienda/`, `/carrito/` y `/finalizar-compra/` a `/`, y las 4 `/project-type/…` a `/#work`. Arreglar `/trabajos/` y `/project/gravity-font/`.
7. **`/work/`** (403 hoy). *Recomendación:* 301 a `/#work`.
8. **`/propuestas/`:** se necesita un listado desde el hosting para inventariar.
9. **Analítica:** confirmar qué propiedad GA4 hay detrás de `GT-T5MFXVLQ` y si el GTM `GTM-WWG3RJFC` tiene otras etiquetas. *Recomendación:* portar el mismo snippet de GTM y el Google tag tal cual.
10. **Footer:** ¿se agrega el teléfono +57 313 843 3136 (brief) aunque hoy no está?
11. **CTAs a Calendly:** hoy todos los "Let's talk" y "Book a free call" van a Calendly, no al formulario. *Recomendación:* mantener Calendly (paridad) y el formulario solo en `/contact/`.
12. **Repo:** construir aquí (limpiando la exportación de Webflow) o en uno nuevo `mattriz-web`.
