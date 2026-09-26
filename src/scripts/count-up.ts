// v2: cifras que cuentan desde 0 al entrar en pantalla ("5+", "3", "100%").
// El número final ya está en el HTML (sin JS o con prefers-reduced-motion se ve tal cual);
// aquí solo se anima la parte numérica y se conserva lo que va antes y después.

const els = [...document.querySelectorAll<HTMLElement>('[data-count]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const DURATION = 1600;
const ease = (t: number) => 1 - Math.pow(1 - t, 4);

const run = (el: HTMLElement) => {
  const m = /^(\D*)(\d+)(.*)$/.exec(el.dataset.count || '');
  if (!m) return;
  const [, before, num, after] = m;
  const target = Number(num);
  const start = performance.now();
  const tick = (now: number) => {
    const t = Math.min(1, (now - start) / DURATION);
    el.textContent = before + Math.round(target * ease(t)) + after;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

if (!reduceMotion && 'IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        io.unobserve(e.target);
        run(e.target as HTMLElement);
      }
    },
    { rootMargin: '0px 0px -15% 0px' },
  );
  els.forEach((el) => {
    el.dataset.count = el.textContent!.trim();
    // Los lectores de pantalla leen el valor final; el número que cuenta queda oculto para ellos.
    const sr = document.createElement('span');
    sr.className = 'sr-only';
    sr.textContent = el.textContent!.trim();
    el.after(sr);
    el.setAttribute('aria-hidden', 'true');
    // Arranca en 0 para que no se vea el número final antes de contar.
    el.textContent = el.textContent!.trim().replace(/\d+/, '0');
    io.observe(el);
  });
}

export {};
