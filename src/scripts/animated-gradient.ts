// Fondo con gradiente animado (equivalente al "animated gradient" de Salient).
//
// Comportamiento medido en el vivo:
// - Canvas de 110×110 px (90 en pantallas < 690 px) estirado al tamaño de la
//   sección; el navegador suaviza el escalado.
// - Cada píxel toma el color de la sección y una opacidad = ruido simplex 3D × 265,
//   con el tiempo como tercera dimensión (reloj / velocidad).
// - Con dos colores, se mezclan a lo largo de un eje que rota con el reloj
//   (modo "linear") o según el propio ruido (modo "organic").
// - Solo se anima mientras la sección está en pantalla (margen de 250 px).
// - El canvas aparece con un fade de 0.8 s.

import { createNoise3D } from './simplex';

type Rgb = { r: number; g: number; b: number };
type Blend = 'linear' | 'organic';

const noise3D = createNoise3D();
const FRAME_MS = 1000 / 60; // el reloj del vivo avanza una unidad por frame a 60 Hz

function hexToRgb(hex: string): Rgb | null {
  // "brand": el verde de marca definido en tokens.css (--color-brand-green).
  if (hex === 'brand') hex = getComputedStyle(document.documentElement).getPropertyValue('--color-brand-green');
  const m = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.trim());
  return m ? { r: parseInt(m[1], 16), g: parseInt(m[2], 16), b: parseInt(m[3], 16) } : null;
}

class AnimatedGradient {
  private ctx: CanvasRenderingContext2D;
  private image: ImageData;
  private res: number;
  private colors: Rgb[];
  private blend: Blend;
  private speed: number;
  private colorSpeed: number;
  private aspect = { x: 1, y: 1 };
  private inView = false;
  private start = performance.now();
  private raf = 0;

  constructor(private canvas: HTMLCanvasElement, private still: boolean) {
    const d = canvas.dataset;
    this.colors = [d.color1, d.color2].map((c) => (c ? hexToRgb(c) : null)).filter((c): c is Rgb => !!c);
    if (this.colors.length === 2 && this.colors[0].r === this.colors[1].r && this.colors[0].g === this.colors[1].g && this.colors[0].b === this.colors[1].b) {
      this.colors.length = 1;
    }
    this.blend = d.blend === 'organic' ? 'organic' : 'linear';
    this.speed = Number(d.speed) || 1000;
    this.colorSpeed = this.speed === 1300 ? 0.5 : 0.9;
    this.res = window.innerWidth < 690 ? 90 : 110;
    canvas.width = this.res;
    canvas.height = this.res;
    this.ctx = canvas.getContext('2d')!;
    this.image = this.ctx.createImageData(this.res, this.res);

    this.resize();
    new ResizeObserver(() => this.resize()).observe(canvas.parentElement!);
    requestAnimationFrame(() => canvas.classList.add('is-loaded'));

    if (still) {
      this.draw(0);
      return;
    }
    new IntersectionObserver(
      ([entry]) => {
        this.inView = entry.isIntersecting;
        if (this.inView && !this.raf) this.loop();
      },
      { rootMargin: '250px' },
    ).observe(canvas);
  }

  private resize() {
    const el = this.canvas.parentElement!;
    const ratio = el.clientHeight / Math.max(el.clientWidth, 1);
    this.aspect = ratio < 1 ? { x: 1.4, y: 1.4 * ratio } : { x: ratio / 3, y: 1 };
    if (this.still) this.draw(0);
  }

  private loop = () => {
    if (!this.inView) {
      this.raf = 0;
      return;
    }
    this.draw((performance.now() - this.start) / FRAME_MS);
    this.raf = requestAnimationFrame(this.loop);
  };

  private channel(key: keyof Rgb, x: number, y: number, n: number, clock: number) {
    if (this.colors.length === 1) return this.colors[0][key];
    const [a, b] = this.colors;
    const angle = (Math.PI / 180) * clock * this.colorSpeed;
    const c = this.res / 2;
    const rotated = Math.cos(angle) * (x - c) + Math.sin(angle) * (y - c) + c;
    const t = this.blend === 'organic' ? (rotated / this.res) * 3.5 * n / 2 : (rotated / this.res) * 2;
    return a[key] * (1 - t) + b[key] * t;
  }

  private draw(clock: number) {
    const { res, aspect } = this;
    const data = this.image.data;
    const z = clock / this.speed;
    for (let x = 0; x < res; x++) {
      for (let y = 0; y < res; y++) {
        const n = noise3D((x / res) * aspect.x, (y / res) * aspect.y, z);
        const i = 4 * (x + y * res);
        data[i] = this.channel('r', x, y, n, clock);
        data[i + 1] = this.channel('g', x, y, n, clock);
        data[i + 2] = this.channel('b', x, y, n, clock);
        data[i + 3] = 265 * n; // negativo → 0 (Uint8ClampedArray)
      }
    }
    this.ctx.putImageData(this.image, 0, 0);
  }
}

const still = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
document.querySelectorAll<HTMLCanvasElement>('canvas[data-animated-gradient]').forEach((c) => new AnimatedGradient(c, still));
