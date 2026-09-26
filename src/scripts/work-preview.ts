// v2: vista previa de "Selected Work" que sigue al cursor.
// Solo con mouse y a partir de 1000px; con prefers-reduced-motion no se usa.
// Las piezas se precargan cuando la lista se acerca a la pantalla (los videos con su póster),
// así aparecen al instante; el video se pausa al salir. Al hacer scroll se esconde y, cuando el
// scroll para, vuelve a mostrar la pieza de la fila que quedó bajo el cursor.

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

  const load = (item: HTMLElement) => {
    const media = item.firstElementChild as HTMLImageElement | HTMLVideoElement | null;
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

  // Al hacer scroll se esconde; cuando para, se muestra la fila que quedó bajo el cursor.
  let scrollTimer = 0;
  window.addEventListener(
    'scroll',
    () => {
      hide();
      clearTimeout(scrollTimer);
      scrollTimer = window.setTimeout(() => {
        if (!hovering || !canHover.matches) return;
        const row = document.elementFromPoint(x, y)?.closest<HTMLElement>('[data-work-row]');
        if (row && root.contains(row)) show(Number(row.dataset.workRow));
      }, 120);
    },
    { passive: true },
  );

  // Precarga: cuando la lista está cerca de la pantalla, se cargan todas las piezas.
  const preload = () => items.forEach(load);
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
