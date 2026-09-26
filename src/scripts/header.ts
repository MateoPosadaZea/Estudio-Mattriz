// v2: marca el header cuando la página ya bajó (en móvil el logo se recoge a la M).
const header = document.querySelector<HTMLElement>('[data-site-header]');

if (header) {
  let scrolled = false;
  const update = () => {
    const next = window.scrollY > 40;
    if (next !== scrolled) header.classList.toggle('is-scrolled', (scrolled = next));
  };
  update();
  window.addEventListener('scroll', update, { passive: true });
}

export {};
