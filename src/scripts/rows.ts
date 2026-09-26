// v2: filas que se despliegan al hacer scroll (servicios del home), como en la v1:
// la línea se dibuja de izquierda a derecha, el número sube desde su máscara y el texto aparece.
// Cada fila arranca al entrar en pantalla; si entran varias a la vez, van una tras otra.
// Con prefers-reduced-motion todo queda visible desde el principio.

const rows = [...document.querySelectorAll<HTMLElement>('[data-row]')];
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const STEP = 160;

if (reduceMotion || !('IntersectionObserver' in window)) {
  rows.forEach((row) => row.classList.add('is-in'));
} else {
  const io = new IntersectionObserver(
    (entries) => {
      const entering = entries.filter((e) => e.isIntersecting).sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
      entering.forEach((e, k) => {
        io.unobserve(e.target);
        window.setTimeout(() => e.target.classList.add('is-in'), k * STEP);
      });
    },
    { rootMargin: '0px 0px -10% 0px' },
  );
  rows.forEach((row) => io.observe(row));
}

export {};
