// v2: loader (src/components/Loader.astro). Mientras la página carga pasan saludos en varios
// idiomas (uno cada ~240 ms, en bucle si hace falta). Cuando la página está lista (fuentes + evento
// load, mínimo 2.1 s) cierra con "Mattriz." (el punto en verde); el texto se desvanece y el fondo
// blanco sube como un telón, sin arrastrar la palabra. Tope: 4 s.

const root = document.documentElement;
const loader = document.querySelector<HTMLElement>('[data-loader]');
const word = loader?.querySelector<HTMLElement>('[data-loader-word]');

if (loader && word && root.classList.contains('is-loading')) {
  const es = root.lang.startsWith('es');
  // Empieza en el idioma del sitio, pasa por otros y cierra en "Mattriz."
  const WORDS = es ? ['Hola', 'Hello', 'Bonjour', 'Olá', 'Ciao', 'Hallo', 'Hej'] : ['Hello', 'Hola', 'Bonjour', 'Olá', 'Ciao', 'Hallo', 'Hej'];
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
    // Solo cuenta el fin del telón (no el del texto, que se desvanece antes).
    const done = (e: TransitionEvent) => {
      if (e.target !== loader) return;
      loader.removeEventListener('transitionend', done);
      loader.remove();
    };
    loader.addEventListener('transitionend', done);
    setTimeout(() => loader.remove(), 1500);
  };

  const tick = () => {
    const t = performance.now() - start;
    if ((ready && t >= MIN && i >= 3) || t > MAX) {
      word.innerHTML = 'Mattriz<i>.</i>';
      setTimeout(finish, 700);
      return;
    }
    word.textContent = WORDS[i % WORDS.length];
    i++;
    setTimeout(tick, i === 1 ? 300 : STEP);
  };
  tick();
}

export {};
