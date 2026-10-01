// v2: índice de proyectos del home (src/components/home2/Work.astro).
// Con mouse (≥1000px): al pasar por un nombre se enciende ese proyecto, el resto se apaga y sus tres
// piezas aparecen alrededor de la fila (loops cortos del proyecto, que se cargan y reproducen solo
// mientras ese proyecto está activo), con un leve movimiento que sigue al mouse.
// En táctil: se enciende el nombre más cercano al centro de la pantalla (se calcula en cada cuadro
// del scroll, así no se salta ninguno), su portada deja de estar atenuada y su loop se reproduce.
// Las imágenes se piden cuando la sección se acerca a la pantalla, no al cargar la página.

const root = document.querySelector<HTMLElement>('[data-work]');
const stage = root?.querySelector<HTMLElement>('[data-work-stage]');

if (root && stage) {
  const rows = [...root.querySelectorAll<HTMLElement>('[data-work-row]')];
  const sets = [...root.querySelectorAll<HTMLElement>('[data-work-set]')];
  const desktop = window.matchMedia('(hover: hover) and (min-width: 1000px)').matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Imágenes (y pósters de los loops) cuando la sección se acerca.
  new IntersectionObserver(
    (entries, io) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      root.querySelectorAll<HTMLImageElement>('img[data-src]').forEach((img) => {
        if (desktop === !img.closest('.h-work__thumb')) img.src = img.dataset.src!;
      });
      root.querySelectorAll<HTMLVideoElement>('video[data-poster]').forEach((v) => {
        if (desktop === !v.closest('.h-work__thumb')) v.poster = v.dataset.poster!;
      });
    },
    { rootMargin: '600px 0px' },
  ).observe(root);

  // Los loops del proyecto activo: se cargan la primera vez y se pausan al salir.
  const play = (set: Element | null | undefined, on: boolean) =>
    set?.querySelectorAll<HTMLVideoElement>('video').forEach((v) => {
      if (on) {
        if (!v.getAttribute('src')) v.src = v.dataset.src!;
        if (!reduce) v.play().catch(() => {});
      } else v.pause();
    });

  let current = -1;
  const activate = (i: number) => {
    if (i === current) return;
    play(desktop ? sets[current] : rows[current]?.querySelector('.h-work__thumb'), false);
    current = i;
    root.classList.toggle('has-active', i >= 0);
    rows.forEach((r, k) => r.classList.toggle('is-active', k === i));
    if (!desktop) return play(rows[i]?.querySelector('.h-work__thumb'), true);
    sets.forEach((s, k) => {
      if (k === i) {
        // Las piezas se ubican a la altura de la fila activa.
        const r = rows[k].getBoundingClientRect();
        const st = stage.getBoundingClientRect();
        s.style.setProperty('--y', `${r.top - st.top + r.height / 2}px`);
      }
      s.classList.toggle('is-active', k === i);
    });
    play(sets[i], true);
  };

  if (desktop) {
    rows.forEach((r, i) => {
      r.addEventListener('pointerenter', () => activate(i));
      r.addEventListener('focus', () => activate(i));
      r.addEventListener('blur', () => activate(-1));
    });
    stage.addEventListener('pointerleave', () => activate(-1));

    // Movimiento: cada pieza se corre y gira un poco hacia el mouse, con distinta intensidad. Se
    // interpola cuadro a cuadro (sin transición CSS), así sigue al mouse de forma continua.
    if (!reduce) {
      const K = [70, 110, 45];
      const pics = sets.map((s) => [...s.querySelectorAll<HTMLElement>('.h-work__pic')]);
      let raf = 0;
      let tx = 0;
      let ty = 0;
      let x = 0;
      let y = 0;
      const frame = () => {
        x += (tx - x) * 0.08;
        y += (ty - y) * 0.08;
        const done = Math.abs(tx - x) < 0.0005 && Math.abs(ty - y) < 0.0005;
        if (done) {
          x = tx;
          y = ty;
        }
        pics[current]?.forEach((p, k) => {
          p.style.translate = `${(x * K[k]).toFixed(2)}px ${(y * K[k]).toFixed(2)}px`;
          p.style.rotate = `${(x * K[k] * 0.05).toFixed(3)}deg`;
        });
        raf = done ? 0 : requestAnimationFrame(frame);
      };
      stage.addEventListener('pointermove', (e) => {
        const b = stage.getBoundingClientRect();
        tx = (e.clientX - b.left) / b.width - 0.5;
        ty = (e.clientY - b.top) / b.height - 0.5;
        raf ||= requestAnimationFrame(frame);
      });
    }
  } else {
    // Táctil: el nombre cuyo centro queda más cerca del centro de la pantalla. Solo mientras la
    // lista está a la vista; fuera de ella no queda ninguno encendido.
    let raf = 0;
    const pick = () => {
      raf = 0;
      const box = stage.getBoundingClientRect();
      const mid = window.innerHeight / 2;
      if (box.bottom < mid * 0.6 || box.top > mid * 1.4) return activate(-1);
      let best = -1;
      let dist = Infinity;
      rows.forEach((r, i) => {
        const b = r.getBoundingClientRect();
        const d = Math.abs(b.top + b.height / 2 - mid);
        if (d < dist) {
          dist = d;
          best = i;
        }
      });
      activate(best);
    };
    const onScroll = () => (raf ||= requestAnimationFrame(pick));
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    pick();
  }
}

export {};
