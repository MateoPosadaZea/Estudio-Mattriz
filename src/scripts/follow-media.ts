// "Selected Work" en desktop: al pasar por una fila, su imagen o video aparece y sigue al cursor.
//
// Medido en el vivo: el medio (288×216, radio 10) se centra en
//   x = ancho de ventana / 2 + cursorX / 2,  y = cursorY − 3
// y se acerca a ese punto con un suavizado de ~13 % por fotograma.
// Aparece con opacidad y un recorte que se abre (clip-path inset 7 % → 0).

const EASE = 0.13;
const list = document.querySelector<HTMLElement>('[data-follow-list]');

if (list && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
  const medias = [...list.querySelectorAll<HTMLElement>('[data-follow-media]')];
  let target = { x: window.innerWidth / 2, y: window.innerHeight / 2 };
  let pos = { ...target };
  let active: HTMLElement | null = null;
  let running = false;

  const place = () => {
    const t = `translate(${pos.x}px, ${pos.y}px) translate(-50%, -50%)`;
    medias.forEach((m) => (m.style.transform = t));
  };

  const loop = () => {
    pos.x += (target.x - pos.x) * EASE;
    pos.y += (target.y - pos.y) * EASE;
    place();
    if (active || Math.abs(target.x - pos.x) > 0.5 || Math.abs(target.y - pos.y) > 0.5) requestAnimationFrame(loop);
    else running = false;
  };

  const start = () => {
    if (!running) {
      running = true;
      requestAnimationFrame(loop);
    }
  };

  list.addEventListener('pointermove', (e) => {
    target = { x: window.innerWidth / 2 + e.clientX / 2, y: e.clientY - 3 };
    start();
  });

  list.querySelectorAll<HTMLElement>('[data-follow-item]').forEach((item) => {
    const media = item.querySelector<HTMLElement>('[data-follow-media]');
    item.addEventListener('pointerenter', (e) => {
      if (!active) {
        // Primera entrada: el medio arranca junto al punto de destino, no en el centro.
        target = { x: window.innerWidth / 2 + e.clientX / 2, y: e.clientY - 3 };
      }
      active = media;
      media?.classList.add('is-active');
      const video = media?.querySelector('video');
      if (video) {
        if (!video.src && video.dataset.src) video.src = video.dataset.src;
        video.play().catch(() => {});
      }
      start();
    });
    item.addEventListener('pointerleave', () => {
      media?.classList.remove('is-active');
      if (active === media) active = null;
    });
  });
  place();
}

export {};
