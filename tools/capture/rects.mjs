// Caja y estilos clave de una lista de selectores (primer elemento visible), en 1440 y 390.
// Uso: node rects.mjs <url> '<sel1>' '<sel2>' ...   (prefijo "N:" para el elemento N, base 0)
import { launch, scrollThrough } from './lib.mjs';

const [url, ...sels] = process.argv.slice(2);
const P = ['font-family', 'font-size', 'font-weight', 'line-height', 'letter-spacing', 'color', 'background-color', 'border', 'border-radius', 'padding', 'margin', 'opacity', 'transform', 'text-align', 'max-width', 'gap', 'transition'];
const browser = await launch();
for (const [vp, w, h] of [['desktop', 1440, 900], ['mobile', 390, 844]]) {
  const page = await browser.newPage({ viewport: { width: w, height: h } });
  await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(2500);
  await scrollThrough(page, 500, 150);
  await page.waitForTimeout(1500);
  console.log(`===== ${vp}`);
  for (const raw of sels) {
    const m = /^(\d+):(.*)$/.exec(raw);
    const [n, sel] = m ? [Number(m[1]), m[2]] : [0, raw];
    const r = await page.evaluate(({ sel, n, P }) => {
      const els = [...document.querySelectorAll(sel)].filter((e) => { const b = e.getBoundingClientRect(); return b.width > 0 && b.height > 0; });
      const e = els[n];
      if (!e) return null;
      const b = e.getBoundingClientRect();
      const cs = getComputedStyle(e);
      const s = Object.fromEntries(P.map((p) => [p, cs.getPropertyValue(p)]).filter(([p, v]) => !['none', 'normal', '0px', 'rgba(0, 0, 0, 0)', 'auto', '1', 'start', 'all'].includes(v) && !(p === 'border' && v.startsWith('0px'))));
      return { n: els.length, x: Math.round(b.left), y: Math.round(b.top + scrollY), w: Math.round(b.width), h: Math.round(b.height), text: (e.innerText || '').trim().slice(0, 30).replace(/\n/g, ' / '), ...s };
    }, { sel, n, P });
    console.log(raw, '=>', r ? JSON.stringify(r) : 'NO');
  }
  await page.close();
}
await browser.close();
