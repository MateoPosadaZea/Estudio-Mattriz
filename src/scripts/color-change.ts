// Cambio de color de fondo de la página según la sección visible (Salient "color change section").
//
// Vivo: cuando una sección marcada ocupa al menos el 40 % de la ventana (o de sí misma,
// si es más baja que la ventana), el fondo y el color de texto de la página pasan a los
// de esa sección en 0.8 s. Al bajar solo se consideran secciones por debajo de la actual,
// y al subir, por encima.

const MIN_VISIBILITY = 0.4;
const sections = [...document.querySelectorAll<HTMLElement>('[data-page-bg]')];
const root = document.documentElement;

if (sections.length) {
  let current: HTMLElement | null = null;
  let lastY = window.scrollY;
  let direction: 'down' | 'up' = 'down';
  let scheduled = false;

  const visibility = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    if (r.height === 0) return 0; // oculta (p. ej. la lista desktop en mobile)
    const winH = window.innerHeight;
    const visible = Math.min(r.bottom, winH) - Math.max(r.top, 0);
    return r.height > winH ? visible / winH : visible / r.height;
  };

  const apply = (el: HTMLElement) => {
    root.style.setProperty('--page-bg', el.dataset.pageBg!);
    root.style.setProperty('--page-text', el.dataset.pageText!);
    current = el;
  };

  const rescan = () => {
    scheduled = false;
    let best: HTMLElement | null = null;
    let bestVis = 0;
    for (const el of sections) {
      const vis = visibility(el);
      if (vis <= 0 || vis < MIN_VISIBILITY || vis <= bestVis) continue;
      if (current) {
        const cur = current.getBoundingClientRect().top;
        const top = el.getBoundingClientRect().top;
        if (direction === 'down' ? top < cur : top > cur) continue;
      }
      best = el;
      bestVis = vis;
    }
    if (best && best !== current) apply(best);
  };

  const schedule = () => {
    const y = window.scrollY;
    if (Math.abs(y - lastY) > 5) {
      direction = y > lastY ? 'down' : 'up';
      lastY = y;
    }
    if (!scheduled) {
      scheduled = true;
      requestAnimationFrame(rescan);
    }
  };

  rescan();
  // La transición se activa después del primer cálculo, como en el vivo (100 ms).
  window.setTimeout(() => root.classList.add('has-color-change'), 100);
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
}

export {};
