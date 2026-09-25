// Formulario de contacto: envío por fetch a /api/contact (Worker con Resend + Turnstile).
// Sin JS el formulario se envía igual y el Worker redirige a /contact/?sent=ok|error.
// Turnstile se carga solo cuando la persona empieza a llenar el formulario (no pesa en la carga inicial).

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void };
  }
}

const form = document.querySelector<HTMLFormElement>('[data-contact-form]');

if (form) {
  const status = form.querySelector<HTMLElement>('[data-form-status]')!;
  const button = form.querySelector<HTMLButtonElement>('button[type="submit"]')!;
  const widget = form.querySelector<HTMLElement>('[data-turnstile]');
  let widgetId: string | undefined;

  const show = (ok: boolean) => {
    status.hidden = false;
    status.textContent = ok ? form.dataset.success! : form.dataset.error!;
    status.classList.toggle('is-error', !ok);
  };

  const sent = new URLSearchParams(location.search).get('sent');
  if (sent) show(sent === 'ok');

  let loading: Promise<void> | undefined;
  const loadTurnstile = () => {
    if (!widget) return Promise.resolve();
    loading ??= new Promise<void>((resolve) => {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.onload = () => {
        widgetId = window.turnstile?.render(widget, { sitekey: widget.dataset.sitekey, appearance: 'interaction-only', theme: 'light' });
        resolve();
      };
      s.onerror = () => resolve();
      document.head.append(s);
    });
    return loading;
  };
  form.addEventListener('focusin', loadTurnstile, { once: true });

  // El video de la tarjeta se carga cuando entra en pantalla.
  const video = document.querySelector<HTMLVideoElement>('.case-card__video[data-src]');
  if (video && 'IntersectionObserver' in window) {
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      video.src = video.dataset.src!;
      if (!matchMedia('(prefers-reduced-motion: reduce)').matches) video.play().catch(() => {});
      io.disconnect();
    });
    io.observe(video);
  }

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!form.reportValidity()) return;
    await loadTurnstile();
    button.disabled = true;
    status.hidden = true;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      const ok = res.ok && data.ok === true;
      show(ok);
      if (ok) form.reset();
    } catch {
      show(false);
    } finally {
      button.disabled = false;
      if (widgetId !== undefined) window.turnstile?.reset(widgetId);
    }
  });
}

export {};
