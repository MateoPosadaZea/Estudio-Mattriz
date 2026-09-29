// v2: reel del home (src/components/home2/Studio.astro). La miniatura es un video corto en bucle
// (lo carga lazy-video). Al hacer clic se abre el reel completo en un <dialog>: el archivo se pide
// solo en ese momento. En el celular en vertical se abre la versión vertical (9:16, la misma de
// Instagram); en pantallas angostas en horizontal, la de 720 px. Se cierra con el botón, con
// Escape o haciendo clic fuera del video; al cerrar se pausa.
import { startScroll, stopScroll } from './smooth-scroll';

const open = document.querySelector<HTMLButtonElement>('[data-reel-open]');
const modal = document.querySelector<HTMLDialogElement>('[data-reel-modal]');
const video = modal?.querySelector<HTMLVideoElement>('video');

if (open && modal && video && typeof modal.showModal === 'function') {
  const narrow = matchMedia('(max-width: 999px)').matches;
  const thumb = open.querySelector<HTMLVideoElement>('video');

  const portrait = matchMedia('(max-width: 699px) and (orientation: portrait)');
  const frame = video.parentElement;

  open.addEventListener('click', () => {
    // Se decide al abrir: si el celular está en vertical, el reel vertical.
    const vertical = portrait.matches && !!video.dataset.fullVertical;
    const src = vertical ? video.dataset.fullVertical! : (narrow && video.dataset.fullMobile) || video.dataset.full!;
    frame?.classList.toggle('is-vertical', vertical);
    if (video.getAttribute('src') !== src) {
      video.setAttribute('poster', vertical ? video.dataset.posterVertical! : video.dataset.poster!);
      video.setAttribute('src', src);
    }
    video.currentTime = 0;
    modal.showModal();
    // El diálogo enfoca solo el botón de cerrar y Safari le dibuja el anillo de foco; se enfoca el
    // video (sin anillo). Con Tab se llega a Cerrar igual.
    frame?.focus({ preventScroll: true });
    stopScroll();
    thumb?.pause();
    video.play().catch(() => {});
  });

  modal.addEventListener('close', () => {
    video.pause();
    startScroll();
    thumb?.play().catch(() => {});
    open.focus({ preventScroll: true });
  });

  modal.querySelector('[data-reel-close]')?.addEventListener('click', () => modal.close());
  // Clic fuera del video (en el fondo del diálogo) también cierra.
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
  // Clic en el video: pausa o sigue.
  video.addEventListener('click', () => (video.paused ? video.play().catch(() => {}) : video.pause()));
}

export {};
