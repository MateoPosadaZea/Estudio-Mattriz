// v2: vista previa de "Selected Work" que sigue al cursor.
// Solo con mouse y a partir de 1000px; con prefers-reduced-motion no se usa.
// Las portadas se precargan cuando la lista se acerca a la pantalla, así aparecen al instante; el
// video de cada pieza se carga al pasar por su fila y se pausa al salir. Durante el scroll sigue
// mostrando, al instante, la pieza de la fila que queda bajo el cursor.

const root = document.querySelector<HTMLElement>('[data-work]');
const preview = root?.querySelector<HTMLElement>('[data-work-preview]');
const canHover = window.matchMedia('(hover: hover) and (min-width: 1000px)');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (root && preview && !reduce) {
  const items = [...preview.querySelectorAll<HTMLElement>('[data-work-preview-item]')];
  let active: HTMLElement | null = null;
  let x = 0;
  let y = 0;
  let cx = 0;
  let cy = 0;
  let raf = 0;
  let hovering = false;

  // Portada: el póster de un video (o la imagen) se pide antes, para que aparezca al instante.
  const arm = (item: HTMLElement) => {
    const media = item.firstElementChild as HTMLImageElement | HTMLVideoElement | null;
    if (!media) return media;
    if (media instanceof HTMLVideoElement) {
      if (media.dataset.poster && !media.getAttribute('poster')) {
        media.setAttribute('poster', media.dataset.poster);
        new Image().src = media.dataset.poster;
      }
    } else if (!media.getAttribute('src')) media.setAttribute('src', media.dataset.previewSrc!);
    return media;
  };
  // El video en sí se carga solo cuando se pasa por su fila (no los ocho a la vez).
  const load = (item: HTMLElement) => {
    const media = arm(item);
    if (media && !media.getAttribute('src')) media.setAttribute('src', media.dataset.previewSrc!);
    return media;
  };

  // El marco va detrás del cursor con un poco de inercia.
  const tick = () => {
    cx += (x - cx) * 0.18;
    cy += (y - cy) * 0.18;
    preview.style.setProperty('--x', `${cx.toFixed(1)}px`);
    preview.style.setProperty('--y', `${cy.toFixed(1)}px`);
    raf = Math.abs(x - cx) + Math.abs(y - cy) > 0.3 ? requestAnimationFrame(tick) : 0;
  };

  const show = (index: number) => {
    const item = items[index];
    if (!item) return;
    // Misma fila: solo volver a mostrar (p. ej. después de un scroll o de salir y entrar).
    if (item === active) {
      preview.classList.add('is-on');
      const media = item.firstElementChild;
      if (media instanceof HTMLVideoElement) media.play().catch(() => {});
      return;
    }
    if (active) {
      active.classList.remove('is-active');
      (active.firstElementChild as HTMLVideoElement | null)?.pause?.();
    }
    active = item;
    const media = load(item);
    item.classList.add('is-active');
    if (media instanceof HTMLVideoElement) media.play().catch(() => {});
    preview.classList.add('is-on');
  };

  const hide = () => {
    preview.classList.remove('is-on');
    if (active) (active.firstElementChild as HTMLVideoElement | null)?.pause?.();
  };

  root.querySelectorAll<HTMLElement>('[data-work-row]').forEach((row) => {
    row.addEventListener('pointerenter', (e) => {
      if (!canHover.matches || e.pointerType !== 'mouse') return;
      if (!preview.classList.contains('is-on')) {
        cx = x = e.clientX;
        cy = y = e.clientY;
        tick();
      }
      show(Number(row.dataset.workRow));
    });
  });

  root.addEventListener('pointermove', (e) => {
    if (e.pointerType !== 'mouse') return;
    x = e.clientX;
    y = e.clientY;
    if (!raf) raf = requestAnimationFrame(tick);
  });

  root.querySelector('ol')?.addEventListener('pointerleave', () => {
    hovering = false;
    hide();
  });
  root.querySelector('ol')?.addEventListener('pointerenter', () => (hovering = true));

  // Al hacer scroll no se esconde ni espera a que pare (con el scroll suave eso tardaba cerca de un
  // segundo): en cada cuadro muestra la fila que queda bajo el cursor, o se esconde si no hay.
  // La posición del mouse se sigue en toda la página: si la lista pasa por debajo de un cursor
  // quieto, el navegador no siempre avisa que entró.
  let mx = -1;
  let my = -1;
  window.addEventListener('pointermove', (e) => e.pointerType === 'mouse' && ((mx = e.clientX), (my = e.clientY)), { passive: true });
  let scrollRaf = 0;
  window.addEventListener(
    'scroll',
    () => {
      if (scrollRaf || mx < 0 || !canHover.matches) return;
      scrollRaf = requestAnimationFrame(() => {
        scrollRaf = 0;
        const row = document.elementFromPoint(mx, my)?.closest<HTMLElement>('[data-work-row]');
        if (row && root.contains(row)) {
          if (!preview.classList.contains('is-on')) {
            cx = x = mx;
            cy = y = my;
            tick();
          }
          hovering = true;
          show(Number(row.dataset.workRow));
        } else if (preview.classList.contains('is-on')) hide();
      });
    },
    { passive: true },
  );

  // Precarga: cuando la lista está cerca de la pantalla, se piden las portadas (livianas); cada
  // video se carga al pasar por su fila y mientras tanto se ve su portada.
  const preload = () => items.forEach(arm);
  if ('IntersectionObserver' in window && canHover.matches) {
    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        preload();
        io.disconnect();
      },
      { rootMargin: '600px 0px' },
    );
    io.observe(root);
  }
}

export {};
