// v2: índice de proyectos del home (src/components/home2/Work.astro).
// Con mouse (≥1000px): al pasar por un nombre se enciende ese proyecto, el resto se apaga y sus tres
// piezas aparecen alrededor de la fila (loops cortos del proyecto, que se cargan y reproducen solo
// mientras ese proyecto está activo), con un leve movimiento que sigue al mouse.
// En táctil: se enciende el nombre más cercano al centro de la pantalla (se calcula en cada cuadro
// del scroll, así no se salta ninguno), su portada deja de estar atenuada y su loop se reproduce.
// Las imágenes se piden cuando la sección se acerca a la pantalla, no al cargar la página.
// El modo (mouse o táctil) sigue al tamaño de la ventana: si cambia (ventana que se agranda o
// achica), se cambia de modo sin recargar.

const root = document.querySelector<HTMLElement>('[data-work]');
const stage = root?.querySelector<HTMLElement>('[data-work-stage]');

if (root && stage) {
  const rows = [...root.querySelectorAll<HTMLElement>('[data-work-row]')];
  const sets = [...root.querySelectorAll<HTMLElement>('[data-work-set]')];
  const mq = window.matchMedia('(hover: hover) and (min-width: 1000px)');
  let desktop = mq.matches;
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Imágenes (y pósters de los loops) del modo actual, cuando la sección se acerca.
  let near = false;
  const load = () => {
    if (!near) return;
    root.querySelectorAll<HTMLImageElement>('img[data-src]').forEach((img) => {
      if (desktop === !img.closest('.h-work__thumb') && !img.getAttribute('src')) img.src = img.dataset.src!;
    });
    root.querySelectorAll<HTMLVideoElement>('video[data-poster]').forEach((v) => {
      if (desktop === !v.closest('.h-work__thumb') && !v.getAttribute('poster')) v.poster = v.dataset.poster!;
    });
  };
  new IntersectionObserver(
    (entries, io) => {
      if (!entries.some((e) => e.isIntersecting)) return;
      io.disconnect();
      near = true;
      load();
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

  // Intensidad del seguimiento del mouse de cada pieza (a, b, c), en px.
  const K = [70, 110, 45];

  // Que las tres piezas queden completas dentro de la pantalla (debajo del header): si la fila está
  // muy arriba o muy abajo, el juego se corre en vertical lo necesario.
  const fit = (set: HTMLElement, y: number) => {
    const rs = [...set.querySelectorAll<HTMLElement>('.h-work__pic')].map((p) => p.getBoundingClientRect());
    const top = Math.min(...rs.map((r) => r.top));
    const bottom = Math.max(...rs.map((r) => r.bottom));
    const minTop = 96;
    const maxBottom = window.innerHeight - 24;
    let dy = 0;
    if (bottom > maxBottom) dy = maxBottom - bottom;
    if (top + dy < minTop) dy = minTop - top;
    if (dy) set.style.setProperty('--y', `${y + dy}px`);
  };

  // Táctil: se recalcula una vez por cuadro al hacer scroll (pick, más abajo).
  let traf = 0;
  const onScroll = () => (traf ||= requestAnimationFrame(() => pick()));

  let current = -1;
  const activate = (i: number) => {
    if (i === current) return;
    play(sets[current], false);
    play(rows[current]?.querySelector('.h-work__thumb'), false);
    current = i;
    root.classList.toggle('has-active', i >= 0);
    rows.forEach((r, k) => r.classList.toggle('is-active', k === i));
    if (!desktop) return play(rows[i]?.querySelector('.h-work__thumb'), true);
    sets.forEach((s, k) => s.classList.toggle('is-active', k === i));
    const s = sets[i];
    if (!s) return;
    // Las piezas se ubican a la altura de la fila activa, completas dentro de la pantalla.
    const r = rows[i].getBoundingClientRect();
    const st = stage.getBoundingClientRect();
    const y = r.top - st.top + r.height / 2;
    s.style.setProperty('--y', `${y}px`);
    fit(s, y);
    play(s, true);
  };

  {
    // Con mouse. El proyecto activo es el de la fila bajo el mouse, calculado desde la posición del puntero al
    // moverlo y al hacer scroll (no con pointerenter/leave, que se pierden si la página se mueve
    // debajo del cursor o al volver a la página).
    let px = -1;
    let py = -1;
    let hraf = 0;
    const hit = () => {
      hraf = 0;
      if (!desktop || px < 0) return;
      const row = document.elementFromPoint(px, py)?.closest<HTMLElement>('[data-work-row]');
      activate(row ? rows.indexOf(row) : -1);
    };
    const schedule = () => (hraf ||= requestAnimationFrame(hit));
    document.addEventListener(
      'pointermove',
      (e) => {
        if (e.pointerType !== 'mouse') return;
        px = e.clientX;
        py = e.clientY;
        schedule();
      },
      { passive: true },
    );
    window.addEventListener('scroll', schedule, { passive: true });
    document.addEventListener('mouseout', (e) => {
      if (!desktop || e.relatedTarget) return;
      px = -1;
      activate(-1);
    });
    // Al volver con el botón atrás la página puede venir de la caché con un proyecto encendido.
    window.addEventListener('pageshow', (e) => {
      if (!e.persisted) return;
      activate(-1);
      if (desktop) schedule();
      else onScroll();
    });
    rows.forEach((r, i) => {
      r.addEventListener('focus', () => desktop && activate(i));
      r.addEventListener('blur', () => desktop && activate(-1));
    });

    // Movimiento: cada pieza se corre y gira un poco hacia el mouse, con distinta intensidad. Se
    // interpola cuadro a cuadro (sin transición CSS), así sigue al mouse de forma continua.
    if (!reduce) {
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
        if (!desktop) return;
        const b = stage.getBoundingClientRect();
        tx = (e.clientX - b.left) / b.width - 0.5;
        ty = (e.clientY - b.top) / b.height - 0.5;
        raf ||= requestAnimationFrame(frame);
      });
    }
  }

  // Táctil: el nombre cuyo centro queda más cerca del centro de la pantalla. Solo mientras la
  // lista está a la vista; fuera de ella no queda ninguno encendido.
  const pick = () => {
    traf = 0;
    if (desktop) return;
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
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onScroll, { passive: true });
  pick();

  // Cambio de modo (la ventana cruza los 1000 px, o se conecta/desconecta un mouse).
  mq.addEventListener('change', () => {
    activate(-1);
    desktop = mq.matches;
    load();
    if (!desktop) onScroll();
  });
}

export {};
