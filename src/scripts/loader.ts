// v2: loader (src/components/Loader.astro). Mientras la página carga pasan saludos en varios
// idiomas (uno cada ~240 ms, en bucle si hace falta). Cuando la página está lista (fuentes + evento
// load, mínimo 2.1 s) cierra con el saludo en el idioma del sitio y el punto en verde, y sube la
// cortina. Tope: 4 s.

const root = document.documentElement;
const loader = document.querySelector<HTMLElement>('[data-loader]');
const word = loader?.querySelector<HTMLElement>('[data-loader-word]');

if (loader && word && root.classList.contains('is-loading')) {
  const es = root.lang.startsWith('es');
  const FINAL = es ? 'Hola' : 'Hello';
  const WORDS = [es ? 'Hello' : 'Hola', 'Bonjour', 'Olá', 'Ciao', 'Hallo', 'Hej'];
  const MIN = 2100;
  const MAX = 4000;
  const STEP = 240;
  const start = performance.now();
  let ready = false;
  let i = 0;

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

  const tick = () => {
    const t = performance.now() - start;
    if ((ready && t >= MIN && i >= 3) || t > MAX) {
      word.innerHTML = `${FINAL}<i>.</i>`;
      setTimeout(finish, 550);
      return;
    }
    word.textContent = WORDS[i % WORDS.length];
    i++;
    setTimeout(tick, i === 1 ? 300 : STEP);
  };
  tick();
}

export {};
