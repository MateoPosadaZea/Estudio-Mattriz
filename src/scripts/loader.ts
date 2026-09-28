// v2: loader (src/components/Loader.astro). Mientras la página carga pasan saludos en varios
// idiomas (uno cada ~170 ms, en bucle si hace falta) y la barra avanza hasta 90 %. Cuando la
// página está lista (fuentes + evento load, mínimo 1.1 s) cierra con el saludo en el idioma del
// sitio y el punto en verde, la barra llega a 100 y sube la cortina. Tope: 3 s.

const root = document.documentElement;
const loader = document.querySelector<HTMLElement>('[data-loader]');
const word = loader?.querySelector<HTMLElement>('[data-loader-word]');
const bar = loader?.querySelector<HTMLElement>('[data-loader-bar]');

if (loader && word && bar && root.classList.contains('is-loading')) {
  const es = root.lang.startsWith('es');
  const FINAL = es ? 'Hola' : 'Hello';
  const WORDS = [es ? 'Hello' : 'Hola', 'Bonjour', 'Olá', 'Ciao', 'Hallo', 'Hej'];
  const MIN = 1100;
  const MAX = 3000;
  const STEP = 170;
  const start = performance.now();
  let ready = false;
  let i = 0;

  const loaded = new Promise<void>((resolve) => (document.readyState === 'complete' ? resolve() : window.addEventListener('load', () => resolve(), { once: true })));
  Promise.all([loaded, document.fonts?.ready]).then(() => (ready = true));

  const setBar = (p: number) => (bar.style.transform = `scaleX(${p})`);
  bar.style.transition = 'transform 0.25s linear';

  const finish = () => {
    try {
      sessionStorage.setItem('mz-loaded', '1');
    } catch {}
    loader.classList.add('is-leaving');
    root.classList.remove('is-loading');
    loader.addEventListener('transitionend', () => loader.remove(), { once: true });
  };

  const tick = () => {
    const t = performance.now() - start;
    if ((ready && t >= MIN && i >= 3) || t > MAX) {
      word.innerHTML = `${FINAL}<i>.</i>`;
      setBar(1);
      setTimeout(finish, 550);
      return;
    }
    word.textContent = WORDS[i % WORDS.length];
    i++;
    setBar(Math.min(0.9, (t + STEP) / MIN * 0.9));
    setTimeout(tick, i === 1 ? 300 : STEP);
  };
  tick();
}

export {};
