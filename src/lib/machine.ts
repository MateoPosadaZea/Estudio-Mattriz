// Modo Machine: cada página tiene su versión en Markdown junto a ella (la genera scripts/machine-md.mjs
// al terminar el build). Mismo cálculo de ruta en la página, en el Worker y en el script.
//   /            → /index.md
//   /es/         → /es/index.md
//   /about/      → /about.md
//   /project/x/  → /project/x.md
export function machinePath(pathname: string): string {
  const p = pathname.endsWith('/') ? pathname : pathname + '/';
  return p === '/' || p === '/es/' ? `${p}index.md` : `${p.slice(0, -1)}.md`;
}
