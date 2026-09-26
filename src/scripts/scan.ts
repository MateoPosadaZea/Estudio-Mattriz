// v2: página del escáner (src/views/Scan.astro). Llama a /api/scan, anima el progreso,
// dibuja lo que tiene el sitio, el puntaje, el plan y la cotización, y envía el pedido del plan
// a /api/scan-lead. Con ?url=… en la dirección (desde el home) arranca solo.

import type { ScanResult, Hit } from '../lib/scan/analyze';
import { plan as makePlan, type StepId } from '../lib/scan/recommend';

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void };
  }
}

type Config = {
  lang: 'en' | 'es';
  copy: any;
  pricing: Record<StepId, { min: number; max: number } | null>;
  currency: string;
};

const root = document.querySelector<HTMLElement>('[data-scan]');
const cfgEl = document.querySelector<HTMLScriptElement>('[data-scan-config]');

if (root && cfgEl) {
  const cfg = JSON.parse(cfgEl.textContent || '{}') as Config;
  const c = cfg.copy;
  const $ = <T extends HTMLElement>(sel: string) => root.querySelector<T>(sel)!;
  const form = $<HTMLFormElement>('[data-scan-form]');
  const input = form.querySelector('input')!;
  const button = form.querySelector('button')!;
  const errorEl = $('[data-scan-error]');
  const progress = $('[data-scan-progress]');
  const results = $('[data-scan-results]');
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const esc = (s: string) => s.replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[ch]!);
  const label = (h: Hit) => c.generic[h.name] ?? h.name;
  const money = (n: number) => new Intl.NumberFormat(cfg.lang === 'es' ? 'es-CO' : 'en-US', { style: 'currency', currency: cfg.currency, maximumFractionDigits: 0 }).format(n);
  const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

  const showError = (code: string) => {
    errorEl.textContent = c.errors[code] ?? c.errors.network;
    errorEl.hidden = false;
  };

  // Progreso: marca los pasos uno a uno mientras llega la respuesta (mínimo ~2.8 s para leerlo).
  const runProgress = async (done: Promise<unknown>) => {
    const items = [...progress.querySelectorAll('li')];
    const bar = $('[data-scan-bar]');
    let finished = false;
    done.finally(() => (finished = true));
    for (let i = 0; i < items.length; i++) {
      items.forEach((li, j) => li.classList.toggle('is-done', j < i));
      items[i].classList.add('is-active');
      bar.style.transform = `scaleX(${(i + 1) / (items.length + 1)})`;
      const wait = finished ? 120 : 420;
      await sleep(reduce ? 0 : wait);
      // En el penúltimo paso se espera a la respuesta real.
      if (i === items.length - 2) await done.catch(() => {});
      items[i].classList.remove('is-active');
    }
    items.forEach((li) => li.classList.add('is-done'));
    bar.style.transform = 'scaleX(1)';
    await sleep(reduce ? 0 : 250);
  };

  const scan = async (value: string) => {
    errorEl.hidden = true;
    const url = value.trim();
    if (!url) return showError('invalid');
    button.disabled = true;
    results.hidden = true;
    progress.hidden = false;
    $('[data-scan-target]').textContent = url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    progress.querySelectorAll('li').forEach((li) => li.classList.remove('is-done', 'is-active'));
    progress.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

    const request = fetch(`/api/scan?url=${encodeURIComponent(url)}`, { headers: { Accept: 'application/json' } })
      .then((r) => r.json().catch(() => ({ ok: false, error: 'network' })))
      .catch(() => ({ ok: false, error: 'network' }));
    await runProgress(request);
    const data = (await request) as { ok: boolean; result?: ScanResult; error?: string };
    progress.hidden = true;
    button.disabled = false;

    if (!data.ok || !data.result) {
      showError(data.error || 'network');
      form.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'center' });
      return;
    }
    render(data.result);
    const u = new URL(location.href);
    u.searchParams.set('url', url);
    history.replaceState(null, '', u);
  };

  const render = (r: ScanResult) => {
    const p = makePlan(r);

    // Puntaje con conteo.
    const scoreEl = $('[data-score]');
    $('[data-scan-site]').textContent = r.finalUrl;
    $('[data-scan-areas]').innerHTML = p.areas
      .map((a) => {
        const ratio = a.score / a.max;
        const cls = a.score === 0 ? 'is-zero' : ratio < 0.6 ? 'is-low' : '';
        return `<li class="${cls}"><span>${esc(c.areas[a.id])}</span><span class="pts">${a.score}/${a.max}</span><span class="bar"><span data-ratio="${ratio}"></span></span></li>`;
      })
      .join('');

    // Lo que tiene, por grupos.
    const groups: [keyof ScanResult, string][] = [
      ['platform', 'platform'],
      ['builders', 'builders'],
      ['booking', 'booking'],
      ['payments', 'payments'],
      ['contact', 'contact'],
      ['chat', 'chat'],
      ['analytics', 'analytics'],
      ['reviews', 'reviews'],
      ['tech', 'tech'],
    ];
    $('[data-scan-has]').innerHTML = groups
      .filter(([k]) => k !== 'builders' || (r.builders as Hit[]).length)
      .map(([k, g]) => {
        const hits = r[k] as Hit[];
        const body = hits.length ? `<div class="chips">${hits.map((h) => `<span class="chip">${esc(label(h))}</span>`).join('')}</div>` : `<p class="none">${esc(c.notFound)}</p>`;
        return `<div class="cell"><h3>${esc(c.groups[g])}</h3>${body}</div>`;
      })
      .join('');

    const yes = (ok: boolean) => (ok ? esc(c.seo.yes) : `<span class="bad">${esc(c.seo.no)}</span>`);
    $('[data-scan-seo]').innerHTML = [
      [c.seo.title, r.seo.title ? esc(r.seo.title) : `<span class="bad">${esc(c.seo.missing)}</span>`],
      [c.seo.description, r.seo.description ? esc(r.seo.description) : `<span class="bad">${esc(c.seo.missing)}</span>`],
      [c.seo.h1, r.seo.h1 === 1 ? '1' : `<span class="bad">${r.seo.h1}</span>`],
      [c.seo.viewport, yes(r.seo.viewport)],
      [c.seo.schema, r.seo.schema.length ? esc(r.seo.schema.slice(0, 6).join(', ')) : `<span class="bad">${esc(c.seo.missing)}</span>`],
    ]
      .map(([k, v]) => `<div><dt>${esc(k)}</dt><dd>${v}</dd></div>`)
      .join('');
    $('[data-scan-pages]').textContent = `${c.pagesScanned}: ${r.pages.map((u) => u.replace(/^https?:\/\//, '')).join(' · ')}`;

    // Plan paso a paso, con precio si Mattriz ya lo definió.
    const tools = r.booking.map(label).join(', ');
    const platform = [...r.platform, ...r.builders].map(label).join(' + ') || '—';
    $('[data-scan-steps]').innerHTML = p.steps
      .map((id, i) => {
        const s = c.steps[id];
        const price = cfg.pricing[id];
        const text = s.text.replace('{tools}', esc(tools)).replace('{platform}', esc(platform));
        return `<li><span class="n">${String(i + 1).padStart(2, '0')}</span><h3>${esc(s.title)}</h3><p>${text}</p><span class="price">${price ? `${money(price.min)}–${money(price.max)}` : ''}</span></li>`;
      })
      .join('');

    // Cotización: rango total solo si todos los pasos tienen precio.
    const priced = p.steps.map((id) => cfg.pricing[id]);
    const range = $('[data-scan-range]');
    if (priced.every(Boolean)) {
      const min = priced.reduce((s, x) => s + x!.min, 0);
      const max = priced.reduce((s, x) => s + x!.max, 0);
      $('[data-scan-total]').textContent = `${money(min)}–${money(max)}`;
      range.hidden = false;
    } else range.hidden = true;

    // Resumen para el correo del pedido.
    const summary = [
      `Score: ${p.score}/100 (${p.areas.map((a) => `${a.id} ${a.score}/${a.max}`).join(', ')})`,
      ...groups.map(([k, g]) => `${c.groups[g]}: ${(r[k] as Hit[]).map((h) => h.name).join(', ') || '-'}`),
      `SEO: title "${r.seo.title}", description ${r.seo.description ? 'yes' : 'no'}, H1 ${r.seo.h1}, schema ${r.seo.schema.join(', ') || '-'}`,
      `Weight: ${r.weight.htmlKB} KB HTML, ${r.weight.scripts} scripts (${r.weight.thirdPartyScripts} third-party)`,
      `Plan: ${p.steps.join(', ')}`,
      `Pages: ${r.pages.join(' | ')}`,
    ].join('\n');
    $<HTMLInputElement>('[data-lead-url]').value = r.finalUrl;
    $<HTMLInputElement>('[data-lead-report]').value = summary;

    results.hidden = false;
    results.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block: 'start' });

    // Animaciones: conteo del puntaje y barras.
    const start = performance.now();
    const dur = reduce ? 0 : 1400;
    const tick = (now: number) => {
      const t = dur ? Math.min(1, (now - start) / dur) : 1;
      scoreEl.textContent = String(Math.round(p.score * (1 - Math.pow(1 - t, 3))));
      if (t < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
    requestAnimationFrame(() =>
      root.querySelectorAll<HTMLElement>('[data-ratio]').forEach((b) => (b.style.transform = `scaleX(${b.dataset.ratio})`)),
    );
  };

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    scan(input.value);
  });

  $('[data-scan-again]').addEventListener('click', () => {
    results.hidden = true;
    input.value = '';
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(() => input.focus({ preventScroll: true }), reduce ? 0 : 500);
  });

  // Pedido del plan y la cotización.
  const lead = $<HTMLFormElement>('[data-scan-lead]');
  const status = $('[data-lead-status]');
  const widget = lead.querySelector<HTMLElement>('[data-turnstile]');
  let widgetId: string | undefined;
  let loading: Promise<void> | undefined;
  const loadTurnstile = () => {
    if (!widget) return Promise.resolve();
    loading ??= new Promise<void>((resolve) => {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.onload = () => {
        widgetId = window.turnstile?.render(widget, { sitekey: widget.dataset.sitekey, appearance: 'interaction-only', theme: 'light' });
        resolve();
      };
      s.onerror = () => resolve();
      document.head.append(s);
    });
    return loading;
  };
  lead.addEventListener('focusin', loadTurnstile, { once: true });
  lead.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!lead.reportValidity()) return;
    await loadTurnstile();
    const submit = lead.querySelector<HTMLButtonElement>('button[type="submit"]')!;
    submit.disabled = true;
    status.hidden = true;
    let ok = false;
    try {
      const res = await fetch(lead.action, { method: 'POST', body: new FormData(lead), headers: { Accept: 'application/json' } });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      ok = res.ok && data.ok === true;
    } catch {}
    status.textContent = ok ? lead.dataset.success! : lead.dataset.error!;
    status.hidden = false;
    submit.disabled = false;
    if (ok) lead.reset();
    if (widgetId !== undefined) window.turnstile?.reset(widgetId);
  });

  // Desde el home: /scan/?url=… arranca solo.
  const initial = new URLSearchParams(location.search).get('url');
  if (initial) {
    input.value = initial;
    scan(initial);
  }
}

export {};
