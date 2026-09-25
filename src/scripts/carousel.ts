// Carrusel de testimonios (equivalente al Flickity "multiple visible" del vivo):
// tarjetas centradas, vuelta infinita, la seleccionada resaltada, flechas,
// arrastre táctil y rotación automática cada 4 s (se pausa con el mouse encima o con foco).

const AUTOPLAY_MS = 4000;

document.querySelectorAll<HTMLElement>('[data-carousel]').forEach((root) => {
  const track = root.querySelector<HTMLElement>('[data-carousel-track]')!;
  const slides = [...track.children] as HTMLElement[];
  const n = slides.length;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  let index = 0;
  let timer = 0;

  // Cada tarjeta se ubica en la posición relativa más corta respecto a la seleccionada.
  const render = () => {
    slides.forEach((slide, i) => {
      let offset = i - index;
      if (offset > n / 2) offset -= n;
      if (offset < -n / 2) offset += n;
      const prev = Number(slide.dataset.offset ?? offset);
      // Si salta de un extremo al otro, se mueve sin transición para no cruzar la pantalla.
      slide.style.transition = Math.abs(prev - offset) > 1 ? 'none' : '';
      slide.style.transform = `translateX(${offset * 100}%)`;
      slide.dataset.offset = String(offset);
      const selected = offset === 0;
      slide.classList.toggle('is-selected', selected);
      slide.setAttribute('aria-hidden', String(!selected));
    });
  };

  const go = (to: number) => {
    index = (to + n) % n;
    render();
  };

  const stop = () => window.clearInterval(timer);
  const play = () => {
    stop();
    if (!reduce) timer = window.setInterval(() => go(index + 1), AUTOPLAY_MS);
  };

  root.querySelector('[data-carousel-prev]')?.addEventListener('click', () => {
    go(index - 1);
    play();
  });
  root.querySelector('[data-carousel-next]')?.addEventListener('click', () => {
    go(index + 1);
    play();
  });
  root.addEventListener('pointerenter', stop);
  root.addEventListener('pointerleave', play);
  root.addEventListener('focusin', stop);
  root.addEventListener('focusout', play);

  // Arrastre / swipe
  let startX: number | null = null;
  track.addEventListener('pointerdown', (e) => (startX = e.clientX));
  window.addEventListener('pointerup', (e) => {
    if (startX === null) return;
    const dx = e.clientX - startX;
    startX = null;
    if (Math.abs(dx) > 40) {
      go(index + (dx < 0 ? 1 : -1));
      play();
    }
  });

  render();
  play();
});

export {};
