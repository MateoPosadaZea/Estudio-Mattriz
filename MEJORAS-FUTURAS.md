# Mejoras futuras

Ideas que surgen durante el port y que **no** se implementan en él (brief, sección 0). Cada una necesita una decisión aparte.

## Detectadas en la Fase 0

- **Negrita sintética en el H1.** El titular pide Noe Display 600, pero solo existe la cara 500. Con la licencia en regla, conviene usar una cara real (Noe Display Bold/Semibold) en lugar de la que sintetiza el navegador.
- **Unificar fuentes y GA4 del caso de Spot On** con el resto del sitio (hoy: Playfair + Inter y `G-6CMGETX7FE`).
- **Tarjetas de proyecto distintas en desktop y mobile.** WPBakery duplica la sección Work (una por breakpoint). Se podría unificar en un solo componente responsive.
- **Copy viejo en About, marquesina, formulario y páginas de proyecto** ("Webflow & WordPress", "Brand Identity", "UI/UX Design"). Necesita copy aprobado.
- **Contraste del bloque "One studio" y del hero de About** con el efecto de opacidad por scroll.
- Del brief (sección 8): loader tipo máquina de escribir, sistema de movimiento estilo Locomotive, blog.

## Detectadas en la Fase 2

- **Video de Spot On de 14 MB** (`public/media/work/spot-on.mp4`). Se carga solo al pasar el mouse o al entrar en pantalla, pero conviene comprimirlo (el de Civilus pesa 250 KB).
- **Cifras de las estadísticas a 14px en teléfono.** En el vivo el tamaño mínimo de 40px no se aplica en mobile; se portó igual. Probablemente es un error del theme.
- **Carrusel de testimonios**: el vivo usa Flickity con física de arrastre; el port usa una transición CSS equivalente (0.8 s) y swipe simple.
- **El hero anima antes que en el vivo** (allá espera ~1.6 s a que carguen los scripts del theme). Se dejó así: es la misma animación, sin la espera.
- **Marquesina y bloque "What clients say" con copy viejo** (Webflow, WordPress, Shopify…), pendiente de copy aprobado.

## Fase 3: About

- En el vivo, el hero y "Our Services" de /about/ tienen texto oscuro (#0a0a0a / #3a3a3a) sobre fondo #0a0a0a y no se leen. En el sitio nuevo ese texto va en blanco (contraste AA, piso de calidad del brief). Mismo diseño y medidas.
- "View our work" y "Explore our work" apuntaban a /trabajos/ (404). Ahora van a /#work.
