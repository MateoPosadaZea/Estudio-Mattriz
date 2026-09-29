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

// [data-step]         Pasos numerados, en orden: cada bloque (tarjetas o lista) avanza como una sola
//                     barra que recorre sus pasos uno tras otro; un paso no empieza hasta que el
//                     anterior termina. El bloque arranca cuando su primer paso sube al 85 % de la
//                     pantalla y termina cuando el último llega al 40 %. --p va de 0 a 1 por paso y,
//                     completo, el paso lleva is-done (✓).
const steps = [...document.querySelectorAll<HTMLElement>('[data-step]')];
const stepGroups = [...new Set(steps.map((s) => s.parentElement!))].map((g) => [...g.querySelectorAll<HTMLElement>(':scope > [data-step]')]);

if (reduceMotion || !('IntersectionObserver' in window)) {
  reveals.forEach((el) => el.classList.add('is-in'));
  steps.forEach((el) => (el.style.setProperty('--p', '1'), el.classList.add('is-done')));
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

    for (const group of stepGroups) {
      const first = group[0].getBoundingClientRect();
      const last = group[group.length - 1].getBoundingClientRect();
      if (last.bottom < -vh || first.top > vh * 2) continue;
      const run = vh * 0.45 + (last.top - first.top);
      const g = Math.min(Math.max((vh * 0.85 - first.top) / run, 0), 1) * group.length;
      group.forEach((st, i) => {
        const p = Math.min(Math.max(g - i, 0), 1);
        st.style.setProperty('--p', p.toFixed(3));
        st.classList.toggle('is-done', p >= 0.999);
      });
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

// [data-case-scroll]  Guía "Conoce más": aparece poco después de cargar y cada vez que el
//                     lector deja de hacer scroll (poco más de un segundo) con mucho caso por delante; se esconde al
//                     moverse y cerca del final. Al tocarla baja casi una pantalla.
// [data-case-float]   Enlace al sitio: fijo abajo a la izquierda desde que la portada sale de la
//                     pantalla hasta que aparece la sección "Visita el sitio en vivo".
const hero = document.querySelector<HTMLElement>('.case-hero');
const float = document.querySelector<HTMLElement>('[data-case-float]');
const pastHero = () => !!hero && hero.getBoundingClientRect().bottom < 0;
if (float) {
  const stop = document.querySelector<HTMLElement>('.case-visit, .case-cta');
  let raf = 0;
  const place = () => {
    raf = 0;
    const beforeEnd = !stop || stop.getBoundingClientRect().top > window.innerHeight * 0.9;
    const on = pastHero() && beforeEnd;
    float.classList.toggle('is-shown', on);
    float.tabIndex = on ? 0 : -1;
  };
  window.addEventListener('scroll', () => (raf ||= requestAnimationFrame(place)), { passive: true });
  place();
}

// La guía "Conoce más" solo acompaña la portada; después ese lugar es del enlace al sitio.
const cue = document.querySelector<HTMLElement>('[data-case-scroll]');
if (cue) {
  const end = document.querySelector<HTMLElement>('.case-cta, .case-next');
  const room = () => {
    const limit = end ? end.getBoundingClientRect().top : document.documentElement.scrollHeight - scrollY;
    return limit > window.innerHeight * 1.6;
  };
  let idle = 0;
  const show = () => {
    if (room() && !(float && pastHero())) cue.classList.add('is-shown');
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
