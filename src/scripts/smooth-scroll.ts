// Scroll suave con Lenis, solo con mouse o trackpad (pointer: fine) y sin prefers-reduced-motion.
// En pantallas táctiles queda el scroll nativo, que ya es suave y no conviene interceptar.
// Lenis mueve el scroll real de la ventana, así que los listeners de 'scroll' existentes siguen igual.
// scrollToY / scrollToEl: los botones que desplazan la página (volver arriba, "Sigue bajando",
// anclas del menú, escáner) pasan por aquí para usar el mismo movimiento.
import Lenis from 'lenis';

const fine = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// Espacio del header fijo para que las anclas no queden tapadas.
const headerOffset = () => {
  const cs = getComputedStyle(document.documentElement);
  return (parseFloat(cs.getPropertyValue('--header-top')) || 0) + (parseFloat(cs.getPropertyValue('--header-height')) || 0) + 16;
};

export const lenis: Lenis | null =
  fine && !reduce
    ? new Lenis({
        lerp: 0.085,
        wheelMultiplier: 1,
        smoothWheel: true,
        autoRaf: true,
        // Las anclas ya respetan scroll-margin-top (Base.astro), así que no se suma otro desplazamiento.
        anchors: true,
        prevent: (node) => !!node.closest?.('[data-lenis-prevent]'),
      })
    : null;

export function scrollToY(y: number) {
  if (lenis) lenis.scrollTo(y);
  else window.scrollTo({ top: y, behavior: reduce ? 'auto' : 'smooth' });
}

export function scrollToEl(el: Element, block: 'start' | 'center' = 'start') {
  if (lenis) {
    const r = el.getBoundingClientRect();
    const y = block === 'center' ? window.scrollY + r.top - (window.innerHeight - r.height) / 2 : window.scrollY + r.top - headerOffset();
    lenis.scrollTo(Math.max(0, y));
  } else el.scrollIntoView({ behavior: reduce ? 'auto' : 'smooth', block });
}

export function stopScroll() {
  lenis?.stop();
}
export function startScroll() {
  lenis?.start();
}
