// Reserva contada con el scroll (bloque 'scrolly' de un caso): la sección se fija, la grabación real
// de la reserva avanza cuadro a cuadro con el scroll y se enciende cada paso; el último muestra el
// resumen del pago. GSAP y los cuadros cargan solo cuando la sección se acerca. Con movimiento
// reducido no se carga nada y queda la versión fija (primer cuadro y todos los pasos).
const root = document.querySelector<HTMLElement>('[data-scrolly]');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (root && !reduce) {
  const io = new IntersectionObserver(
    (entries) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      init(root);
    },
    { rootMargin: '1200px 0px' },
  );
  io.observe(root);
}

async function init(el: HTMLElement) {
  const [{ gsap }, { ScrollTrigger }, { lenis }] = await Promise.all([import('gsap'), import('gsap/ScrollTrigger'), import('./smooth-scroll')]);
  gsap.registerPlugin(ScrollTrigger);
  if (lenis) lenis.on('scroll', ScrollTrigger.update);

  const dir = el.dataset.dir!;
  const count = Number(el.dataset.count);
  const starts: number[] = JSON.parse(el.dataset.starts!);
  const canvas = el.querySelector('canvas')!;
  const ctx = canvas.getContext('2d')!;
  const end = el.querySelector<HTMLElement>('.case-scrolly__end')!;
  const items = [...el.querySelectorAll('.case-scrolly__steps li')];
  const list = el.querySelector<HTMLElement>('.case-scrolly__steps')!;
  const bar = el.querySelector<HTMLElement>('.case-scrolly__bar')!;
  const fill = bar.querySelector('i')!;

  // Cuadros: se piden todos, en orden; si el que toca aún no llegó se dibuja el más cercano ya cargado.
  const frames = Array.from({ length: count }, (_, i) => {
    const im = new Image();
    im.decoding = 'async';
    im.src = `${dir}/${String(i + 1).padStart(3, '0')}.webp`;
    return im;
  });
  let current = -1;
  const draw = (f: number) => {
    const i = Math.max(0, Math.min(count - 1, Math.round(f)));
    if (i === current) return;
    let k = i;
    while (k > 0 && !(frames[k].complete && frames[k].naturalWidth)) k--;
    if (!(frames[k].complete && frames[k].naturalWidth)) return;
    ctx.drawImage(frames[k], 0, 0, canvas.width, canvas.height);
    current = k === i ? i : -1;
  };
  frames[0].addEventListener('load', () => draw(0), { once: true });

  const setStep = (k: number) => items.forEach((li, j) => li.classList.toggle('is-on', j === k));
  const placeBar = () => {
    bar.style.top = `${list.offsetTop}px`;
    bar.style.height = `${list.offsetHeight}px`;
  };

  el.classList.add('is-live');
  placeBar();
  window.addEventListener('resize', placeBar);

  const st = { f: 0 };
  const steps = items.length;
  const tl = gsap.timeline({
    defaults: { ease: 'none' },
    scrollTrigger: {
      trigger: el.querySelector('.case-scrolly__pin'),
      pin: true,
      start: 'top top',
      end: () => '+=' + window.innerHeight * 5,
      scrub: 0.6,
      invalidateOnRefresh: true,
    },
  });
  // Cada paso grabado recibe el mismo tramo de scroll, aunque en la grabación duren distinto.
  for (let k = 0; k < steps - 1; k++) {
    tl.to(st, { f: starts[k + 1], duration: 1, onUpdate: () => (draw(st.f), setStep(k)) }).to(fill, { scaleY: (k + 1) / steps, duration: 1 }, '<');
  }
  tl.to(end, { opacity: 1, duration: 0.6, onStart: () => setStep(steps - 1), onReverseComplete: () => setStep(steps - 2) })
    .to(fill, { scaleY: 1, duration: 0.6 }, '<')
    .to({}, { duration: 0.6 });
  ScrollTrigger.refresh();
}
