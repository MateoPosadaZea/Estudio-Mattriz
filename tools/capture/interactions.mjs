// 1.5 Inventario de interacciones: mediciones con Playwright + video de la carga.
import fs from 'node:fs';
import { BASE, out, launch, loadPages, VIEWPORTS, sleep } from './lib.mjs';

const origin = new URL(BASE).origin;
const pages = loadPages();
const browser = await launch();
const R = {};

const styleOf = (el, props) => el.evaluate((e, props) => { const cs = getComputedStyle(e); return Object.fromEntries(props.map((p) => [p, cs.getPropertyValue(p)])); }, props);
const HOVER_PROPS = ['color', 'background-color', 'border-color', 'opacity', 'transform', 'text-decoration-line', 'box-shadow', 'transition'];

// --- 1. Hero: línea de tiempo de la animación de entrada (desktop y mobile) ---
for (const [vp, size] of Object.entries(VIEWPORTS)) {
  const ctx = await browser.newContext({ viewport: size, recordVideo: { dir: out('interactions', 'video', vp), size } });
  const page = await ctx.newPage();
  await page.addInitScript(() => {
    // Muestreo cada ~50 ms desde el inicio de la carga.
    window.__samples = [];
    const t0 = performance.now();
    const tick = () => {
      const h1 = document.querySelector('h1');
      if (h1) {
        const inners = [...h1.querySelectorAll('.inner')];
        const first = inners[0], last = inners[inners.length - 1];
        const g = (e) => e && { transform: getComputedStyle(e).transform, opacity: getComputedStyle(e).opacity };
        window.__samples.push({ t: Math.round(performance.now() - t0), n: inners.length, first: g(first), last: g(last), h1Opacity: getComputedStyle(h1).opacity });
      }
      if (performance.now() - t0 < 6000) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
  await page.goto(origin + '/', { waitUntil: 'load' });
  await sleep(6500);
  const samples = await page.evaluate(() => window.__samples);
  const hero = await page.evaluate(() => {
    const h1 = document.querySelector('h1');
    const wrap = h1?.closest('.nectar-split-heading');
    const inner = h1?.querySelector('.inner');
    const cs = inner && getComputedStyle(inner);
    const row = h1?.closest('.wpb_row.top-level');
    const canvas = row?.querySelector('canvas');
    return {
      wrapperData: wrap ? Object.fromEntries([...wrap.attributes].filter((a) => a.name.startsWith('data-') || a.name === 'class' || a.name === 'style').map((a) => [a.name, a.value])) : null,
      innerTransition: cs?.transition, innerAnimation: cs?.animationName + ' ' + cs?.animationDuration,
      h1Html: h1?.outerHTML.slice(0, 400),
      rowData: row ? Object.fromEntries([...row.attributes].filter((a) => a.name.startsWith('data-')).map((a) => [a.name, a.value])) : null,
      canvas: canvas ? { cls: canvas.className, w: canvas.width, h: canvas.height } : null,
      overlay: row?.querySelector('.row-bg-overlay')?.getAttribute('style'),
      siblings: [...(row?.querySelectorAll('[data-animation]:not([data-animation=""]), [data-text-effect]:not([data-text-effect="none"])') || [])].map((e) => ({ tag: e.tagName, cls: e.className.slice(0, 80), animation: e.dataset.animation, effect: e.dataset.textEffect, delay: e.dataset.delay || e.dataset.animationDelay })),
    };
  });
  // Primer y último momento de movimiento del primer y último carácter.
  const moving = (k) => samples.filter((s) => s[k] && s[k].transform !== 'none' && !/matrix\(1, 0, 0, 1, 0, 0\)/.test(s[k].transform));
  const summary = {
    firstChar: { startsMovingAt: moving('first')[0]?.t, stopsAt: moving('first').at(-1)?.t },
    lastChar: { startsMovingAt: moving('last')[0]?.t, stopsAt: moving('last').at(-1)?.t },
    chars: samples.at(-1)?.n,
  };
  R[`hero_${vp}`] = { ...hero, summary, samples: samples.filter((_, i) => i % 3 === 0).slice(0, 80) };
  await ctx.close();
  console.log('hero', vp, JSON.stringify(summary));
}

// --- 2. Header al hacer scroll + hover del menú ---
for (const [vp, size] of Object.entries(VIEWPORTS)) {
  const page = await browser.newPage({ viewport: size });
  await page.goto(origin + '/', { waitUntil: 'networkidle' });
  await sleep(2500);
  const hdr = async (label) => ({ label, scrollY: await page.evaluate(() => scrollY), ...(await page.evaluate(() => {
    const h = document.querySelector('#header-outer');
    const cs = getComputedStyle(h);
    const r = h.getBoundingClientRect();
    return { cls: h.className, position: cs.position, top: Math.round(r.top), height: Math.round(r.height), width: Math.round(r.width), bg: cs.backgroundColor, transform: cs.transform, boxShadow: cs.boxShadow, transition: cs.transition, logoSrc: document.querySelector('#logo img:not(.hidden-logo)')?.currentSrc, textColor: getComputedStyle(document.querySelector('#top nav a, #top a') || h).color };
  })) });
  const states = [await hdr('inicio')];
  for (const y of [100, 600, 1500, 3000]) { await page.evaluate((y) => window.scrollTo(0, y), y); await sleep(900); states.push(await hdr(`scroll ${y}`)); await page.screenshot({ path: out('interactions', 'header', `${vp}-scroll-${y}.png`), clip: { x: 0, y: 0, width: size.width, height: 160 } }); }
  await page.evaluate(() => window.scrollBy(0, -400)); await sleep(900); states.push(await hdr('scroll arriba 400'));
  R[`header_${vp}`] = states;

  if (vp === 'desktop') {
    await page.evaluate(() => window.scrollTo(0, 0)); await sleep(800);
    const hovers = [];
    const targets = { 'menú': '#top nav > ul.sf-menu:not(.buttons) > li > a', 'botón header': '#top nav ul.buttons a', 'link hero': '#ajax-content-wrap a.link_text', 'fila Selected Work': '#ajax-content-wrap a.nectar-post-grid-link', 'footer link': '#ajax-content-wrap .wpb_row:last-child a' };
    for (const [name, sel] of Object.entries(targets)) {
      const el = (await page.$$(sel)).find(Boolean);
      if (!el || !(await el.isVisible())) { hovers.push({ name, sel, error: 'no visible' }); continue; }
      await el.scrollIntoViewIfNeeded(); await page.mouse.move(0, 0); await sleep(500);
      const before = await styleOf(el, HOVER_PROPS);
      const box = await el.boundingBox();
      const shotBox = { x: Math.max(0, box.x - 20), y: Math.max(0, box.y - 20), width: Math.min(box.width + 40, size.width), height: box.height + 40 };
      await page.screenshot({ path: out('interactions', 'hover', `${name.replace(/\s+/g, '-')}-antes.png`), clip: shotBox });
      await el.hover(); await sleep(900);
      const after = await styleOf(el, HOVER_PROPS);
      await page.screenshot({ path: out('interactions', 'hover', `${name.replace(/\s+/g, '-')}-hover.png`), clip: shotBox });
      // Cambios en hijos (ej. text-reveal del botón, flecha)
      const childChanges = await el.evaluate((e) => [...e.querySelectorAll('*')].slice(0, 12).map((c) => { const cs = getComputedStyle(c); return { cls: String(c.className).slice(0, 50), transform: cs.transform, opacity: cs.opacity, color: cs.color, transition: cs.transition.slice(0, 120) }; }));
      const diff = Object.fromEntries(HOVER_PROPS.filter((p) => before[p] !== after[p]).map((p) => [p, [before[p], after[p]]]));
      hovers.push({ name, sel, transition: before.transition, diff, childChanges });
    }
    R.hover = hovers;

    // Foco con teclado
    await page.evaluate(() => window.scrollTo(0, 0));
    const focus = [];
    for (let i = 0; i < 10; i++) {
      await page.keyboard.press('Tab'); await sleep(150);
      focus.push(await page.evaluate(() => { const e = document.activeElement; const cs = getComputedStyle(e); return { tag: e.tagName, text: (e.innerText || e.getAttribute('aria-label') || '').trim().slice(0, 40), outline: cs.outline, outlineOffset: cs.outlineOffset, boxShadow: cs.boxShadow }; }));
    }
    R.focus = focus;
  }
  await page.close();
  console.log('header', vp);
}

// --- 3. Menú mobile ---
{
  const ctx = await browser.newContext({ viewport: VIEWPORTS.mobile, recordVideo: { dir: out('interactions', 'video', 'menu-mobile'), size: VIEWPORTS.mobile } });
  const page = await ctx.newPage();
  await page.goto(origin + '/', { waitUntil: 'networkidle' });
  await sleep(2500);
  const toggle = await page.$('.slide-out-widget-area-toggle a, [aria-label*="enu" i]');
  const menu = { toggle: toggle ? await toggle.evaluate((e) => ({ html: e.outerHTML.slice(0, 300), text: e.innerText })) : null };
  if (toggle) {
    await page.screenshot({ path: out('interactions', 'menu-mobile', '1-cerrado.png') });
    const t0 = Date.now();
    await toggle.click();
    const frames = [];
    for (let i = 0; i < 12; i++) {
      frames.push({ t: Date.now() - t0, ...(await page.evaluate(() => { const p = document.querySelector('#slide-out-widget-area'); if (!p) return {}; const cs = getComputedStyle(p); const r = p.getBoundingClientRect(); return { opacity: cs.opacity, transform: cs.transform, top: Math.round(r.top), left: Math.round(r.left), w: Math.round(r.width), h: Math.round(r.height), clip: cs.clipPath, bg: cs.backgroundColor }; })) });
      await sleep(80);
    }
    await sleep(800);
    await page.screenshot({ path: out('interactions', 'menu-mobile', '2-abierto.png') });
    menu.opening = frames;
    menu.panel = await page.evaluate(() => { const p = document.querySelector('#slide-out-widget-area'); if (!p) return null; const cs = getComputedStyle(p); return { cls: p.className, style: p.getAttribute('style'), bg: cs.backgroundColor, transition: cs.transition, items: [...p.querySelectorAll('a')].filter((a) => a.offsetParent).map((a) => ({ text: a.innerText.trim(), href: a.getAttribute('href'), font: getComputedStyle(a).fontFamily, size: getComputedStyle(a).fontSize, color: getComputedStyle(a).color })), bodyCls: document.body.className.match(/material|slide-out|fullscreen[^ ]*/g) }; });
    menu.dataOcm = await page.evaluate(() => Object.fromEntries([...document.body.attributes].filter((a) => /ocm|slide|header|anim/i.test(a.name)).map((a) => [a.name, a.value])));
    const close = await page.$('.slide-out-widget-area-toggle.material-open a, #slide-out-widget-area .slide_out_area_close, .slide-out-widget-area-toggle a');
    if (close) { await close.click({ force: true }); await sleep(1200); await page.screenshot({ path: out('interactions', 'menu-mobile', '3-cerrado-de-nuevo.png') }); }
  }
  R.menuMobile = menu;
  await ctx.close();
  console.log('menú mobile');
}

// --- 4. Animaciones al hacer scroll (elementos con efecto declarado) ---
{
  const page = await browser.newPage({ viewport: VIEWPORTS.desktop });
  await page.goto(origin + '/', { waitUntil: 'networkidle' });
  await sleep(2000);
  const decl = await page.evaluate(() => [...document.querySelectorAll('[data-animation]:not([data-animation=""]), [data-text-effect]:not([data-text-effect="none"]), [data-bg-animation]:not([data-bg-animation="none"]), .nectar-scrolling-text, [data-parallax], .parallax_section, [data-n-parallax-bg], .nectar-video-wrap, video, .flickity-enabled, canvas')]
    .map((e) => { const cs = getComputedStyle(e); const sec = e.closest('.wpb_row:not(.inner_row)'); return { tag: e.tagName, cls: String(e.className).slice(0, 90), section: sec ? [...document.querySelectorAll('#ajax-content-wrap .row > .wpb_row:not(.inner_row)')].indexOf(sec) : -1, data: Object.fromEntries([...e.attributes].filter((a) => a.name.startsWith('data-') && !/^data-(id|midnight|column-margin)$/.test(a.name)).map((a) => [a.name, a.value.slice(0, 120)])), text: (e.innerText || '').trim().slice(0, 50), opacityBefore: cs.opacity, transformBefore: cs.transform, transition: cs.transition.slice(0, 160), animation: cs.animationName !== 'none' ? `${cs.animationName} ${cs.animationDuration} ${cs.animationTimingFunction} ${cs.animationIterationCount}` : '' }; }));
  R.scrollDeclared = decl;
  // Medición de un efecto de scroll: opacidad de los caracteres de un título con scroll-opacity-reveal
  const sor = await page.$('[data-text-effect="scroll-opacity-reveal"]');
  if (sor) {
    const pts = [];
    await sor.scrollIntoViewIfNeeded();
    const top = await sor.evaluate((e) => e.getBoundingClientRect().top + scrollY);
    for (const off of [-900, -700, -500, -300, -100, 100]) {
      await page.evaluate((y) => window.scrollTo(0, y), top + off); await sleep(400);
      pts.push({ scrollOffset: off, ops: await sor.evaluate((e) => [...e.querySelectorAll('span, .inner')].slice(0, 40).map((s) => getComputedStyle(s).opacity).join(',')) });
    }
    R.scrollOpacityReveal = pts;
  }
  // Marquesinas: dirección y velocidad aproximada
  R.scrollingText = await page.evaluate(async () => {
    const out = [];
    for (const st of document.querySelectorAll('.nectar-scrolling-text')) {
      const inner = st.querySelector('.nectar-scrolling-text-inner__text-chunk, .nectar-scrolling-text-inner') || st.firstElementChild;
      st.scrollIntoView({ block: 'center' });
      await new Promise((r) => setTimeout(r, 300));
      const x0 = inner.getBoundingClientRect().left;
      await new Promise((r) => setTimeout(r, 1000));
      const x1 = inner.getBoundingClientRect().left;
      out.push({ data: Object.fromEntries([...st.attributes].filter((a) => a.name.startsWith('data-')).map((a) => [a.name, a.value])), cls: st.className, pxPerSecond: Math.round(x1 - x0), animation: getComputedStyle(inner).animation?.slice(0, 120), text: st.innerText.trim().slice(0, 80) });
    }
    return out;
  });
  await page.close();
  console.log('scroll');
}

// --- 5. Formularios, embeds y analítica (todas las páginas) ---
{
  const forms = {}; const embeds = {}; const analytics = {};
  for (const { url, slug } of pages) {
    const page = await browser.newPage({ viewport: VIEWPORTS.desktop });
    const reqs = new Set();
    page.on('request', (r) => { const h = new URL(r.url()).host; if (!h.endsWith(new URL(origin).host)) reqs.add(h + new URL(r.url()).pathname.slice(0, 40)); });
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await sleep(1500);
    const d = await page.evaluate(() => {
      const scripts = [...document.scripts].map((s) => s.src || s.textContent).join('\n');
      const ids = (re) => [...new Set([...scripts.matchAll(re)].map((m) => m[1] || m[0]))];
      return {
        forms: [...document.querySelectorAll('form')].map((f) => ({ id: f.id, cls: f.className.slice(0, 80), action: f.getAttribute('action'), method: f.method, novalidate: f.noValidate, fields: [...f.querySelectorAll('input:not([type=hidden]), textarea, select')].map((i) => ({ tag: i.tagName, type: i.type, name: i.name, required: i.required || i.getAttribute('aria-required') === 'true', placeholder: i.placeholder, label: i.labels?.[0]?.innerText.trim() || document.querySelector(`label[for="${i.id}"]`)?.innerText.trim() || '' })), submit: f.querySelector('[type=submit]')?.innerText || f.querySelector('[type=submit]')?.value })),
        iframes: [...document.querySelectorAll('iframe')].map((i) => i.src),
        calendly: [...document.querySelectorAll('a[href*="calendly"], [data-url*="calendly"], .calendly-inline-widget')].map((e) => e.href || e.dataset.url),
        ga4: ids(/\b(G-[A-Z0-9]{8,12})\b/g), gtm: ids(/\b(GTM-[A-Z0-9]{5,9})\b/g), ua: ids(/\b(UA-\d+-\d+)\b/g),
        pixel: ids(/fbq\(\s*['"]init['"]\s*,\s*['"](\d+)/g), clarity: ids(/clarity[^"']*["']script["'],\s*["']([a-z0-9]+)/g),
        other: ['hotjar', 'clarity.ms', 'tiktok', 'linkedin', 'hubspot', 'recaptcha', 'turnstile'].filter((k) => scripts.includes(k)),
      };
    });
    if (d.forms.length) forms[slug] = d.forms;
    if (d.iframes.length || d.calendly.length) embeds[slug] = { iframes: d.iframes, calendly: [...new Set(d.calendly)] };
    analytics[slug] = { ga4: d.ga4, gtm: d.gtm, ua: d.ua, pixel: d.pixel, clarity: d.clarity, other: d.other, thirdPartyHosts: [...new Set([...reqs].map((r) => r.split('/')[0]))] };
    await page.close();
  }
  R.forms = forms; R.embeds = embeds; R.analytics = analytics;

  // Validación del formulario de contacto: envío vacío con las peticiones POST bloqueadas (no se envía nada real).
  const contact = pages.find((p) => p.slug === 'contact');
  if (contact && forms.contact) {
    const page = await browser.newPage({ viewport: VIEWPORTS.desktop });
    await page.route('**/*', (route) => (route.request().method() === 'POST' ? route.abort() : route.continue()));
    await page.goto(contact.url, { waitUntil: 'networkidle' });
    const f = await page.$('form.wpforms-form, form[id^=wpforms], #ajax-content-wrap form');
    if (f) {
      await f.scrollIntoViewIfNeeded();
      await page.screenshot({ path: out('interactions', 'form', '1-vacio.png'), fullPage: false });
      const btn = await f.$('[type=submit]');
      await btn?.click(); await sleep(1200);
      await page.screenshot({ path: out('interactions', 'form', '2-validacion.png'), fullPage: false });
      R.formValidation = await f.evaluate((form) => [...form.querySelectorAll('.wpforms-error, label.error, .error, [role=alert], .wpcf7-not-valid-tip')].filter((e) => e.offsetParent).map((e) => ({ text: e.innerText.trim(), color: getComputedStyle(e).color, font: getComputedStyle(e).fontSize })));
      // Mensaje de éxito configurado (si está en el HTML/JS de WPForms)
      R.formConfirmation = await page.evaluate(() => document.querySelector('.wpforms-confirmation-container, .wpforms-confirmation-container-full')?.innerText || (window.wpforms_settings ? JSON.stringify(window.wpforms_settings).slice(0, 1500) : ''));
    }
    await page.close();
  }
  console.log('forms/embeds/analytics');
}

await browser.close();
fs.writeFileSync(out('interactions.json'), JSON.stringify(R, null, 2));
console.log('listo: reference/interactions.json');
