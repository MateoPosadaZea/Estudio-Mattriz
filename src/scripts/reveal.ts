// Animaciones de entrada portadas de Salient (parámetros leídos de su JS y CSS).
//
// [data-split="letters"]  Letra por letra desde abajo: translateY(1.3em) → 0,
//                         1200 ms cubic-bezier(0.25, 1, 0.5, 1), escalonado de
//                         400 ms / nº de letras (entre 20 y 35 ms). data-desktop-only:
//                         por debajo de 1000 px no se anima.
// [data-split="words"]    Palabra por palabra: translateY(1.3em) → 0, 400 ms easeOutQuart;
//                         con data-stagger, 500 ms / nº de palabras (entre 15 y 50 ms).
// [data-animate="fade-up"]   Columna: translateY(100px) y opacidad 0 → 400 ms easeOutQuart.
// [data-animate="draw"]      Divisor: scaleX(0 → 1) desde la izquierda, 1500 ms.
// [data-animate="cards"]     Tarjetas: translateY(80px) y opacidad 0, 750 ms, 90 ms entre tarjetas.
//
// Todas se disparan cuando el elemento queda entero en pantalla ("bottom-in-view"),
// una sola vez. Con prefers-reduced-motion no se anima nada (el CSS deja todo en su sitio).

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const clamp = (v: number, min: number, max: number) => Math.min(Math.max(v, min), max);

function prepareSplit(el: HTMLElement) {
  const letters = el.dataset.split === 'letters';
  const inners = [...el.querySelectorAll<HTMLElement>('.split__inner')];
  const base = Number(el.dataset.delay || 0);
  let step = 0;
  if (letters) step = clamp(400 / inners.length, 20, 35);
  else if (el.dataset.stagger !== undefined) step = clamp(500 / inners.length, 15, 50);
  inners.forEach((inner, i) => (inner.style.transitionDelay = `${base + i * step}ms`));
}

function prepareCards(el: HTMLElement) {
  [...el.children].forEach((card, i) => ((card as HTMLElement).style.transitionDelay = `${i * 90}ms`));
}

function show(el: HTMLElement) {
  el.classList.add('is-in');
  if (el.dataset.animate === 'cards') {
    // Tras entrar, sin retraso para que el hover responda al instante.
    window.setTimeout(() => [...el.children].forEach((c) => ((c as HTMLElement).style.transitionDelay = '')), 90 * el.children.length + 800);
  }
}

const targets = document.querySelectorAll<HTMLElement>('[data-split], [data-animate]');

if (reduceMotion || !('IntersectionObserver' in window)) {
  targets.forEach((el) => el.classList.add('is-in'));
} else {
  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        const el = entry.target as HTMLElement;
        const r = entry.boundingClientRect;
        // "bottom-in-view": el borde inferior entró en la ventana (o el elemento es más alto que ella).
        // Las grillas de tarjetas arrancan apenas asoman: cada tarjeta lleva su propio retraso.
        const ready = el.dataset.animate === 'cards' ? entry.intersectionRatio > 0 : r.bottom <= window.innerHeight + 1 || r.top <= 0;
        if (entry.isIntersecting && ready) {
          show(el);
          observer.unobserve(el);
        }
      }
    },
    { threshold: Array.from({ length: 21 }, (_, i) => i / 20) },
  );

  targets.forEach((el) => {
    if (el.dataset.split) prepareSplit(el);
    if (el.dataset.animate === 'cards') prepareCards(el);
    observer.observe(el);
  });
}

export {};
