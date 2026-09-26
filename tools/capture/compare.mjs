// Captura lado a lado de una región del sitio vivo y del sitio nuevo, en 1440 y 390.
// Uso: node compare.mjs <nombre> <url-vivo> <selector-vivo> <url-nuevo> <selector-nuevo>
// Los selectores aceptan el sufijo "@last" (último elemento visible que coincide).
// Salida: reference/compare/<nombre>-<viewport>-{vivo,nuevo}.png
import { out, launch, scrollThrough } from './lib.mjs';

const [name, liveUrl, liveSel, newUrl, newSel] = process.argv.slice(2);
const browser = await launch();

async function shot(url, selector, vp, size, label) {
  const page = await browser.newPage({ viewport: size });
  await page.goto(url, { waitUntil: 'networkidle' });
  await scrollThrough(page, 600, 60);
  await page.waitForTimeout(1800);
  const last = selector.endsWith('@last');
  const sel = last ? selector.slice(0, -5) : selector;
  const handles = [];
  for (const h of await page.$$(sel)) if (await h.isVisible()) handles.push(h);
  const el = last ? handles.at(-1) : handles[0];
  if (!el) throw new Error(`No se encontró ${selector} en ${url}`);
  const fixed = await el.evaluate((e) => getComputedStyle(e).position === 'fixed');
  if (fixed) {
    // Elementos fijos (header): captura del borde superior de la ventana.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(600);
    await page.screenshot({ path: out('compare', `${name}-${vp}-${label}.png`), clip: { x: 0, y: 0, width: size.width, height: 130 } });
  } else {
    await el.scrollIntoViewIfNeeded();
    await page.waitForTimeout(800);
    await el.screenshot({ path: out('compare', `${name}-${vp}-${label}.png`) });
  }
  await page.close();
}

for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  await shot(liveUrl, liveSel, vp, size, 'vivo');
  await shot(newUrl, newSel, vp, size, 'nuevo');
  console.log(`${name} ${vp}`);
}
await browser.close();
