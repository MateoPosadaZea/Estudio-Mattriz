// Modo Machine (src/components/MachineMode.astro): el interruptor Humano / Máquina del footer cubre la
// página con su versión en Markdown. El texto se pide la primera vez; los enlaces quedan navegables y
// el modo se mantiene al cambiar de página durante la visita. Esc vuelve a la versión humana.
const panel = document.querySelector<HTMLElement>('[data-machine]');
const KEY = 'mz-machine';

if (panel) {
  // El panel nace en el footer, pero va directo en <body> para quedar encima de todo lo fijo.
  document.body.append(panel);
  const text = panel.querySelector<HTMLElement>('[data-machine-text]')!;
  const scroller = panel.querySelector<HTMLElement>('.mm__scroll')!;
  const copy = panel.querySelector<HTMLButtonElement>('[data-machine-copy]')!;
  const switches = [...document.querySelectorAll<HTMLButtonElement>('[data-machine-set]')];
  let raw: string | null = null;

  const esc = (s: string) => s.replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]!);
  // Markdown tal cual, con dos ayudas de lectura: títulos en negrita y direcciones como enlaces.
  const render = (md: string) =>
    esc(md)
      .replace(/^(---\n[\s\S]*?\n---)$/m, '<span class="mm-meta">$1</span>')
      .replace(/^(#{1,6} .*)$/gm, '<b>$1</b>')
      .replace(/(https:\/\/[^\s)\]]+)/g, '<a href="$1">$1</a>');

  const load = async () => {
    if (raw !== null) return;
    try {
      const res = await fetch(panel.dataset.src!);
      raw = res.ok ? await res.text() : '';
    } catch {
      raw = '';
    }
    text.innerHTML = raw ? render(raw) : esc(panel.dataset.src!);
  };

  const set = async (on: boolean, remember = true) => {
    switches.forEach((b) => b.setAttribute('aria-pressed', String((b.dataset.machineSet === 'machine') === on)));
    if (remember) {
      try {
        on ? sessionStorage.setItem(KEY, '1') : sessionStorage.removeItem(KEY);
      } catch {}
    }
    if (on) await load();
    panel.hidden = !on;
    document.documentElement.classList.toggle('is-machine', on);
    if (on) scroller.focus({ preventScroll: true });
  };

  switches.forEach((b) => b.addEventListener('click', () => set(b.dataset.machineSet === 'machine')));
  document.addEventListener('keydown', (e) => e.key === 'Escape' && !panel.hidden && set(false));

  copy.addEventListener('click', async () => {
    await load();
    try {
      await navigator.clipboard.writeText(raw ?? '');
    } catch {
      return;
    }
    const label = copy.textContent;
    copy.textContent = copy.dataset.copied!;
    setTimeout(() => (copy.textContent = label), 1600);
  });

  let start = false;
  try {
    start = sessionStorage.getItem(KEY) === '1';
  } catch {}
  if (start) set(true, false);
}

export {};
