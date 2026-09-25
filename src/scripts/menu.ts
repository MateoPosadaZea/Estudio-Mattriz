// Menú mobile estilo "material" (Salient).
//
// Vivo, medido a 390 y 768 px: la página entera (header incluido) se encoge a
// 0.84 (0.835 sobre 690 px) y se corre a la izquierda en
// transform 0.8s cubic-bezier(0.15, 0.2, 0.1, 1), dejando ver el panel negro
// que está detrás. El desplazamiento medido fue −304.7 px a 390 y −389.1 px a
// 768; la recta que pasa por ambos puntos es −(0.2234 · ancho + 217.5).

const page = document.querySelector<HTMLElement>('[data-page]');
const inner = document.querySelector<HTMLElement>('[data-page-inner]');
const panel = document.getElementById('mobile-menu');
const openButton = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closeButton = document.querySelector<HTMLButtonElement>('[data-menu-close]');

if (page && inner && panel && openButton && closeButton) {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let savedScroll = 0;
  let isOpen = false;

  const pageTransform = () => {
    const w = window.innerWidth;
    const scale = w <= 690 ? 0.84 : 0.835;
    const shift = -(0.2234 * w + 217.5);
    return `translateX(${shift}px) scale(${scale})`;
  };

  const afterTransition = (done: () => void) => {
    if (reduceMotion.matches) return done();
    const onEnd = (event: TransitionEvent) => {
      if (event.target !== page || event.propertyName !== 'transform') return;
      page.removeEventListener('transitionend', onEnd);
      done();
    };
    page.addEventListener('transitionend', onEnd);
  };

  const open = () => {
    if (isOpen) return;
    isOpen = true;
    savedScroll = window.scrollY;
    panel.hidden = false;
    root.classList.add('menu-open');
    // La página pasa a ser una "tarjeta" del tamaño de la ventana que conserva la posición de scroll.
    page.classList.add('is-locked');
    inner.style.transform = `translateY(${-savedScroll}px)`;
    openButton.setAttribute('aria-expanded', 'true');
    page.setAttribute('inert', '');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        page.style.transform = pageTransform();
        panel.classList.add('is-open');
        closeButton.focus();
      });
    });
  };

  const close = (then?: () => void) => {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove('is-open');
    page.style.transform = '';
    page.removeAttribute('inert');
    openButton.setAttribute('aria-expanded', 'false');
    afterTransition(() => {
      page.classList.remove('is-locked');
      inner.style.transform = '';
      root.classList.remove('menu-open');
      panel.hidden = true;
      window.scrollTo({ top: savedScroll, behavior: 'instant' });
      if (then) then();
      else openButton.focus();
    });
  };

  openButton.addEventListener('click', (event) => {
    event.stopPropagation();
    open();
  });
  closeButton.addEventListener('click', () => close());
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });
  // Clic en la franja visible de la página: cierra. (La página está inert,
  // así que el clic le llega al documento, no a ella.)
  document.addEventListener('click', (event) => {
    if (isOpen && !panel.contains(event.target as Node)) close();
  });
  // Anclas de la misma página: cerrar primero y después desplazarse.
  panel.querySelectorAll<HTMLAnchorElement>('a[href]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const url = new URL(link.href);
      if (url.pathname !== window.location.pathname || !url.hash) return;
      event.preventDefault();
      close(() => {
        const target = document.querySelector(url.hash);
        target?.scrollIntoView({ behavior: reduceMotion.matches ? 'auto' : 'smooth' });
        history.pushState(null, '', url.hash);
      });
    });
  });
  // Si la ventana pasa a desktop con el menú abierto, se cierra.
  window.matchMedia('(min-width: 1000px)').addEventListener('change', (event) => {
    if (event.matches) close();
  });
}
