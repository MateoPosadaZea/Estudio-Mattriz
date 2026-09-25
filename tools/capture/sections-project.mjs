// Filas de primer nivel de una página de proyecto, vivo vs nuevo, en 1440 y 390.
// Uso: node sections-project.mjs <slug> [base-nuevo]
import { launch, scrollThrough, gotoReal } from './lib.mjs';

const [slug, base = 'http://localhost:4321'] = process.argv.slice(2);
const browser = await launch();
async function measure(url, live, size) {
  const page = await browser.newPage({ viewport: size });
  await gotoReal(page, url);
  await page.waitForTimeout(1500);
  await scrollThrough(page, 600, 60);
  await page.waitForTimeout(800);
  const rows = await page.evaluate((live) => {
    const els = live
      ? [...document.querySelectorAll('#portfolio-extra > .wpb_row')]
      : [...document.querySelectorAll('.project > .wp-row')];
    return els.map((e) => {
      const r = e.getBoundingClientRect();
      return [Math.round(r.top + scrollY), Math.round(r.height)];
    });
  }, live);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  await page.close();
  return { rows, total };
}
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const a = await measure(`https://mattriz.com/project/${slug}/`, true, size);
  const b = await measure(`${base}/project/${slug}/`, false, size);
  console.log(`===== ${slug} ${vp}   total vivo ${a.total}  nuevo ${b.total}`);
  const n = Math.max(a.rows.length, b.rows.length);
  for (let i = 0; i < n; i++) {
    const [ly, lh] = a.rows[i] ?? [];
    const [ny, nh] = b.rows[i] ?? [];
    const flag = lh === undefined || nh === undefined || Math.abs(lh - nh) > 3 || Math.abs(ly - ny) > 3 ? '  <--' : '';
    console.log(`fila ${String(i).padStart(2)}  vivo y${ly} h${lh}   nuevo y${ny} h${nh}${flag}`);
  }
}
await browser.close();
