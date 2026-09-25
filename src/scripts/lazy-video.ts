// Videos con data-src: se cargan y reproducen al acercarse a la pantalla y se pausan al salir.
// Con prefers-reduced-motion se cargan pero no se reproducen solos (queda el póster o el primer cuadro).
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const videos = document.querySelectorAll<HTMLVideoElement>('video[data-src]');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting } of entries) {
        const v = target as HTMLVideoElement;
        if (isIntersecting) {
          if (!v.src) v.src = v.dataset.src!;
          if (!reduce) v.play().catch(() => {});
        } else if (v.src) {
          v.pause();
        }
      }
    },
    { rootMargin: '200px 0px' },
  );
  videos.forEach((v) => io.observe(v));
} else {
  videos.forEach((v) => (v.src = v.dataset.src!));
}

export {};
