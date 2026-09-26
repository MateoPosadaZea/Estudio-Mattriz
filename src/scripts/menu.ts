// v2: menú mobile a pantalla completa.
//
// Abre con una cortina (clip-path) que baja desde arriba y los links suben
// escalonados; cierra al revés. La página queda inert y sin scroll mientras
// el menú está abierto. Con prefers-reduced-motion todo es instantáneo.

const page = document.querySelector<HTMLElement>('[data-page]');
const panel = document.getElementById('mobile-menu');
const openButton = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closeButton = document.querySelector<HTMLButtonElement>('[data-menu-close]');

if (page && panel && openButton && closeButton) {
  const root = document.documentElement;
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let isOpen = false;

  const afterTransition = (done: () => void) => {
    if (reduceMotion.matches) return done();
    const onEnd = (event: TransitionEvent) => {
      if (event.target !== panel || event.propertyName !== 'clip-path') return;
      panel.removeEventListener('transitionend', onEnd);
      done();
    };
    panel.addEventListener('transitionend', onEnd);
  };

  // Con teclado el foco va al botón de cerrar (con su anillo); con toque o clic va al panel, sin
  // recuadro visible, y el Tab sigue desde ahí.
  const open = (keyboard: boolean) => {
    if (isOpen) return;
    isOpen = true;
    panel.hidden = false;
    root.classList.add('menu-open');
    openButton.setAttribute('aria-expanded', 'true');
    page.setAttribute('inert', '');
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        panel.classList.add('is-open');
        if (keyboard) closeButton.focus({ preventScroll: true });
        else panel.focus({ preventScroll: true });
      });
    });
  };

  const close = (then?: () => void) => {
    if (!isOpen) return;
    isOpen = false;
    panel.classList.remove('is-open');
    page.removeAttribute('inert');
    openButton.setAttribute('aria-expanded', 'false');
    afterTransition(() => {
      root.classList.remove('menu-open');
      panel.hidden = true;
      if (then) then();
      else openButton.focus({ preventScroll: true });
    });
  };

  openButton.addEventListener('click', (event) => open(event.detail === 0));
  closeButton.addEventListener('click', () => close());
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') close();
  });

  // Foco atrapado dentro del menú.
  panel.addEventListener('keydown', (event) => {
    if (event.key !== 'Tab') return;
    const items = [...panel.querySelectorAll<HTMLElement>('a[href], button')];
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
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
