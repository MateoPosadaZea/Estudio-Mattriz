// Árbol de filas/columnas/elementos de una página de proyecto del vivo con cajas y estilos clave.
// Uso: node dom-tree.mjs <url> <ancho>
import { launch, gotoReal, scrollThrough } from './lib.mjs';
const [url, width = '1440'] = process.argv.slice(2);
const b = await launch(); const p = await b.newPage({ viewport: { width: +width, height: 900 } });
await gotoReal(p, url); await p.waitForTimeout(2000); await scrollThrough(p, 500, 100); await p.waitForTimeout(1500);
console.log(await p.evaluate(() => {
  const out = [];
  const R = (e) => { const r = e.getBoundingClientRect(); return `x${Math.round(r.left)} y${Math.round(r.top + scrollY)} w${Math.round(r.width)} h${Math.round(r.height)}`; };
  const font = (c) => {
    const t = [...c.querySelectorAll('h1,h2,h3,h4,h5,h6,p,li,a,span')].find((e) => e.textContent.trim() && !e.querySelector('h1,h2,h3,h4,h5,h6,p,li'));
    if (!t) return '';
    const s = getComputedStyle(t);
    return ` [${t.tagName} ${s.fontFamily.split(',')[0]} ${s.fontSize}/${s.lineHeight} w${s.fontWeight} ls${s.letterSpacing} ${s.color} mb${s.marginBottom}]`;
  };
  const walk = (el, d) => {
    for (const c of el.children) {
      const cl = c.className + '';
      const cs = getComputedStyle(c);
      let tag = null;
      if (cl.includes('wpb_row')) tag = 'ROW';
      else if (cl.includes('wpb_column')) tag = 'COL';
      else if (/img-with-aniamtion-wrap|nectar_video_player|wpb_text_column|nectar-responsive-text|nectar-split-heading|nectar-cta|divider-wrap|nectar-meta-category|nectar-scrolling-text|nectar-post-grid-wrap/.test(cl)) tag = 'EL';
      if (tag) {
        const bgEl = c.querySelector(':scope > .row-bg-wrap .row-bg');
        const bgi = bgEl ? getComputedStyle(bgEl).backgroundImage : '';
        out.push(`${'  '.repeat(d)}${tag} ${cl.split(' ').filter((k) => !/^(vc_|wpb_|col$|column_container|inherit_|flex_gap|loaded|animated|triggered)/.test(k)).join(' ').slice(0, 70)} | ${R(c)} pad ${cs.padding} mar ${cs.margin}${tag === 'ROW' ? ' bg ' + cs.backgroundColor + (bgi && bgi !== 'none' ? ' bgimg ' + bgi.slice(0, 90) : '') : ''}${tag === 'EL' ? ' "' + c.textContent.trim().replace(/\s+/g, ' ').slice(0, 40) + '"' + font(c) : ''}`);
        if (tag === 'EL') continue;
      }
      walk(c, tag ? d + 1 : d);
    }
  };
  walk(document.querySelector('#portfolio-extra') || document.querySelector('.main-content'), 0);
  return out.join('\n');
}));
await b.close();
