// Posición y alto de las secciones principales, vivo vs nuevo, en 1440 y 390.
// Uso: node sections.mjs <url-vivo> <url-nuevo>
import { launch, scrollThrough, gotoReal } from './lib.mjs';

const [liveUrl, newUrl] = process.argv.slice(2);
const LIVE = ['.wpb_row.top-level', '#services', 'section.nectar_section', '#how-we-work', 'section.nectar_section > .row_col_wrap_12 > .wpb_row:last-child, #fws_6ab129a5bc9ed', '#work', '.nectar-scrolling-text@parent', '.testimonial_slider@section', '#ajax-content-wrap .row > .wpb_row:not(.inner_row)@last'];
const NEW = ['.hero', '.services', '.studio', '.studio__main', '.stats', '#work', '.ticker', '.testimonials', '.site-footer'];
const NAMES = ['hero', 'services', 'studio (sección)', 'studio (main)', 'stats', 'work', 'ticker', 'testimonios', 'footer'];

const browser = await launch();
async function measure(url, sels, size) {
  const page = await browser.newPage({ viewport: size });
  await gotoReal(page, url);
  await page.waitForTimeout(2000);
  await scrollThrough(page, 600, 80);
  await page.waitForTimeout(1000);
  const r = await page.evaluate((sels) => sels.map((raw) => {
    let el;
    if (raw.endsWith('@parent')) el = document.querySelector(raw.slice(0, -7))?.closest('.wpb_row:not(.inner_row)');
    else if (raw.endsWith('@section')) el = document.querySelector(raw.slice(0, -8))?.closest('.wpb_row:not(.inner_row)');
    else if (raw.endsWith('@last')) el = [...document.querySelectorAll(raw.slice(0, -5))].filter((e) => e.offsetParent).at(-1);
    else el = [...document.querySelectorAll(raw)].find((e) => e.getBoundingClientRect().height > 0);
    if (!el) return null;
    const b = el.getBoundingClientRect();
    return [Math.round(b.top + scrollY), Math.round(b.height)];
  }), sels);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.close();
  return { r, total };
}
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const a = await measure(liveUrl, LIVE, size);
  const b = await measure(newUrl, NEW, size);
  console.log(`===== ${vp}   total vivo ${a.total}  nuevo ${b.total}`);
  NAMES.forEach((n, i) => console.log(`${n.padEnd(18)} vivo ${JSON.stringify(a.r[i]).padEnd(14)} nuevo ${JSON.stringify(b.r[i])}`));
}
await browser.close();
