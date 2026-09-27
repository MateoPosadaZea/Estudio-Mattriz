// Videos con data-src: mientras no están en pantalla se ve solo el póster (no se descarga nada).
// Se cargan cuando empiezan a entrar a la pantalla, se reproducen cuando ya se ve una parte
// (20 %) y se pausan al salir.
// Con prefers-reduced-motion se cargan pero no se reproducen solos (queda el póster o el primer cuadro).
const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
const videos = document.querySelectorAll<HTMLVideoElement>('video[data-src]');

if ('IntersectionObserver' in window) {
  const io = new IntersectionObserver(
    (entries) => {
      for (const { target, isIntersecting, intersectionRatio } of entries) {
        const v = target as HTMLVideoElement;
        if (isIntersecting && !v.src) v.src = v.dataset.src!;
        if (isIntersecting && intersectionRatio >= 0.2) {
          if (!reduce) v.play().catch(() => {});
        } else if (v.src) {
          v.pause();
        }
      }
    },
    { threshold: [0, 0.2] },
  );
  videos.forEach((v) => io.observe(v));
} else {
  videos.forEach((v) => (v.src = v.dataset.src!));
}

export {};
