// v2: movimiento de los casos de estudio.
//
// [data-case-reveal]  Sube y aparece cuando entra en pantalla (una vez).
// [data-case-grow]    El video principal empieza más pequeño y crece hasta su tamaño (el ancho
//                     del contenido, con tope, para que no se pixele) mientras sube a la
//                     parte de arriba de la ventana. Siempre con esquinas redondeadas.
// [data-parallax]     La imagen se desplaza dentro de su marco, más lento que el scroll.
//
// Con prefers-reduced-motion todo queda quieto y visible desde el principio.

import { scrollToY } from './smooth-scroll';

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
      // Empieza al 72 % y crece hasta su tamaño (el ancho del contenido, con tope), nunca más.
      const scale = 0.72 + 0.28 * p;
      growInner.style.setProperty('--grow-scale', scale.toFixed(4));
      // El pie de foto sube lo que le falta a la imagen para su tamaño (el scale no mueve el flujo).
      grow.style.setProperty('--grow-shift', `${(growInner.offsetHeight * (scale - 1)).toFixed(1)}px`);
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

// [data-case-scroll]  Guía "Sigue bajando": aparece poco después de cargar y cada vez que el
//                     lector deja de hacer scroll (poco más de un segundo) con mucho caso por delante; se esconde al
//                     moverse y cerca del final. Al tocarla baja casi una pantalla.
const cue = document.querySelector<HTMLElement>('[data-case-scroll]');
if (cue) {
  const end = document.querySelector<HTMLElement>('.case-cta, .case-next');
  const room = () => {
    const limit = end ? end.getBoundingClientRect().top : document.documentElement.scrollHeight - scrollY;
    return limit > window.innerHeight * 1.6;
  };
  let idle = 0;
  const show = () => {
    if (room()) cue.classList.add('is-shown');
  };
  const arm = (ms: number) => {
    clearTimeout(idle);
    idle = window.setTimeout(show, ms);
  };
  window.addEventListener(
    'scroll',
    () => {
      cue.classList.remove('is-shown');
      arm(1200);
    },
    { passive: true },
  );
  cue.addEventListener('click', () => {
    scrollToY(window.scrollY + window.innerHeight * 0.85);
  });
  arm(scrollY < 40 ? 1600 : 1200);
}

export {};
