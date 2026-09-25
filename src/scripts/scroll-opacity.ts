// Opacidad de palabras atada al scroll (Salient "scroll-opacity-reveal"), bloque "One studio".
//
// Algoritmo del vivo: todas las palabras del grupo forman una línea de tiempo lineal
// en la que cada palabra va de opacidad 0.2 a 1 en 450 ms, 150 ms después de la anterior.
// El avance es  t = 1 + (scrollY − (top del grupo + colchón)) / alto de ventana
// y se muestra el instante  t · duración total · velocidad, con
//   velocidad = 2.5 si el grupo mide menos de 1/4 de la ventana y tiene < 40 palabras;
//   si no, max(2 − min(alto/ventana, 1.45), 0.66); colchón = 5 % de la ventana
//   (25 % si la velocidad queda < 1.2, o < 1.5 con menos de 30 palabras).

const WORD_DURATION = 450;
const WORD_DELAY = 150;

class ScrollOpacity {
  private words: HTMLElement[];
  private total: number;
  private top = 0;
  private speed = 1.9;
  private cushion = 0;
  private inView = false;

  constructor(private group: HTMLElement) {
    this.words = [...group.querySelectorAll<HTMLElement>('[data-scroll-opacity] .split__inner')];
    this.total = (this.words.length - 1) * WORD_DELAY + WORD_DURATION;
    this.measure();
    window.addEventListener('resize', () => this.measure());
    new IntersectionObserver(([e]) => (this.inView = e.isIntersecting), { rootMargin: '100px 0px' }).observe(group);
    const tick = () => {
      if (this.inView && !document.documentElement.classList.contains('menu-open')) this.render();
      requestAnimationFrame(tick);
    };
    this.render();
    requestAnimationFrame(tick);
  }

  private measure() {
    const winH = window.innerHeight;
    const rect = this.group.getBoundingClientRect();
    this.top = rect.top + window.scrollY;
    const ratio = rect.height / winH;
    this.cushion = 0.05 * winH;
    if (ratio < 0.25 && this.words.length < 40) this.speed = 2.5;
    else {
      this.speed = Math.max(2 - Math.min(ratio, 1.45), 0.66);
      if (this.speed < 1.2 || (this.words.length < 30 && this.speed < 1.5)) this.cushion = 0.25 * winH;
    }
  }

  private render() {
    const t = 1 + (window.scrollY - (this.top + this.cushion)) / window.innerHeight;
    const time = t * this.total * this.speed;
    this.words.forEach((w, i) => {
      const p = Math.min(Math.max((time - i * WORD_DELAY) / WORD_DURATION, 0), 1);
      w.style.opacity = String(0.2 + 0.8 * p);
    });
  }
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.querySelectorAll<HTMLElement>('[data-scroll-opacity-group]').forEach((g) => new ScrollOpacity(g));
}

export {};
