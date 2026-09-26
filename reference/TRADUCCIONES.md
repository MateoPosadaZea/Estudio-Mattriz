# Traducciones (sitio bilingüe)

Inglés en `/`, español en `/es/`. Cada página tiene su par (`hreflang`) y el cambio de idioma
(ES / EN en el header, "Español" / "English" en el menú mobile) lleva a la misma página en el otro idioma.

## Dónde está cada texto

| Qué | Archivo |
|---|---|
| Header, menú, footer, botones, 404 | `src/i18n/index.ts` (`UI`) |
| Home | `src/data/home.ts` (`HOME_ES`, `HOME_LABELS`) |
| About | `src/data/about.ts` (`ABOUT_ES`, `ABOUT_LABELS`) |
| Contact y formulario | `src/data/contact.ts` (`CONTACT_ES`) |
| Categorías de proyecto | `src/i18n/index.ts` (`CATEGORY_ES`) |
| Proyectos | `src/data/projects/i18n/<slug>.json` (texto original → traducción) |

Los proyectos guardan el texto original del vivo: Posada, Let it Go, AGL y Luciana están escritos en
español (su traducción es al inglés); Civilus, The Grid y Spot On en inglés (su traducción es al español).
Si se cambia un texto del modelo y falta su traducción, el build falla y dice cuál.

## Para revisar

- **Testimonios (home) y la cita de Diego (contact)**: el vivo los tiene en inglés; los traduje al español.
  Si existen los originales en español de los clientes, conviene usar esos.
- **"Retainer"**: lo dejé así en español ("Trabajamos por retainer mensual", "Un estudio. Un retainer.").
- **Cargos**: "CEO, fundador" y "CXO, director de experiencia".
- **Migas de pan (datos estructurados)**: "Inicio", "Nosotros", "Contacto".
- **Formulario**: en español los servicios y el presupuesto llegan en español en el correo; el asunto dice
  "Nueva solicitud de proyecto (ES)".
- Los títulos de los proyectos (Civilus, The Grid…) no se traducen.
- El caso de estudio de Spot On (`/work/spot-on/case-study.html`) sigue solo en inglés.
