// v2: formulario en frase del footer (src/components/FooterForm.astro).
// - Cada espacio crece con lo que se escribe (o con la opción elegida), para que la frase fluya.
// - Envío por fetch a /api/contact (mismo Worker del formulario de contacto); sin JS, envío normal.
// - Turnstile se carga al enfocar el formulario, solo si hay clave pública.

declare global {
  interface Window {
    turnstile?: { render: (el: HTMLElement, opts: Record<string, unknown>) => string; reset: (id?: string) => void };
  }
}

const form = document.querySelector<HTMLFormElement>('[data-footer-form]');

if (form) {
  const status = form.querySelector<HTMLElement>('[data-status]')!;
  const button = form.querySelector<HTMLButtonElement>('[data-send]')!;
  const label = form.querySelector<HTMLElement>('[data-send-label]')!;
  const widget = form.querySelector<HTMLElement>('[data-turnstile]');
  const fields = [...form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[data-grow]')];
  let widgetId: string | undefined;

  // Mide el texto con la misma fuente del campo para darle el ancho justo.
  const measure = document.createElement('span');
  measure.setAttribute('aria-hidden', 'true');
  measure.style.cssText = 'position:absolute;visibility:hidden;white-space:pre;left:-9999px;top:0';
  form.append(measure);

  const grow = (el: HTMLInputElement | HTMLSelectElement) => {
    const cs = getComputedStyle(el);
    measure.style.font = cs.font;
    measure.style.letterSpacing = cs.letterSpacing;
    const text = el instanceof HTMLSelectElement ? el.options[el.selectedIndex]?.text ?? '' : el.value || el.placeholder;
    measure.textContent = text;
    const extra = parseFloat(cs.paddingLeft) + parseFloat(cs.paddingRight) + 2;
    el.style.width = `${Math.ceil(measure.getBoundingClientRect().width + extra)}px`;
  };

  const growAll = () => fields.forEach(grow);
  fields.forEach((el) => el.addEventListener(el instanceof HTMLSelectElement ? 'change' : 'input', () => grow(el)));
  document.fonts?.ready.then(growAll);
  window.addEventListener('resize', growAll);
  growAll();

  let loading: Promise<void> | undefined;
  const loadTurnstile = () => {
    if (!widget) return Promise.resolve();
    loading ??= new Promise<void>((resolve) => {
      const s = document.createElement('script');
      s.src = 'https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit';
      s.async = true;
      s.onload = () => {
        widgetId = window.turnstile?.render(widget, { sitekey: widget.dataset.sitekey, appearance: 'interaction-only', theme: 'dark' });
        resolve();
      };
      s.onerror = () => resolve();
      document.head.append(s);
    });
    return loading;
  };
  form.addEventListener('focusin', loadTurnstile, { once: true });

  const show = (ok: boolean) => {
    status.hidden = false;
    status.textContent = ok ? form.dataset.success! : form.dataset.error!;
    status.classList.toggle('is-error', !ok);
    form.classList.toggle('is-sent', ok);
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    form.classList.add('was-tried');
    if (!form.reportValidity()) return;
    await loadTurnstile();
    const original = label.textContent;
    button.disabled = true;
    label.textContent = label.dataset.text = form.dataset.sending!;
    status.hidden = true;
    try {
      const res = await fetch(form.action, { method: 'POST', body: new FormData(form), headers: { Accept: 'application/json' } });
      const data = (await res.json().catch(() => ({}))) as { ok?: boolean };
      show(res.ok && data.ok === true);
    } catch {
      show(false);
    } finally {
      button.disabled = false;
      label.textContent = label.dataset.text = original!;
      if (widgetId !== undefined) window.turnstile?.reset(widgetId);
    }
  });
}

export {};
