// v2: índice de proyectos del home (src/components/home2/Work.astro).
// Con mouse (≥1000px): al pasar por un nombre se enciende ese proyecto, el resto se apaga y sus tres
// piezas aparecen alrededor de la fila, con un leve movimiento que sigue al mouse.
// En táctil: se enciende el nombre que cruza el centro de la pantalla y se muestra su imagen debajo.
// Las imágenes se piden cuando la sección se acerca a la pantalla, no al cargar la página.

const root = document.querySelector<HTMLElement>('[data-work]');
const stage = root?.querySelector<HTMLElement>('[data-work-stage]');

if (root && stage) {
  const rows = [...root.querySelectorAll<HTMLElement>('[data-work-row]')];
  const sets = [...root.querySelectorAll<HTMLElement>('[data-work-set]')];
  const desktop = window.matchMedia('(hover: hover) and (min-width: 1000px)');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const loadAll = () =>
    root.querySelectorAll<HTMLImageElement>('img[data-src]').forEach((img) => {
      if (!img.getAttribute('src')) img.src = img.dataset.src!;
    });
  new IntersectionObserver(
    (entries, io) => {
      if (entries.some((e) => e.isIntersecting)) {
        loadAll();
        io.disconnect();
      }
    },
    { rootMargin: '600px 0px' },
  ).observe(root);

  let current = -1;
  const activate = (i: number) => {
    if (i === current) return;
    current = i;
    root.classList.toggle('has-active', i >= 0);
    rows.forEach((r, k) => r.classList.toggle('is-active', k === i));
    sets.forEach((s, k) => {
      if (k === i) {
        // Las piezas se ubican a la altura de la fila activa.
        const r = rows[k].getBoundingClientRect();
        const st = stage.getBoundingClientRect();
        s.style.setProperty('--y', `${r.top - st.top + r.height / 2}px`);
      }
      s.classList.toggle('is-active', k === i);
    });
  };

  if (desktop.matches) {
    rows.forEach((r, i) => {
      r.addEventListener('pointerenter', () => activate(i));
      r.addEventListener('focus', () => activate(i));
    });
    stage.addEventListener('pointerleave', () => activate(-1));
    rows.forEach((r) => r.addEventListener('blur', () => activate(-1)));

    // Movimiento leve: cada pieza se corre un poco hacia el mouse, con distinta intensidad.
    if (!reduce) {
      const K = [28, 44, 18];
      let raf = 0;
      let mx = 0;
      let my = 0;
      stage.addEventListener('pointermove', (e) => {
        const b = stage.getBoundingClientRect();
        mx = (e.clientX - b.left) / b.width - 0.5;
        my = (e.clientY - b.top) / b.height - 0.5;
        raf ||= requestAnimationFrame(() => {
          raf = 0;
          sets[current]?.querySelectorAll<HTMLElement>('.h-work__pic').forEach((p, k) => {
            p.style.setProperty('--px', `${(mx * K[k]).toFixed(1)}px`);
            p.style.setProperty('--py', `${(my * K[k]).toFixed(1)}px`);
          });
        });
      });
    }
  } else {
    // Táctil: el nombre que cruza la franja central de la pantalla queda encendido.
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) if (e.isIntersecting) activate(rows.indexOf(e.target as HTMLElement));
      },
      { rootMargin: '-45% 0px -45% 0px' },
    );
    rows.forEach((r) => io.observe(r));
  }
}

export {};
