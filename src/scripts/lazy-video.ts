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

// Videos decorativos: sin controles nativos, sin AirPlay ni imagen en imagen. La clase is-playing
// solo está mientras reproduce: si el sistema lo detiene (p. ej. modo de bajo consumo en iPhone),
// vuelve a verse la portada fija en vez del reproductor con el botón de play.
// Además nunca se abren en pantalla completa: si el sistema lo intenta (iOS/Android al tocar o al
// reproducir), se cierra de inmediato. Aplica también a los clips de testimonios y a la vista previa.
// Solo atributos y eventos (nada de asignar propiedades que un navegador pueda tener de solo
// lectura) y dentro de try/catch: si algo falla en un navegador, los videos y el resto de los
// scripts de la página siguen funcionando.
type WebkitVideo = HTMLVideoElement & { webkitExitFullscreen?: () => void };
const exitFullscreen = (v: WebkitVideo) => {
  try {
    if (document.fullscreenElement === v) document.exitFullscreen().catch(() => {});
    if (typeof v.webkitExitFullscreen === 'function') v.webkitExitFullscreen();
  } catch {}
};
document.querySelectorAll<WebkitVideo>('video[data-src], video[data-reel-src], video[data-preview-src]').forEach((v) => {
  try {
    v.setAttribute('disablepictureinpicture', '');
    v.setAttribute('disableremoteplayback', '');
    v.setAttribute('webkit-playsinline', '');
    v.setAttribute('controlslist', 'nofullscreen nodownload noremoteplayback noplaybackrate');
    v.addEventListener('webkitbeginfullscreen', () => exitFullscreen(v));
    v.addEventListener('fullscreenchange', () => exitFullscreen(v));
  } catch {}
});
videos.forEach((v) => {
  v.addEventListener('playing', () => v.classList.add('is-playing'));
  v.addEventListener('pause', () => v.classList.remove('is-playing'));
});

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
