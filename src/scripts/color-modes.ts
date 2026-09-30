// Modos de color (ColorModes.astro). El modo se aplica antes de pintar en Base.astro (localStorage
// "mz-mode"); aquí se cambia, se guarda y se sincronizan todos los selectores de la página.

type Mode = 'white' | 'red' | 'dark';
const KEY = 'mz-mode';
const root = document.documentElement;
const groups = [...document.querySelectorAll<HTMLElement>('[data-modes]')];

const current = (): Mode => (root.dataset.theme !== 'light' ? 'dark' : root.dataset.palette === 'blanco-rojo' ? 'red' : 'white');

const apply = (mode: Mode) => {
  // Mientras cambia el modo, sin transiciones: todo (header incluido) cambia de color a la vez.
  root.classList.add('mode-switching');
  requestAnimationFrame(() => requestAnimationFrame(() => root.classList.remove('mode-switching')));
  if (mode === 'dark') delete root.dataset.theme;
  else root.dataset.theme = 'light';
  if (mode === 'red') root.dataset.palette = 'blanco-rojo';
  else delete root.dataset.palette;
  try {
    localStorage.setItem(KEY, mode);
    localStorage.removeItem('mz-palette');
  } catch {}
  sync();
};

const sync = () => {
  const mode = current();
  document.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((b) => b.setAttribute('aria-pressed', String(b.dataset.mode === mode)));
};

groups.forEach((g) => {
  const toggle = g.querySelector<HTMLButtonElement>('[data-modes-toggle]');
  const setOpen = (open: boolean) => {
    g.classList.toggle('is-open', open);
    toggle?.setAttribute('aria-expanded', String(open));
  };
  toggle?.addEventListener('click', () => setOpen(!g.classList.contains('is-open')));
  g.querySelectorAll<HTMLButtonElement>('[data-mode]').forEach((b) =>
    b.addEventListener('click', () => {
      apply(b.dataset.mode as Mode);
      if (toggle) setOpen(false);
    }),
  );
  if (toggle) {
    document.addEventListener('click', (e) => {
      if (!g.contains(e.target as Node)) setOpen(false);
    });
    g.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') {
        setOpen(false);
        toggle.focus();
      }
    });
  }
});

sync();

export {};
