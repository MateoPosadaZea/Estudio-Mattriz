// v2: movimiento de los casos de estudio.
//
// [data-case-reveal]  Sube y aparece cuando entra en pantalla (una vez).
// [data-case-grow]    El video principal crece hasta el ancho completo mientras sube a la
//                     parte de arriba de la ventana y pierde las esquinas redondeadas.
// [data-parallax]     La imagen se desplaza dentro de su marco, más lento que el scroll.
//
// Con prefers-reduced-motion todo queda quieto y visible desde el principio.

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const reveals = document.querySelectorAll<HTMLElement>('[data-case-reveal]');

if (reduceMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;
        entry.target.classList.add('is-in');
        io.unobserve(entry.target);
      }
    },
    { rootMargin: '0px 0px -12% 0px' },
  );
  reveals.forEach((el) => io.observe(el));

  const grow = document.querySelector<HTMLElement>('[data-case-grow]');
  const growInner = grow?.firstElementChild as HTMLElement | null;
  const frames = [...document.querySelectorAll<HTMLElement>('[data-parallax]')];
  const visible = new Set<HTMLElement>();

  const pio = new IntersectionObserver((entries) => {
    for (const e of entries) (e.isIntersecting ? visible.add(e.target as HTMLElement) : visible.delete(e.target as HTMLElement));
  });
  frames.forEach((f) => pio.observe(f));

  let ticking = false;
  const update = () => {
    ticking = false;
    const vh = window.innerHeight;

    if (grow && growInner) {
      const r = grow.getBoundingClientRect();
      const p = Math.min(Math.max(1 - r.top / vh, 0), 1);
      // Escala necesaria para que la caja interior llegue a los bordes de la ventana.
      const max = document.documentElement.clientWidth / growInner.offsetWidth - 1;
      growInner.style.setProperty('--grow', p.toFixed(4));
      growInner.style.setProperty('--grow-max', max.toFixed(4));
    }

    for (const f of visible) {
      const r = f.getBoundingClientRect();
      // −1 cuando el marco entra por abajo, 1 cuando sale por arriba.
      const t = (vh / 2 - (r.top + r.height / 2)) / (vh / 2 + r.height / 2);
      const child = f.firstElementChild as HTMLElement | null;
      child?.style.setProperty('--py', `${(t * r.height * 0.045).toFixed(1)}px`);
    }
  };

  const onScroll = () => {
    if (!ticking) {
      ticking = true;
      requestAnimationFrame(update);
    }
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll);
  update();
}

export {};
