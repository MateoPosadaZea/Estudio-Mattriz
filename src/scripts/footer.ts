// v2: interacciones del footer (src/components/SiteFooter.astro).

const footer = document.querySelector<HTMLElement>('[data-footer]');

// Año al día aunque no haya deploy en enero.
document.querySelectorAll('[data-year]').forEach((el) => (el.textContent = String(new Date().getFullYear())));

if (footer) {
  // Hora local de Bogotá, en vivo.
  const clock = footer.querySelector<HTMLElement>('[data-clock]');
  if (clock) {
    const fmt = new Intl.DateTimeFormat(document.documentElement.lang || 'en', { timeZone: 'America/Bogota', hour: 'numeric', minute: '2-digit' });
    const tick = () => (clock.textContent = `${fmt.format(new Date())} · GMT−5`);
    tick();
    setInterval(tick, 15000);
  }

  // Copiar el correo.
  footer.querySelectorAll<HTMLButtonElement>('[data-copy]').forEach((btn) => {
    const label = btn.querySelector<HTMLElement>('[data-copy-label]');
    const original = label?.textContent ?? '';
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(btn.dataset.copy!);
      } catch {
        window.location.href = `mailto:${btn.dataset.copy}`;
        return;
      }
      btn.classList.add('is-copied');
      if (label) label.textContent = `${btn.dataset.copied} ✓`;
      setTimeout(() => {
        btn.classList.remove('is-copied');
        if (label) label.textContent = original;
      }, 1800);
    });
  });
}

export {};
