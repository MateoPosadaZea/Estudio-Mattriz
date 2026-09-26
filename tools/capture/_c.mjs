import { launch, gotoReal, scrollThrough } from './lib.mjs';
const b = await launch(); const p = await b.newPage({ viewport: { width: 1440, height: 900 } });
await gotoReal(p, 'https://mattriz.com/project/civilus/'); await p.waitForTimeout(2000); await scrollThrough(p, 500, 120); await p.waitForTimeout(1000);
console.log(await p.evaluate(() => {
  const out = [];
  const col = document.querySelector('.nectar-sticky-column-css');
  col.querySelectorAll('h3,h5,h6,p,li,ul,a,.nectar-meta-category-el, .divider-wrap').forEach((e) => {
    const c = getComputedStyle(e); const r = e.getBoundingClientRect();
    out.push(`${e.tagName}.${(e.className+'').slice(0,30)} "${e.textContent.trim().slice(0,30)}" ${c.color} ${c.fontSize}/${c.lineHeight} w${c.fontWeight} ${c.fontFamily.slice(0,18)} ls${c.letterSpacing} y${Math.round(r.top+scrollY)} x${Math.round(r.left)} h${Math.round(r.height)} w${Math.round(r.width)} m${c.margin} p${c.padding} op${c.opacity} ${c.listStyleType}`);
  });
  return out.join('\n');
}));
await b.close();
