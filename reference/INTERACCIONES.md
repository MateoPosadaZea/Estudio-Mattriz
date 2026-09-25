# Inventario de interacciones (sitio vivo mattriz.com)

Capturado el 2026-09-25. Datos crudos: `reference/interactions.json`. Videos: `reference/interactions/video/`. Capturas de estados: `reference/interactions/{header,hover,menu-mobile,form}/`.

Las marcas ⚠️ indican elementos que chocan con la regla de contención del brief (sección 5: "la animación del hero es el único momento cinético").

## 1. Hero: entrada del titular

- **Tipo:** revelado **letra por letra desde abajo** (Salient `nectar-split-heading`, `data-text-effect="letter-reveal-bottom"`, `data-stagger="true"`). Cada letra es un `<span class="inner">` dentro de un `<span>` por palabra con overflow oculto.
- **Movimiento:** `translateY(1.3em)` → `0` (93.6px → 0 a 72px de fuente). Sin opacidad, sin rotación, sin blur.
- **Tiempos medidos (desktop, 1440):**
  - La animación arranca ~1.6 s después de iniciar la carga (espera fuentes y JS del theme; `data-animation-delay="150"` ms sobre ese punto).
  - Cada letra tarda **~1.2 s** en llegar.
  - Escalonado de **~27 ms por letra** (29 letras: la última empieza ~0.78 s después de la primera).
  - Duración total del titular: ~1.9 s.
  - Curva: ease-out fuerte. Muestras: 16 % recorrido a 240 ms, 81 % a 490 ms, 99 % a 850 ms (compatible con `cubic-bezier(0.2, 0.75, 0.25, 1)` aprox.).
- **Mobile (390):** **sin animación** (`data-m-rm-animation="true"`). El titular aparece estático.
- **Fondo del hero ⚠️:** un **canvas con gradiente animado** (`nectar-animated-gradient`, color `#00ff7f`, `speed: 250`, `blending_mode: organic`) que se mueve de forma continua, con un overlay negro `rgba(0,0,0,.78)` al 80 %. El fondo aparece con `fade-in`.
- **Subtítulo y botón del hero:** no tienen efecto de entrada declarado (`data-text-effect="default"`). El `fade-in` declarado es el del fondo.
- Video: `interactions/video/hero-carga-desktop.webm`, `hero-carga-mobile.webm`.

## 2. Animaciones al hacer scroll

| Sección | Elemento | Efecto | Nota |
|---|---|---|---|
| What we build | 5 títulos de servicio | `letter-reveal-bottom` (mismo efecto del hero) al entrar en pantalla | ⚠️ segundo momento cinético |
| What we build | 5 filas | `fade-in-from-bottom` | |
| What we build | Divisores | Divisor animado del theme (`divider-border` pasa a la clase `completed` al entrar). Dirección no medida: ver video | ⚠️ |
| One studio | Fondo | Canvas con gradiente animado `#000000` → `#00FF7F`, lineal, `speed: 1300` | ⚠️ continuo |
| One studio | Texto grande "Mattriz is a systems studio…" | `scroll-opacity-reveal`: cada palabra pasa de opacidad 0.2 a 1 según el scroll (atado al scroll, no a tiempo) | ⚠️ |
| Selected Work | Filas | `fade-in-from-bottom` | En desktop, al pasar el mouse muestra imagen/video del proyecto (`nectar-lazy-video`) |
| Marquesina | 2 líneas de texto | Desplazamiento infinito, CSS `@keyframes` de **30 s** lineal (~74 px/s). Una línea va de derecha a izquierda, la otra al revés. Texto con contorno (`text_outline`, `thin`) | ⚠️ continuo |
| What clients say | Carrusel | Flickity, con flechas anterior/siguiente | Verificar autoplay en el video |
| CTA / footer | Fondo | Canvas con gradiente animado verde | ⚠️ continuo |

Página About: el primer bloque usa `scroll-opacity-reveal`, así que a scroll 0 el texto se ve casi negro sobre negro (visible en `screenshots/desktop/about.png`). Es el comportamiento vivo.

Caso Spot On (`/work/spot-on/case-study.html`): HTML propio. Elementos `.reveal` con `IntersectionObserver`: `translateY(28px) scale(0.985)` → `0 / 1`, con escalonado de 0.08 s entre hijos (0.05 s, 0.13 s, 0.21 s…).

## 3. Header

- **Posición:** `fixed`, `top: 25px`. Píldora blanca con `border-radius: 50px`.
- **Al hacer scroll:** **no cambia** de color, tamaño ni posición. Solo agrega la clase `scrolled-down`. No se oculta al bajar ni reaparece al subir.
- **Al cargar:** tiene la clase `entrance-animation` del theme. La animación no se midió: revisar en `video/hero-carga-desktop.webm`.
- **Anclas:** `data-animated-anchors="true"`. Los enlaces "How we work", "Projects" y "Services" hacen scroll suave a `#how-we-work`, `#work` y `#services`.
- Capturas: `interactions/header/*-scroll-*.png`.

## 4. Menú mobile (< 1000px)

- **Botón:** "Menu" (texto) junto al botón "Let's talk" dentro de la píldora.
- **Estilo:** `slide-out-from-right` en modo `material`. Panel de 332px de ancho que entra desde la derecha.
- **Transición:** `transform 0.8s cubic-bezier(0.15, 0.2, 0.1, 1)`.
- **Contenido:** Home, How we work, Projects, Services, Contact en `maison-neue-light` 42px blanco.
- **Cierre:** botón "Close Menu" (X).
- Capturas: `interactions/menu-mobile/1-cerrado.png`, `2-abierto.png`, `3-cerrado-de-nuevo.png`. Video: `interactions/video/menu-mobile.webm`.

## 5. Hover y foco

| Elemento | Hover |
|---|---|
| Enlaces del menú y botón "Let's talk" | *Text reveal*: el texto sube (`translateY(-100%)`) y una copia entra desde abajo. `transform 0.55s cubic-bezier(0.25, 1, 0.33, 1)`. Sin cambio de color. |
| Botón del hero ("See how we work") y del studio | La píldora con borde blanco se rellena de negro (`interactions/hover/link-hero-*.png`). |
| Filas de Selected Work (desktop) | Fondo negro, texto blanco, flecha ↗ blanca. `color 0.3s`. |
| Links del footer (Instagram, LinkedIn) | Subrayado permanente. Ver `interactions/hover/footer-link-*.png`. |
| Flechas del carrusel | `opacity/transform 0.45s cubic-bezier(0.25, 1, 0.33, 1)`. |

**Foco con teclado:** el enlace "Skip to main content" y los links de contenido muestran el outline por defecto del navegador. **Los enlaces del menú y el botón "Let's talk" tienen `outline: none` (sin foco visible).** Eso incumple el piso de calidad del brief (sección 6).

## 6. Formularios

**Contacto (`/contact/`), WPForms id 2000**, `novalidate` con validación en JS:

| Campo | Tipo | Obligatorio | Placeholder |
|---|---|---|---|
| Name | text | sí | Full Name |
| Email | email | sí | Email Address |
| Phone / Whatsapp (optional) | text | no | +1 555… / +57 3… |
| How can we help you? | checkboxes: Web Design, Ecommerce, SEO, Process Automation, Branding ("Select all that apply.") | no | |
| Estimated budget (USD) | select: Not sure / want guidance, $500–$1,000, $1,000–$2,500, $2,500–$5,000, $5,000–$10,000, $10,000+ | no | |
| More details about your project | textarea | sí | What are you building? Timeline? Links? Goals? |
| (honeypot) | text oculto `wpforms[hp]` | | |

- Botón: **"Get a proposal"**.
- Validación: debajo de cada campo obligatorio vacío aparece "This field is required." en `#990000`, 14px. Email inválido: "Please enter a valid email address." Capturas: `interactions/form/1-vacio.png`, `2-validacion.png`.
- Anti-spam: honeypot de WPForms y referencias a reCAPTCHA/Turnstile en la página.
- **Mensaje de éxito: no capturado.** No se envió el formulario para no mandar un correo real. Si Mateo lo necesita literal, se copia desde la configuración de WPForms.
- También existe un buscador (`?s=`) oculto en el header de todas las páginas (Salient). No es visible.

## 7. Embeds

- **Calendly:** no está incrustado. Es un **enlace externo** a `https://calendly.com/contacto-mattriz/30min` en el botón "Let's talk" del header, en "Let's talk about your project" (bloque studio) y en "Book a free call" (footer), en todas las páginas.
- No hay iframes.

## 8. Analítica

| Página | Etiquetas |
|---|---|
| Todo WordPress | **Google Tag Manager `GTM-WWG3RJFC`** + Google tag de Site Kit **`GT-T5MFXVLQ`** (con `linker` para mattriz.com). |
| `/work/spot-on/case-study.html` | **GA4 `G-6CMGETX7FE`** directo (gtag.js). |

- No se detectó Meta Pixel, Hotjar, Clarity ni LinkedIn Insight.
- No se pudo leer el contenido del contenedor GTM ni qué ID de GA4 hay detrás de `GT-T5MFXVLQ` (la descarga de `gtm.js` quedó bloqueada por el proxy de este entorno). Hay que confirmarlo en Google Analytics / Tag Manager.

## 9. Otros

- **Volver arriba:** botón circular fijo abajo a la derecha (`#to-top`).
- **Carga de página:** `data-loading-animation="none"` (no hay loader).
- **Cursor:** no hay cursor personalizado.
