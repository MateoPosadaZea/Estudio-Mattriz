// v2: contador del loader (src/components/Loader.astro).
// Sube solo hasta 90 mientras la página carga (fuentes + evento load) y termina en 100 cuando
// está lista; dura al menos 1.1 s y como mucho 3 s. Luego la cortina sube y se marca la sesión.

const root = document.documentElement;
const loader = document.querySelector<HTMLElement>('[data-loader]');
const count = loader?.querySelector<HTMLElement>('[data-loader-count]');
const bar = loader?.querySelector<HTMLElement>('[data-loader-bar]');

if (loader && count && bar && root.classList.contains('is-loading')) {
  const MIN = 1100;
  const MAX = 3000;
  const start = performance.now();
  let ready = false;
  let shown = 0;

  const loaded = new Promise<void>((resolve) => (document.readyState === 'complete' ? resolve() : window.addEventListener('load', () => resolve(), { once: true })));
  Promise.all([loaded, document.fonts?.ready]).then(() => (ready = true));

  const finish = () => {
    try {
      sessionStorage.setItem('mz-loaded', '1');
    } catch {}
    loader.classList.add('is-leaving');
    root.classList.remove('is-loading');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  };

  const frame = (now: number) => {
    const t = now - start;
    // Objetivo: avanza con el tiempo hasta 90; llega a 100 cuando la página está lista.
    const target = ready && t >= MIN ? 100 : Math.min(90, (t / MIN) * 90);
    shown += (target - shown) * (target === 100 ? 0.25 : 0.12);
    if (target === 100 && shown > 99.5) shown = 100;
    count.textContent = String(Math.round(shown));
    bar.style.transform = `scaleX(${shown / 100})`;
    if (shown >= 100 || t > MAX) {
      count.textContent = '100';
      bar.style.transform = 'scaleX(1)';
      setTimeout(finish, 180);
    } else {
      requestAnimationFrame(frame);
    }
  };
  requestAnimationFrame(frame);
}

export {};
