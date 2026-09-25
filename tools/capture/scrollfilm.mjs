// "Película" de scroll: capturas del viewport a intervalos fijos, esperando entre
// cada una, para ver la página como la ve un visitante (fondos que cambian con el
// scroll, animaciones de entrada, elementos fijos).
// Uso: node scrollfilm.mjs <url> <nombre> [paso=450]
import { out, launch } from './lib.mjs';

const [url, name, stepArg] = process.argv.slice(2);
const step = Number(stepArg) || 450;
const browser = await launch();
for (const [vp, size] of [['desktop', { width: 1440, height: 900 }], ['mobile', { width: 390, height: 844 }]]) {
  const page = await browser.newPage({ viewport: size });
  await page.goto(url, { waitUntil: 'load', timeout: 90000 });
  await page.waitForTimeout(4000);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  let i = 0;
  for (let y = 0; y < total; y += step) {
    await page.mouse.wheel(0, i === 0 ? 0 : step);
    await page.waitForTimeout(1400);
    await page.screenshot({ path: out('film', name, vp, `${String(i).padStart(2, '0')}.png`) });
    i++;
  }
  await page.close();
  console.log(name, vp, i, 'capturas');
}
await browser.close();
