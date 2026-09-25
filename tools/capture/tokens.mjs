// 1.3 Tokens de diseño con estilos computados reales + copy vivo por sección.
import fs from 'node:fs';
import { out, launch, loadPages, scrollThrough, VIEWPORTS } from './lib.mjs';

const pages = loadPages();
const browser = await launch();
const result = {};
const copy = {};

// Se ejecuta dentro de la página: devuelve estilos de los elementos clave.
function extract() {
  const pick = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    return {
      sel: el.tagName.toLowerCase() + (el.id ? '#' + el.id : '') + (el.className && typeof el.className === 'string' ? '.' + el.className.trim().split(/\s+/).slice(0, 3).join('.') : ''),
      text: (el.innerText || '').trim().slice(0, 60),
      fontFamily: cs.fontFamily, fontSize: cs.fontSize, fontWeight: cs.fontWeight, fontStyle: cs.fontStyle,
      lineHeight: cs.lineHeight, letterSpacing: cs.letterSpacing, textTransform: cs.textTransform,
      color: cs.color, backgroundColor: cs.backgroundColor,
      padding: cs.padding, margin: cs.margin, border: cs.border, borderRadius: cs.borderRadius,
      width: Math.round(r.width), height: Math.round(r.height), maxWidth: cs.maxWidth,
      transition: cs.transition, position: cs.position,
    };
  };
  const visible = (el) => { const r = el.getBoundingClientRect(); const cs = getComputedStyle(el); return r.width > 0 && r.height > 0 && cs.visibility !== 'hidden' && cs.display !== 'none'; };
  const first = (sel) => [...document.querySelectorAll(sel)].find(visible);
  const all = (sel, n = 6) => [...document.querySelectorAll(sel)].filter(visible).slice(0, n).map(pick);

  // Frecuencia de colores en elementos visibles con texto propio o fondo.
  const colors = { text: {}, bg: {}, border: {} };
  for (const el of document.querySelectorAll('body *')) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    const hasText = [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
    if (hasText) colors.text[cs.color] = (colors.text[cs.color] || 0) + 1;
    if (cs.backgroundColor !== 'rgba(0, 0, 0, 0)') colors.bg[cs.backgroundColor] = (colors.bg[cs.backgroundColor] || 0) + 1;
    if (parseFloat(cs.borderTopWidth) > 0 && cs.borderTopStyle !== 'none') colors.border[cs.borderTopColor] = (colors.border[cs.borderTopColor] || 0) + 1;
  }

  // Secciones de primer nivel (WPBakery: .wpb_row.top-level o hijos directos del contenido).
  const sections = [...document.querySelectorAll('#ajax-content-wrap .main-content > .wpb_row, #ajax-content-wrap .row > .wpb_row:not(.inner_row), main > section, body > section')]
    .filter((el) => visible(el) && !el.closest('.inner_row'))
    .map((el) => {
      const cs = getComputedStyle(el);
      const r = el.getBoundingClientRect();
      const inner = el.querySelector('.row_col_wrap_12, .container, .span_12') || el;
      const ics = getComputedStyle(inner);
      return { id: el.id, cls: el.className.split(/\s+/).slice(0, 8).join(' '), top: Math.round(r.top + scrollY), height: Math.round(r.height), bg: cs.backgroundColor, paddingTop: cs.paddingTop, paddingBottom: cs.paddingBottom, paddingLeft: cs.paddingLeft, paddingRight: cs.paddingRight, innerMaxWidth: ics.maxWidth, innerWidth: Math.round(inner.getBoundingClientRect().width), text: el.innerText.trim() };
    });

  return {
    body: pick(document.body),
    html: pick(document.documentElement),
    h1: all('h1', 3), h2: all('h2', 8), h3: all('h3', 4), h4: all('h4', 3), h5: all('h5', 2), h6: all('h6', 2),
    p: all('p', 6), em: all('h1 em, h1 i, h2 em, h2 i', 4),
    links: all('#ajax-content-wrap a:not(.nectar-button):not([class*=button])', 6),
    buttons: all('.nectar-button, a[class*=button], button, input[type=submit]', 8),
    header: pick(first('#header-outer, header')),
    logo: pick(first('#logo img, #logo, header img')),
    menu: all('#top nav > ul > li > a, header nav a', 8),
    footer: pick(first('#footer-outer, footer')),
    footerText: all('#footer-outer p, #footer-outer a, #footer-outer h1, #footer-outer h2, #footer-outer h3, #footer-outer h4, #footer-outer h5, footer p, footer a', 12),
    container: pick(first('.container, .main-content')),
    inputs: all('input:not([type=hidden]), textarea, select', 6),
    sections,
    colors,
    rootVars: Object.fromEntries([...document.styleSheets].flatMap((s) => { try { return [...s.cssRules]; } catch { return []; } })
      .filter((r) => r.selectorText === ':root').flatMap((r) => [...r.style].map((p) => [p, r.style.getPropertyValue(p).trim()]))),
  };
}

for (const { url, slug } of pages) {
  result[slug] = {};
  for (const [vp, size] of Object.entries(VIEWPORTS)) {
    const page = await browser.newPage({ viewport: size });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await scrollThrough(page);
    await page.waitForTimeout(1500);
    const data = await page.evaluate(extract);
    result[slug][vp] = data;
    if (vp === 'desktop') copy[slug] = { url, sections: data.sections.map((s) => ({ id: s.id, text: s.text })) };
    await page.close();
    console.log(`${vp} ${url}`);
  }
}
await browser.close();

// Breakpoints declarados en el CSS capturado.
const bp = {};
for (const f of fs.readdirSync(out('css'))) {
  const css = fs.readFileSync(out('css', f), 'utf8');
  for (const m of css.matchAll(/@media[^{]*\((min|max)-width:\s*(\d+)px\)/g)) bp[`${m[1]}-${m[2]}`] = (bp[`${m[1]}-${m[2]}`] || 0) + 1;
}

fs.writeFileSync(out('tokens.json'), JSON.stringify({ pages: result, breakpoints: bp }, null, 2));

let md = '# Copy vivo por sección (desktop, 1440px)\n\n';
for (const [slug, c] of Object.entries(copy)) {
  md += `## ${slug}  (${c.url})\n\n`;
  for (const s of c.sections) md += `### ${s.id || '(sin id)'}\n\n\`\`\`\n${s.text}\n\`\`\`\n\n`;
}
fs.writeFileSync(out('COPY-VIVO.md'), md);
console.log('listo: reference/tokens.json, reference/COPY-VIVO.md');
