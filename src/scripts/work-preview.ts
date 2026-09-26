// v2: vista previa de "Selected Work" que sigue al cursor.
// Solo con mouse y a partir de 1000px; con prefers-reduced-motion no se usa.
// Las piezas se cargan la primera vez que se pasa por su fila; el video se pausa al salir.

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
    if (!item || item === active) return;
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

  root.querySelector('ol')?.addEventListener('pointerleave', hide);
  window.addEventListener('scroll', hide, { passive: true });
}

export {};
