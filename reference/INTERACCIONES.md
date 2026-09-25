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
- **Al cargar:** fade de opacidad `0.01 → 1` en `1.5s ease` (`header_nav_entrance_animation`).
- **Anclas:** `data-animated-anchors="true"`. Los enlaces "How we work", "Projects" y "Services" hacen scroll suave a `#how-we-work`, `#work` y `#services`.
- Capturas: `interactions/header/*-scroll-*.png`.

## 4. Menú mobile (< 1000px)

- **Botón:** círculo negro `#0a0a0a` de 40px con tres líneas blancas y sombra `0 10px 25px rgba(0,0,0,.13)`, a la derecha del botón "Let's talk" (83×53 px, texto 13px).
- **Estilo "material" de Salient:** el panel negro queda **detrás** de la página. Al abrir, la página entera (header incluido) se encoge y se corre a la izquierda: `translateX(−304.7px) scale(0.84)` a 390px y `translateX(−389.1px) scale(0.835)` a 768px, con `transform 0.8s cubic-bezier(0.15, 0.2, 0.1, 1)`. Queda una franja de la página visible a la izquierda.
- **Panel:** `min(85vw, 360px)` de ancho, padding `10vh 40px` (60px sobre 690px), enlaces centrados en vertical.
- **Enlaces:** Home, How we work, Projects, Services, Contact en `maison-neue-light` 42px/42px, peso 300, −0.03em, 12px entre ítems. Entran desde la derecha (110px) más rápido que la página (~41 % a 60 ms, ~100 % a 400 ms). El ítem de la página actual va subrayado (1px).
- **Cierre:** X blanca arriba a la derecha (centro a 30+20px del borde).
- Capturas: `interactions/menu-mobile/abriendo-*ms.png`, `2-abierto.png`, `768-abierto.png`, `3-cerrado-de-nuevo.png`. Video: `interactions/video/menu-mobile.webm`.

## 5. Hover y foco

| Elemento | Hover |
|---|---|
| Enlaces del menú y botón "Let's talk" | *Text reveal*: el texto sube (`translateY(-100%)`) y una copia entra desde abajo. `transform 0.55s cubic-bezier(0.25, 1, 0.33, 1)`. Sin cambio de color. En "Let's talk", además, el fondo crece a 1.065 (0.45s) y aparece una sombra `0 10px 25px rgba(0,0,0,.13)` a 1.07 (0.3s). |
| Botón del hero ("See how we work") y del studio | La píldora con borde blanco se rellena de negro (`interactions/hover/link-hero-*.png`). |
| Filas de Selected Work (desktop) | Fondo negro, texto blanco, flecha ↗ blanca. `color 0.3s`. |
| Links del footer (Instagram, LinkedIn) | Subrayado 1px al 80 % que se recoge hacia la derecha: `scaleX(0)`, origen derecho, `0.4s cubic-bezier(0.23, 0.46, 0.4, 1)`. |
| "Book a free call" | *Text reveal* igual al menú. |
| Email del footer | La flecha curva se redibuja (`stroke-dashoffset`) en `0.9s cubic-bezier(0.15, 0.75, 0.5, 1)`. |
| Punto "Currently accepting new clients" | Halo que late: `scale(1→3)`, opacidad `0.6→0`, `2s cubic-bezier(0.2, 1, 0.2, 1)` infinito. |
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

## 10. Detalles medidos en la Fase 2 (leídos del JS/CSS de Salient)

| Efecto | Parámetros exactos |
|---|---|
| Revelado letra por letra (H1 hero, números 01–05) | `translateY(1.3em) → 0`, 1200 ms `cubic-bezier(0.25, 1, 0.5, 1)`, escalonado `400 / nº de letras` (20–35 ms). H1: 150 ms de retraso y sin animación bajo 1000 px. |
| Revelado por palabra (subtítulo del hero y títulos de sección) | `translateY(1.3em) → 0`, 400 ms `easeOutQuart`; con escalonado `500 / nº de palabras` (15–50 ms). |
| Fade de columnas (servicios, "Selected Work") | `translateY(100px)` y opacidad 0 → 400 ms `easeOutQuart`. |
| Divisores de servicios | `scaleX(0 → 1)` desde la izquierda, 1500 ms `cubic-bezier(.18, .75, .25, 1)`. |
| Disparo de todas las entradas | Cuando el borde inferior del elemento entra en la ventana ("bottom-in-view"), una vez. |
| **Cambio de color de fondo** | "One studio" (negro) y "Selected Work" desktop (blanco): cuando una ocupa ≥ 40 % de la ventana, el fondo y el texto de la página pasan a sus colores en 0.8 s. Por eso las capturas de página completa muestran "One studio" en gris: es la capa negra al 20 % sobre fondo blanco. |
| Opacidad por scroll ("One studio") | Título y texto: cada palabra 0.2 → 1 en 450 ms, 150 ms entre palabras; avance `1 + (scrollY − (top + 5 % ventana)) / ventana`, multiplicado por una velocidad según el alto del bloque. |
| Hover de filas "Selected Work" | Relleno negro `scaleY` desde abajo, 0.6 s `cubic-bezier(0.1, 0.75, 0.5, 1)`; título blanco y +14px; flecha −16px. |
| Medio que sigue al cursor | 288×216, radio 10; centro en `ancho/2 + cursorX/2`, `cursorY − 3`; suavizado ~13 %/fotograma; aparece con opacidad y `clip-path inset(7% → 0)`. |
| Tarjetas mobile | `translateY(80px)` y opacidad 0 → 0.75 s `cubic-bezier(.22, .61, .36, 1)`, 90 ms entre tarjetas. |
| Carrusel de testimonios | Rotación automática cada 4 s; tarjeta activa opacidad 1, resto 0.3; ancho 33 % (≥1300), 50 %, 60 %, 85 % (<690). |
| Marquesina | 5 copias por línea; cada una `translateX(20% → 120%)` (o `−20% → −120%`) en 30 s lineales. |
| Títulos de servicio | Van dentro de `<strong>`: peso 600 sintético sobre Maison Neue Light. |
