// v2: loader (src/components/Loader.astro). Mientras la página carga pasan saludos en varios
// idiomas (uno cada ~240 ms, sin repetir). Cuando la página está lista (fuentes + evento
// load, mínimo 2.1 s) cierra con el saludo en el idioma del sitio (punto en verde) y el fondo blanco
// sube como un telón: la palabra no se mueve, el borde del telón la va cubriendo. Tope: 4 s.

const root = document.documentElement;
const loader = document.querySelector<HTMLElement>('[data-loader]');
const word = loader?.querySelector<HTMLElement>('[data-loader-word]');

if (loader && word && root.classList.contains('is-loading')) {
  const es = root.lang.startsWith('es');
  // Pasa por varios idiomas y cierra en el del sitio.
  const FINAL = es ? 'Hola' : 'Hello';
  // Dieciséis saludos distintos: alcanzan para el tope de 4 s sin repetir ninguno.
  const WORDS = [es ? 'Hello' : 'Hola', 'Bonjour', 'Olá', 'Ciao', 'Hallo', 'Hej', 'Ahoj', 'Aloha', 'Merhaba', 'Namaste', 'Jambo', 'Salut', 'Szia', 'Konnichiwa', 'Ni hao', 'Hei'];
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
      // Un solo span: el punto verde queda en la misma línea y la palabra no se mueve.
      word.innerHTML = `<span>${FINAL}<i>.</i></span>`;
      setTimeout(finish, 600);
      return;
    }
    word.textContent = WORDS[Math.min(i, WORDS.length - 1)];
    i++;
    setTimeout(tick, i === 1 ? 300 : STEP);
  };
  tick();
}

export {};
