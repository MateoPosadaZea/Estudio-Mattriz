// Mide cajas y estilos de los elementos visibles de una región (header, footer…)
// para comparar el sitio vivo contra el sitio nuevo con los mismos selectores.
// Uso: node measure.mjs <url> <selector-región> [salida.json]
// Sufijo "@last" en el selector: toma el último elemento visible que coincide.
import fs from 'node:fs';
import { launch, scrollThrough } from './lib.mjs';

const [url, region, outFile] = process.argv.slice(2);
const PROPS = ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color', 'background-color', 'border-radius', 'border-bottom', 'text-decoration-line', 'padding', 'opacity'];
const browser = await launch();
const result = {};
for (const [vp, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(url, { waitUntil: 'networkidle' });
  await scrollThrough(page, 600, 80);
  await page.waitForTimeout(800);
  result[vp] = await page.evaluate(({ region, PROPS }) => {
    const last = region.endsWith('@last');
    const sel = last ? region.slice(0, -5) : region;
    const matches = [...document.querySelectorAll(sel)].filter((e) => e.getBoundingClientRect().height > 0);
    const root = last ? matches.at(-1) : matches[0];
    if (!root) return null;
    const rr = root.getBoundingClientRect();
    const leaves = [...root.querySelectorAll('*')].filter((e) => {
      const r = e.getBoundingClientRect();
      if (r.width === 0 || r.height === 0) return false;
      const cs = getComputedStyle(e);
      if (cs.visibility === 'hidden' || cs.display === 'none') return false;
      const ownText = [...e.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim());
      return ownText || ['IMG', 'SVG', 'svg', 'BUTTON', 'A'].includes(e.tagName);
    });
    return {
      region: { x: Math.round(rr.left), y: Math.round(rr.top + scrollY), w: Math.round(rr.width), h: Math.round(rr.height), bg: getComputedStyle(root).backgroundColor, radius: getComputedStyle(root).borderRadius },
      items: leaves.map((e) => {
        const r = e.getBoundingClientRect(); const cs = getComputedStyle(e);
        return { tag: e.tagName, text: [...e.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join(' ').slice(0, 40), x: Math.round(r.left - rr.left), y: Math.round(r.top - rr.top), w: Math.round(r.width), h: Math.round(r.height), ...Object.fromEntries(PROPS.map((p) => [p, cs.getPropertyValue(p)])) };
      }),
    };
  }, { region, PROPS });
  await page.close();
}
await browser.close();
const json = JSON.stringify(result, null, 1);
if (outFile) fs.writeFileSync(outFile, json); else console.log(json);
