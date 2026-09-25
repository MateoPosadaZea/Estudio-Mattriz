# Tokens de diseño (sitio vivo mattriz.com)

Capturado el 2026-09-25 con Playwright (estilos computados reales), en 1440×900 y 390×844, más puntos de control en 1024 y 768.
Datos crudos: `reference/tokens.json`. Variables listas para usar: `src/styles/tokens.css`.

> Nota: WPBakery define la mayoría de los tamaños de título en **vw**. Los valores en px de abajo son el resultado a 1440px; la regla de fondo está en la columna "Regla".

## Colores

| Token | Hex | Uso observado |
|---|---|---|
| Negro puro | `#000000` | Fondo del hero, de "What we build", de los testimonios y del CTA/footer. Texto del menú y de las filas de Selected Work. Botón "Let's talk" del header. |
| Negro texto | `#0a0a0a` | Color base del `body` (rgb 10,10,10). Texto sobre fondo claro. |
| Blanco | `#ffffff` | Fondo del header (píldora), de "Selected Work" y de la marquesina. Texto sobre fondos oscuros. Divisores de "What we build". Borde del botón del hero. |
| Verde de marca | `#00ff7f` | Color del gradiente animado (canvas) del hero, del bloque "One studio" y del CTA final. |
| Verde de estado | `#55c91c` | Punto de "Currently accepting new clients". |
| Overlay del hero | `rgba(0,0,0,0.78)` con opacidad 0.8 | Capa sobre el gradiente del hero. |
| Blanco 12 % | `rgba(255,255,255,0.12)` | Fondos de las etiquetas (Build / Maintain / Grow) del bloque de estadísticas. |
| Botón volver arriba | `rgba(0,0,0,0.25)` | Fondo del botón circular `#to-top`. |
| Error de formulario | `#990000` | "This field is required." (WPForms). |
| Etiqueta de formulario | `#333333` | Labels de WPForms. |

No hay otros acentos de color en la home. El sitio es negro, blanco y verde `#00ff7f`.

## Tipografía

| Familia (nombre CSS) | Archivo | Peso real del archivo | Origen |
|---|---|---|---|
| `noe-display` | `Noe-Display.woff2` | 500 | `/wp-content/uploads/useanyfont/` (plugin Use Any Font) |
| `maison-neue-light` | `Maison-Neue-Light.woff2` | 300 | ídem |
| `maison-neue-book` | `Maison-Neue-Book.woff2` | 400 | ídem (solo aparece en 1 elemento de la home) |
| `maison-neue-bold` | `Maison-Neue-Bold.woff2` | 700 | ídem (solo en páginas de proyecto) |

Cada familia tiene **una sola cara**. El CSS pide pesos distintos (300, 400, 500, 600) sobre la misma cara:
- El H1 pide `noe-display` 600 sobre un archivo 500, así que Chrome **sintetiza la negrita** (faux bold). Lo que se ve hoy es esa negrita sintética.
- Todo el texto de cuerpo usa `maison-neue-light` (la cara Light), aunque pida 400 o 500.

El caso de Spot On (`/work/spot-on/case-study.html`) usa otras fuentes: **Playfair Display** (400 itálica, 600, 700) e **Inter** (400, 500, 600), desde Google Fonts.

### Escala (home)

| Elemento | Familia | Desktop 1440 | Mobile 390 | Regla | Peso | Line-height | Letter-spacing |
|---|---|---|---|---|---|---|---|
| H1 hero | noe-display | 72px | 39px | 5vw (tablet 10vw) | 600 (sintético) | 1.14 (82.08px) | normal |
| H2 de sección ("What we build", "Selected Work") | maison-neue-light | 86.4px | 39px / 31.2px | 6vw | 300 | 1.1 | −0.03em |
| Números de servicio ("01"…"05") | maison-neue-light | 100.8px | 46.8px | 7vw | 300 | 1.0 | −0.03em |
| Título de servicio | maison-neue-light | 28.8px | 28px | 2vw | 300 | 1.1 | −0.03em |
| "One studio. Real systems." | maison-neue-light | 57.6px | 27.3px | 4vw | 300 | 2.0 (115.2px) | −0.03em |
| Texto del bloque studio | maison-neue-light | 50.4px | 32px | 3.5vw | 300 | 1.1 | −0.03em |
| "Book a free call" | maison-neue-light | 57.6px | 39px | 4vw | 300 | 1.1 | −0.03em |
| Filas de Selected Work | maison-neue-light | 46px | 17px (tarjeta) | — | 300 (mobile 500) | 1.3 | −0.03em |
| Marquesina | maison-neue-light | 54px | 28px | 6vh | 300 | 1.0 | −0.03em |
| Párrafo / body | maison-neue-light | 17px | 14px | — | 400 | 26px / 21px | normal |
| Menú | maison-neue-light | 16px | 42px (menú abierto) | — | 500 | 16px | normal |
| Testimonio (texto) | maison-neue-light | 17px | 14px | — | 400 | 23.8px / 21px | normal |
| Testimonio (nombre/empresa) | maison-neue-light | 14px | 14px | — | 400 | 24px | normal |

## Layout

| Medida | Valor |
|---|---|
| Header | Píldora blanca `position: fixed`, `top: 25px`, alto 70px (mobile 74px), `border-radius: 50px`, ancho = viewport − 140px (1300px a 1440, máx. 1860px). Mobile: 88 % del ancho. Padding interno 0 25px (mobile 0 22px). |
| Logo | Imagen PNG "M" negra, 37×30px. |
| Ancho de contenido | Secciones a ancho completo con padding lateral del **5 %** (72px a 1440, contenido de 1296px). Hero: 8 % lateral y columnas internas con 13vw. Marquesina y footer: 45px lateral. |
| Padding vertical de sección | "What we build": 5vw arriba y abajo (72px). "Selected Work": 10vw (144px). Testimonios: 7vw / 6vw. "One studio": 5vw arriba. |
| Hero | `min-height: 100vh`, contenido centrado verticalmente, dos columnas (H1 y subtítulo/botón). |
| Breakpoints | **1000px**: el menú pasa a hamburguesa (`data-header-breakpoint="1000"`). **690/691px**: cambio de columnas a una sola. **1300px**: ajuste de contenedor. Otros menores: 470, 600, 767, 1600. |

## Componentes

| Componente | Especificación |
|---|---|
| Botón del hero ("See how we work") | Píldora con borde 1px blanco, texto blanco 17px, alto 49px, icono de flecha ↪ a la derecha. Hover: fondo negro relleno. |
| Botón del header ("Let's talk") | Píldora negra, texto blanco 16px/500, alto 45px (116px de ancho). Hover: efecto *text reveal* (ver INTERACCIONES). |
| Filas de "What we build" | Divisor 1px blanco arriba de cada fila. Título + descripción a la izquierda, número grande a la derecha. |
| Filas de "Selected Work" (desktop) | Lista con divisor 1px negro, título 46px, flecha ↗ a la derecha. Hover: fondo negro, texto blanco. |
| Tarjetas de "Selected Work" (mobile) | Otra maqueta (vc_hidden-lg): tarjetas con imagen, radio 10px, filtro por categoría. |
| Tarjeta de testimonio | Fondo negro, radio 10px, padding 50px 50px 50px 100px (mobile 30px), comilla grande, avatar circular. Carrusel Flickity con flechas circulares (50px, radio 200px). |
| Estadísticas (bloque studio) | Tres columnas: etiqueta en píldora (fondo blanco 12 %), número grande, texto corto. |
| Footer | Parte del CTA final: "Currently accepting new clients" con punto verde, "Book a free call", links subrayados a Instagram y LinkedIn, "© 2026. Mattriz Studio." a la izquierda y "contacto@mattriz.com ↪" a la derecha. |
| Volver arriba | Botón circular 29px, fondo `rgba(0,0,0,.25)`, fijo abajo a la derecha. |
