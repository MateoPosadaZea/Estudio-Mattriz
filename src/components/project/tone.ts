// Color de texto según el fondo real. En el vivo varias secciones tienen texto oscuro sobre
// fondo oscuro (o blanco sobre blanco); aquí el texto siempre contrasta con su fondo.
export function isDark(color: string | null | undefined): boolean {
  if (!color) return true;
  const hex = color.trim().replace('#', '');
  if (!/^[0-9a-f]{3}([0-9a-f]{3})?$/i.test(hex)) return true;
  const full = hex.length === 3 ? [...hex].map((c) => c + c).join('') : hex;
  const [r, g, b] = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const lin = (c: number) => (c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4);
  const L = 0.2126 * lin(r) + 0.7152 * lin(g) + 0.0722 * lin(b);
  return L < 0.3;
}

// Tamaños y alto de línea de los textos responsivos de Salient (clases font_size_* y font_line_height_*).
export function fontVars(classes: string[] = []): string {
  const vars: string[] = [];
  for (const c of classes) {
    let m;
    // Salient aplica 1.5em a font_size_desktop_1em (así se ve en el vivo).
    if ((m = c.match(/^font_size_desktop_(.+)$/))) vars.push(`--fs-d:${m[1] === '1em' ? '1.5em' : unit(m[1])}`);
    else if ((m = c.match(/^font_size_tablet_(.+)$/))) vars.push(`--fs-t:${unit(m[1])}`);
    else if ((m = c.match(/^font_size_phone_(.+)$/))) vars.push(`--fs-p:${unit(m[1])}`);
    else if ((m = c.match(/^font_size_max_(.+)$/))) vars.push(`--fs-max:${unit(m[1])}`);
    else if ((m = c.match(/^font_line_height_(\d+)-(\d+)$/))) vars.push(`--lh:${m[1]}.${m[2]}`);
  }
  return vars.join(';');
}

const unit = (v: string) => v.replace(/^(\d+)-(\d+)/, '$1.$2');

export const pct = (classes: string[], prefix: string) => {
  const c = classes.find((k) => k.startsWith(prefix));
  return c ? c.slice(prefix.length) : undefined;
};

export type Media = { base: string; dir: string; widths?: number[]; width: number; height: number };

export function srcset(m: Media) {
  return (m.widths ?? []).map((w) => `${m.dir}/${m.base}-${w}.webp ${w}w`).join(', ');
}

export function largest(m: Media) {
  return `${m.dir}/${m.base}-${(m.widths ?? [m.width])[0]}.webp`;
}
