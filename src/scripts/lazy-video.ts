// Videos con data-src: lejos de la pantalla se ve solo el póster (no se descarga nada).
// Se empiezan a cargar una pantalla antes de aparecer, se reproducen cuando ya se ve una parte
// (20 %) y se pausan al salir. Al reproducir llevan la clase is-playing (para mostrarlos encima
// de una portada fija sin pasar por una caja vacía).
// Con prefers-reduced-motion se cargan pero no se reproducen solos (queda el póster o el primer cuadro).
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const videos = document.querySelectorAll<HTMLVideoElement>('video[data-src]');
// En pantallas angostas, si hay versión liviana (data-src-mobile: 720 px y más corta), se usa esa.
const narrow = matchMedia('(max-width: 999px)').matches;
const source = (v: HTMLVideoElement) => (narrow && v.dataset.srcMobile) || v.dataset.src!;

videos.forEach((v) => v.addEventListener('playing', () => v.classList.add('is-playing'), { once: true }));

if ('IntersectionObserver' in window) {
  // Carga: una pantalla antes de que aparezca.
  const loader = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        const v = target as HTMLVideoElement;
        if (isIntersecting && !v.src) {
          v.src = source(v);
          loader.unobserve(v);
        }
      }
    },
    { rootMargin: '100% 0px' },
  );
  const io = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting, intersectionRatio } of entries) {
        const v = target as HTMLVideoElement;
        if (isIntersecting && !v.src) v.src = source(v);
        if (isIntersecting && intersectionRatio >= 0.2) {
          if (!reduce) v.play().catch(() => {});
        } else if (v.src) {
          v.pause();
        }
      }
    },
    { threshold: [0, 0.2] },
  );
  videos.forEach((v) => (loader.observe(v), io.observe(v)));
} else {
  videos.forEach((v) => (v.src = source(v)));
}

export {};
