// Genera public/og/*.jpg (1200×630): la parte de arriba del home y de cada caso, para redes.
// Uso: npm run build && npx astro preview --port 4400, y desde tools/capture: node ../og/og.mjs (usa su Playwright).
import { chromium } from 'playwright';
import fs from 'node:fs';
const OUT = new URL('../../public/og/', import.meta.url).pathname;
fs.mkdirSync(OUT, { recursive: true });
const slugs = fs.readdirSync(new URL('../../src/data/projects/', import.meta.url)).filter((f) => f.endsWith('.json')).map((f) => f.replace('.json', ''));
const pages = [['home', '/'], ...slugs.map((s) => [s, `/project/${s}/`])];
const b = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome' });
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.addInitScript(() => sessionStorage.setItem('mz-loaded', '1'));
for (const [name, path] of pages) {
  await p.goto('http://localhost:4400' + path, { waitUntil: 'networkidle' });
  await p.waitForTimeout(2600);
  await p.screenshot({ path: `${OUT}${name}.jpg`, type: 'jpeg', quality: 86 });
  console.log(name);
}
await b.close();
