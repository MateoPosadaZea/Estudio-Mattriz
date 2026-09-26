// v2: carrusel de testimonios del home (src/components/home2/Testimonials.astro).
// - Avanza solo cada 7 s (barra de progreso); se pausa al pasar el mouse, al enfocar dentro,
//   con el botón de pausa, o si la sección no está en pantalla.
// - En la diapositiva activa, las imágenes del proyecto pasan rápido (cada 1.1 s).
// - Con prefers-reduced-motion no avanza ni pasa imágenes solo.

const carousel = document.querySelector<HTMLElement>('[data-t-carousel]');

if (carousel) {
  const slides = [...carousel.querySelectorAll<HTMLElement>('[data-t-slide]')];
  const current = carousel.querySelector<HTMLElement>('[data-t-current]')!;
  const bar = carousel.querySelector<HTMLElement>('[data-t-progress]')!;
  const toggle = carousel.querySelector<HTMLButtonElement>('[data-t-toggle]')!;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SLIDE_MS = 7000;
  const REEL_MS = 1100;

  let index = 0;
  let userPaused = reduce;
  let hover = false;
  let visible = false;
  let elapsed = 0;
  let last = 0;
  let reelTimer = 0;

  const paused = () => userPaused || hover || !visible;

  const setToggle = () => {
    carousel.classList.toggle('is-paused', userPaused);
    toggle.setAttribute('aria-label', userPaused ? toggle.dataset.labelPlay! : toggle.dataset.labelPause!);
  };

  // Imágenes del proyecto de la diapositiva activa.
  const reel = () => {
    clearInterval(reelTimer);
    const imgs = [...(slides[index].querySelectorAll<HTMLImageElement>('[data-t-reel] img') ?? [])];
    if (imgs.length < 2 || reduce) return;
    let k = imgs.findIndex((i) => i.classList.contains('is-on'));
    reelTimer = window.setInterval(() => {
      if (paused() && !hover) return;
      imgs[k].classList.remove('is-on');
      k = (k + 1) % imgs.length;
      imgs[k].classList.add('is-on');
    }, REEL_MS);
  };

  const go = (next: number) => {
    const prev = slides[index];
    index = (next + slides.length) % slides.length;
    const slide = slides[index];
    prev.classList.remove('is-active');
    prev.setAttribute('aria-hidden', 'true');
    prev.inert = true;
    slide.classList.add('is-active');
    slide.removeAttribute('aria-hidden');
    slide.inert = false;
    current.textContent = String(index + 1).padStart(2, '0');
    // Precarga las imágenes del proyecto que entra.
    slide.querySelectorAll('img[loading="lazy"]').forEach((img) => img.removeAttribute('loading'));
    elapsed = 0;
    bar.style.transform = 'scaleX(0)';
    reel();
  };

  const loop = (now: number) => {
    const dt = last ? now - last : 0;
    last = now;
    if (!paused()) {
      elapsed += dt;
      bar.style.transform = `scaleX(${Math.min(1, elapsed / SLIDE_MS)})`;
      if (elapsed >= SLIDE_MS) go(index + 1);
    }
    requestAnimationFrame(loop);
  };

  carousel.querySelector('[data-t-prev]')!.addEventListener('click', () => go(index - 1));
  carousel.querySelector('[data-t-next]')!.addEventListener('click', () => go(index + 1));
  toggle.addEventListener('click', () => {
    userPaused = !userPaused;
    setToggle();
  });
  carousel.addEventListener('pointerenter', (e) => e.pointerType === 'mouse' && (hover = true));
  carousel.addEventListener('pointerleave', () => (hover = false));
  carousel.addEventListener('focusin', () => (hover = true));
  carousel.addEventListener('focusout', (e) => {
    if (!carousel.contains(e.relatedTarget as Node)) hover = false;
  });
  carousel.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') go(index - 1);
    if (e.key === 'ArrowRight') go(index + 1);
  });

  // Swipe en táctil.
  let startX = 0;
  carousel.addEventListener('touchstart', (e) => (startX = e.touches[0].clientX), { passive: true });
  carousel.addEventListener('touchend', (e) => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) > 50) go(index + (dx < 0 ? 1 : -1));
  });

  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => (visible = e.isIntersecting), { threshold: 0.3 }).observe(carousel);
  } else visible = true;

  setToggle();
  reel();
  requestAnimationFrame(loop);
}

export {};
