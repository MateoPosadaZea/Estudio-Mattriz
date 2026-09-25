// "Selected Work" en pantallas < 992 px: tarjetas con filtro por categoría,
// "Load More" (el vivo muestra 6 y carga el resto) y videos que se cargan al entrar en pantalla.

const grid = document.querySelector<HTMLElement>('[data-work-grid]');

if (grid) {
  const cards = [...grid.querySelectorAll<HTMLElement>('[data-work-card]')];
  const toggle = document.querySelector<HTMLButtonElement>('[data-filter-toggle]');
  const filters = document.querySelector<HTMLElement>('[data-filter-list]');
  const more = document.querySelector<HTMLButtonElement>('[data-load-more]');
  const PAGE = 6;
  let shown = PAGE;
  let active = 'all';

  const update = () => {
    let visible = 0;
    cards.forEach((card) => {
      const matches = active === 'all' || card.dataset.categories!.split(' ').includes(active);
      const show = matches && (active !== 'all' || visible < shown);
      if (matches) visible++;
      card.hidden = !show;
    });
    if (more) more.hidden = active !== 'all' || shown >= cards.length;
  };

  toggle?.addEventListener('click', () => {
    const open = toggle.getAttribute('aria-expanded') !== 'true';
    toggle.setAttribute('aria-expanded', String(open));
    if (filters) filters.hidden = !open;
  });

  filters?.querySelectorAll<HTMLButtonElement>('[data-filter]').forEach((btn) => {
    btn.addEventListener('click', () => {
      active = btn.dataset.filter!;
      filters.querySelectorAll('[data-filter]').forEach((b) => b.setAttribute('aria-pressed', String(b === btn)));
      update();
    });
  });

  more?.addEventListener('click', () => {
    shown = cards.length;
    update();
  });

  // Videos: se cargan y reproducen solo cuando la tarjeta está en pantalla.
  const io = new IntersectionObserver((entries) => {
    for (const e of entries) {
      const video = e.target as HTMLVideoElement;
      if (e.isIntersecting) {
        if (!video.src && video.dataset.src) video.src = video.dataset.src;
        video.play().catch(() => {});
      } else if (!video.paused) video.pause();
    }
  }, { rootMargin: '200px 0px' });
  grid.querySelectorAll('video').forEach((v) => io.observe(v));

  update();
}

export {};
