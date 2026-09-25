// 1.4 Capturas: cada página completa en 1440 y 390; la home además por sección.
import { out, launch, loadPages, scrollThrough, VIEWPORTS } from './lib.mjs';

const pages = loadPages();
// Los ids de WPBakery cambian en cada render; nombres estables por orden.
const SECTION_NAMES = ['hero', 'what-we-build', 'studio', 'selected-work', 'ticker', 'testimonials', 'cta-footer'];
const browser = await launch();

for (const { url, slug } of pages) {
  for (const [vp, size] of Object.entries(VIEWPORTS)) {
    const page = await browser.newPage({ viewport: size });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await scrollThrough(page);          // dispara lazy-load y animaciones de entrada
    await page.waitForTimeout(2500);
    // La marquesina desborda en horizontal: se recorta al ancho del viewport.
    const h = await page.evaluate(() => document.documentElement.scrollHeight);
    await page.screenshot({ path: out('screenshots', vp, `${slug}.png`), fullPage: true, clip: { x: 0, y: 0, width: size.width, height: h } });

    if (slug === 'home') {
      const sections = await page.$$('#ajax-content-wrap .row > .wpb_row:not(.inner_row)');
      let i = 0;
      for (const s of sections) {
        if (!(await s.isVisible())) continue;
        const id = SECTION_NAMES[i] || (await s.getAttribute('id')) || '';
        i += 1;
        await s.scrollIntoViewIfNeeded();
        await page.waitForTimeout(1200);
        await s.screenshot({ path: out('screenshots', vp, 'home-sections', `${String(i).padStart(2, '0')}-${id}.png`) });
      }
      // Header y footer por separado
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(800);
      await page.screenshot({ path: out('screenshots', vp, 'home-sections', '00-viewport-inicial.png') });
    }
    await page.close();
    console.log(`${vp} ${slug}`);
  }
}
await browser.close();
