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

## Fase 3: Contact

- La etiqueta "Estimated budget (USD)" era gris #acacac sobre blanco (contraste 2.2:1). Ahora es negra como las demás.
- El testimonio de Diego tenía dos rayas largas; van con comas.
- El envío con JS muestra los mensajes del brief debajo del botón. Sin JS el formulario igual funciona (el Worker redirige a /contact/?sent=ok|error).
- Turnstile va en modo "interaction-only" y se carga solo al empezar a llenar el formulario: no cambia el diseño ni pesa en la carga inicial.

## Fase 3: 404 y redirects

- La 404 del vivo tiene "404" y "Page Not Found" en #0a0a0a sobre #0a0a0a (invisibles). En el sitio nuevo van en blanco.
- El caso de estudio de Spot On se copió tal cual (byte a byte), incluidas sus rayas largas en el título y el copy: el brief pide que la ruta siga funcionando, no reescribirlo. Si se quiere aplicar la regla sin rayas también ahí, es un cambio aparte.

## Fase 3: páginas de proyecto

- Las 7 páginas se generan desde el HTML del vivo (tools/projects/extract.py) y se dibujan con las reglas de layout de Salient. Filas medidas contra el vivo en 1440 y 390: coinciden (±3px; Let it Go ±11px en 24.500px).
- En el vivo hay mucho texto invisible: el reto ("The Challenge") de Civilus/The Grid/Spot On, las listas de servicios (blanco sobre blanco), "What we did" y el bloque Servicios/Resumen/Lo que hicimos de los proyectos antiguos (oscuro sobre #0a0a0a). En el sitio nuevo el color del texto se decide por el fondo real, así que todo se lee.
- Videos recomprimidos a H.264 (máx. 1600px, sin audio): de ~500 MB a ~25 MB, todos bajo el límite de 25 MiB por archivo de Cloudflare. Imágenes en WebP con srcset (2000/1200/700).
- Los proyectos antiguos (Posada, Let it Go, AGL, Luciana) están en español en el vivo y se dejaron igual. Pendiente decidir si se traducen (el brief pide copy en inglés).
- El video de fondo de una fila de Luciana Cabañas da 404 en el vivo; la fila queda vacía igual que allá.
- "Explore More": en el vivo las 3 tarjetas salen al azar; aquí son los 3 proyectos siguientes en el orden de la home.
- El enlace "Proyecto Anterior: Gravity Font" apunta a una página que no existe (404 en el vivo); redirige a /#work.

## Fase 4: SEO, analítica y rendimiento

- Títulos y descripciones iguales al vivo. Los proyectos antiguos no tenían descripción en el vivo; aquí usan su primer párrafo.
- Datos estructurados equivalentes a los de AIOSEO. Las migas decían "Inicio" (español); aquí "Home".
- La etiqueta de verificación de Search Console se mantiene. Después del cutover conviene enviar /sitemap-index.xml en Search Console.
- La analítica (GTM + etiqueta de Google) carga en la primera interacción o a los 4 s. Puede contar algo menos de rebotes instantáneos que antes.
- El caso de estudio de Spot On se podría optimizar (fuentes locales, imágenes WebP) sin cambiar su aspecto.
- Cutover: la redirección www → mattriz.com se configura como regla de Cloudflare (Redirect Rules) al apuntar el dominio.
