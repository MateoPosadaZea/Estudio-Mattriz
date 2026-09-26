// v2: tema claro/oscuro. El tema se aplica antes de pintar en Base.astro (localStorage "mz-theme");
// aquí solo se cambia y se guarda. Todos los botones [data-theme-toggle] quedan sincronizados.

const KEY = 'mz-theme';
const root = document.documentElement;
const buttons = [...document.querySelectorAll<HTMLButtonElement>('[data-theme-toggle]')];

const sync = () => {
  const light = root.dataset.theme === 'light';
  buttons.forEach((b) => b.setAttribute('aria-pressed', String(light)));
};

buttons.forEach((b) =>
  b.addEventListener('click', () => {
    const light = root.dataset.theme !== 'light';
    if (light) root.dataset.theme = 'light';
    else delete root.dataset.theme;
    try {
      localStorage.setItem(KEY, light ? 'light' : 'dark');
    } catch {}
    sync();
  }),
);

sync();

export {};
