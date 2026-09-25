// Árbol de filas/columnas/elementos del sitio nuevo (mismo formato que dom-tree.mjs).
// Uso: node dom-tree-new.mjs <url> <ancho>
import { launch, scrollThrough } from './lib.mjs';
const [url, width = '1440'] = process.argv.slice(2);
const b = await launch(); const p = await b.newPage({ viewport: { width: +width, height: 900 } });
await p.goto(url); await p.waitForTimeout(1000); await scrollThrough(p, 600, 60); await p.waitForTimeout(800);
console.log(await p.evaluate(() => {
  const out = [];
  const R = (e) => { const r = e.getBoundingClientRect(); const s = getComputedStyle(e); return `x${Math.round(r.left)} y${Math.round(r.top + scrollY)} w${Math.round(r.width)} h${Math.round(r.height)} pad ${s.padding} mar ${s.margin}`; };
  const font = (c) => {
    const t = [...c.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,a,span')].find((e) => e.textContent.trim() && !e.querySelector('h1,h2,h3,h4,h5,h6,p,li'));
    if (!t) return '';
    const s = getComputedStyle(t);
    return ` [${t.tagName} ${s.fontSize}/${s.lineHeight} w${s.fontWeight} ls${s.letterSpacing} ${s.color} mb${s.marginBottom}]`;
  };
  const walk = (el, d) => {
    for (const c of el.children) {
      if (c.classList.contains('wp-row')) { out.push(`${'  '.repeat(d)}ROW ${c.className.replace('wp-row ', '').slice(0, 60)} | ${R(c)}`); walk(c.querySelector(':scope > .wp-row__inner > .wp-cols'), d + 1); }
      else if (c.classList.contains('wp-col')) { out.push(`${'  '.repeat(d)}COL | ${R(c)}`); walk(c.querySelector(':scope > .wp-col__inner'), d + 1); }
      else out.push(`${'  '.repeat(d)}EL ${(c.className + '').slice(0, 40)} | ${R(c)} "${c.textContent.trim().replace(/\s+/g, ' ').slice(0, 40)}"${font(c)}`);
    }
  };
  walk(document.querySelector('.project'), 0);
  return out.join('\n');
}));
await b.close();
