// v2: carrusel de testimonios del home (src/components/home2/Testimonials.astro).
// - Avanza solo cada 9 s (barra de progreso); se pausa al pasar el mouse, al enfocar dentro,
//   con el botón de pausa, o si la sección no está en pantalla (los clips no cargan hasta que aparece).
// - En la diapositiva activa, el proyecto alterna clips cortos y capturas (imagen 1.1 s, clip hasta 4 s).
// - Con prefers-reduced-motion no avanza ni pasa imágenes solo.

const carousel = document.querySelector<HTMLElement>('[data-t-carousel]');

if (carousel) {
  const slides = [...carousel.querySelectorAll<HTMLElement>('[data-t-slide]')];
  const current = carousel.querySelector<HTMLElement>('[data-t-current]')!;
  const bar = carousel.querySelector<HTMLElement>('[data-t-progress]')!;
  const toggle = carousel.querySelector<HTMLButtonElement>('[data-t-toggle]')!;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const SLIDE_MS = 9000;
  const REEL_MS = 1100;
  const CLIP_MAX_MS = 4000;

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

  // Secuencia del proyecto de la diapositiva activa: una imagen dura REEL_MS; un clip corre hasta
  // terminar (2 a 3 s, con tope de CLIP_MAX_MS). Los clips se cargan solo cuando les toca.
  let reelRun = 0;
  const reel = () => {
    clearTimeout(reelTimer);
    const run = ++reelRun;
    const items = [...slides[index].querySelectorAll<HTMLElement>('[data-t-reel] > img, [data-t-reel] > video')];
    slides.forEach((s, i) => i !== index && s.querySelectorAll('video').forEach((v) => v.pause()));
    if (!items.length) return;
    let k = Math.max(0, items.findIndex((el) => el.classList.contains('is-on')));
    const show = () => {
      if (run !== reelRun) return;
      items.forEach((el, i) => el.classList.toggle('is-on', i === k));
      const el = items[k];
      const next = () => {
        if (run !== reelRun) return;
        if (paused() && !hover) return void (reelTimer = window.setTimeout(next, 300));
        k = (k + 1) % items.length;
        show();
      };
      if (el instanceof HTMLVideoElement) {
        if (!el.src) el.src = el.dataset.reelSrc!;
        el.currentTime = 0;
        if (reduce) return;
        const skip = () => { clearTimeout(reelTimer); reelTimer = window.setTimeout(next, REEL_MS); };
        el.play().catch(skip);
        el.onerror = skip;
        el.onended = () => { clearTimeout(reelTimer); next(); };
        reelTimer = window.setTimeout(next, CLIP_MAX_MS);
      } else {
        if (reduce) return;
        reelTimer = window.setTimeout(next, REEL_MS);
      }
    };
    show();
    // Precarga el primer clip de la diapositiva siguiente.
    const nextVid = slides[(index + 1) % slides.length].querySelector<HTMLVideoElement>('video[data-reel-src]');
    if (nextVid && !nextVid.src) { nextVid.preload = 'auto'; nextVid.src = nextVid.dataset.reelSrc!; }
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

  // Los clips no se cargan ni corren hasta que la sección aparece en pantalla; al salir se pausan.
  let started = false;
  const onView = (on: boolean) => {
    visible = on;
    if (on && !started) {
      started = true;
      reel();
    } else if (!on) {
      slides[index].querySelectorAll('video').forEach((v) => v.pause());
    } else {
      slides[index].querySelector<HTMLVideoElement>('[data-t-reel] > video.is-on')?.play().catch(() => {});
    }
  };
  if ('IntersectionObserver' in window) {
    new IntersectionObserver(([e]) => onView(e.isIntersecting), { threshold: 0.2 }).observe(carousel);
  } else onView(true);

  setToggle();
  requestAnimationFrame(loop);
}

export {};
