// Secciones de /about/, vivo vs nuevo, en 1440 y 390.
// Uso: node sections-about.mjs <url-vivo> <url-nuevo>
import { launch, scrollThrough, gotoReal } from './lib.mjs';

const [liveUrl, newUrl] = process.argv.slice(2);
const NEW = ['.about-hero', '.about-services', '.team', '.site-footer'];
const NAMES = ['hero', 'servicios', 'equipo', 'footer'];

const browser = await launch();
async function measure(url, sels, size) {
  const page = await browser.newPage({ viewport: size });
  await gotoReal(page, url);
  await page.waitForTimeout(2000);
  await scrollThrough(page, 600, 80);
  await page.waitForTimeout(1000);
  const r = await page.evaluate((sels) => {
    const els = sels
      ? sels.map((s) => document.querySelector(s))
      : [...document.querySelectorAll('#ajax-content-wrap .container-wrap .wpb_row:not(.inner_row), #footer-outer .wpb_row:not(.inner_row)')].filter((e) => e.offsetParent && !e.parentElement.closest('.wpb_row'));
    return els.map((el) => {
      if (!el) return null;
      const b = el.getBoundingClientRect();
      return [Math.round(b.top + scrollY), Math.round(b.height)];
    });
  }, sels);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.close();
  return { r, total };
}
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const a = await measure(liveUrl, null, size);
  const b = await measure(newUrl, NEW, size);
  console.log(`===== ${vp}   total vivo ${a.total}  nuevo ${b.total}`);
  console.log('vivo ', JSON.stringify(a.r));
  NAMES.forEach((n, i) => console.log(`${n.padEnd(12)} nuevo ${JSON.stringify(b.r[i])}`));
}
await browser.close();
