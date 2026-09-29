// v2: reel del home (src/components/home2/Hero.astro). La miniatura es un video corto en bucle
// (lo carga lazy-video). Al hacer clic se abre el reel completo en un <dialog>: el archivo se pide
// solo en ese momento (en pantallas angostas, la versión de 720 px). Se cierra con el botón, con
// Escape o haciendo clic fuera del video; al cerrar se pausa.
import { startScroll, stopScroll } from './smooth-scroll';

const open = document.querySelector<HTMLButtonElement>('[data-reel-open]');
const modal = document.querySelector<HTMLDialogElement>('[data-reel-modal]');
const video = modal?.querySelector<HTMLVideoElement>('video');

if (open && modal && video && typeof modal.showModal === 'function') {
  const narrow = matchMedia('(max-width: 999px)').matches;
  const thumb = open.querySelector<HTMLVideoElement>('video');

  open.addEventListener('click', () => {
    if (!video.getAttribute('src')) video.setAttribute('src', (narrow && video.dataset.fullMobile) || video.dataset.full!);
    video.currentTime = 0;
    modal.showModal();
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
