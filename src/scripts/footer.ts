// v2: interacciones del footer (src/components/SiteFooter.astro).

const footer = document.querySelector<HTMLElement>('[data-footer]');
const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  const word = footer.querySelector<HTMLElement>('[data-footer-word]');
  const input = footer.querySelector<HTMLInputElement>('[data-footer-input]');
  let letters = word ? [...word.querySelectorAll<HTMLElement>('span')] : [];

  // La palabra llena el ancho: se mide a 100px y se escala. Con más letras, más chica.
  const fit = () => {
    if (!word) return;
    const available = word.parentElement!.clientWidth;
    word.style.setProperty('--fit', '100px');
    const caret = word.querySelector<HTMLElement>('.ft__caret');
    const caretShown = caret && getComputedStyle(caret).display !== 'none';
    const first = letters[0]?.getBoundingClientRect();
    const last = letters.at(-1)?.getBoundingClientRect();
    const natural = (first && last ? last.right - first.left : 0) + (caretShown ? 10 : 0);
    // 0.99: margen mínimo para la tinta que sobresale del último glifo.
    const size = Math.min((available / Math.max(natural, 1)) * 100 * 0.99, window.innerWidth * 0.4);
    word.style.setProperty('--fit', `${size.toFixed(2)}px`);
  };

  // Escribir otra palabra: se redibujan las letras (vacía, vuelve a "Mattriz" al salir).
  if (word && input) {
    const render = (text: string) => {
      const caret = word.querySelector('.ft__caret');
      letters.forEach((l) => l.remove());
      letters = [...text].map((ch, i) => {
        const span = document.createElement('span');
        span.textContent = ch;
        span.style.setProperty('--i', String(i));
        word.insertBefore(span, caret);
        return span;
      });
      fit();
    };
    input.addEventListener('input', () => render(input.value));
    input.addEventListener('focus', () => requestAnimationFrame(fit));
    input.addEventListener('blur', () => {
      if (!input.value.trim()) input.value = 'Mattriz';
      render(input.value);
    });
    // El cursor siempre al final (es lo que se dibuja).
    const toEnd = () => input.setSelectionRange(input.value.length, input.value.length);
    input.addEventListener('click', toEnd);
    input.addEventListener('keyup', toEnd);
    document.fonts?.ready.then(fit);
    window.addEventListener('resize', fit);
    fit();
  }

  // Entrada de "Mattriz" al aparecer el footer.
  if (word) {
    if (reduce || !('IntersectionObserver' in window)) word.classList.add('is-in', 'is-settled');
    else {
      const io = new IntersectionObserver(
        ([e]) => {
          if (!e.isIntersecting) return;
          word.classList.add('is-in');
          setTimeout(() => word.classList.add('is-settled'), 1400);
          io.disconnect();
        },
        { threshold: 0.3 },
      );
      io.observe(word);
    }
  }

  if (!reduce) {
    const glow = footer.querySelector<HTMLElement>('[data-footer-glow]');
    const magnet = footer.querySelector<HTMLElement>('[data-magnetic]');
    const fine = window.matchMedia('(hover: hover) and (pointer: fine)');
    let gx = 0;
    let gy = 0;
    let tx = 0;
    let ty = 0;
    let raf = 0;

    // El brillo va detrás del cursor con inercia.
    const loop = () => {
      gx += (tx - gx) * 0.08;
      gy += (ty - gy) * 0.08;
      glow?.style.setProperty('--gx', `${gx.toFixed(1)}px`);
      glow?.style.setProperty('--gy', `${gy.toFixed(1)}px`);
      raf = Math.abs(tx - gx) + Math.abs(ty - gy) > 0.5 ? requestAnimationFrame(loop) : 0;
    };

    footer.addEventListener('pointerenter', (e) => {
      if (e.pointerType !== 'mouse' || !fine.matches) return;
      const r = footer.getBoundingClientRect();
      if (!footer.classList.contains('has-pointer')) {
        gx = tx = e.clientX - r.left;
        gy = ty = e.clientY - r.top;
      }
      footer.classList.add('has-pointer');
    });

    footer.addEventListener('pointermove', (e) => {
      if (e.pointerType !== 'mouse' || !fine.matches) return;
      const r = footer.getBoundingClientRect();
      tx = e.clientX - r.left;
      ty = e.clientY - r.top;
      if (!raf) raf = requestAnimationFrame(loop);

      // Imán: el CTA se acerca al cursor cuando está cerca.
      if (magnet) {
        const m = magnet.getBoundingClientRect();
        const dx = e.clientX - (m.left + m.width / 2);
        const dy = e.clientY - (m.top + m.height / 2);
        const near = Math.abs(dx) < m.width / 2 + 80 && Math.abs(dy) < m.height / 2 + 80;
        magnet.style.setProperty('--mx', near ? `${(dx * 0.12).toFixed(1)}px` : '0px');
        magnet.style.setProperty('--my', near ? `${(dy * 0.25).toFixed(1)}px` : '0px');
      }

      // Ola en "Mattriz": cada letra sube según lo cerca que esté del cursor en horizontal.
      if (word?.classList.contains('is-settled')) {
        const w = word.getBoundingClientRect();
        const inBand = e.clientY > w.top - w.height * 0.8 && e.clientY < w.bottom + 40;
        letters.forEach((l) => {
          const b = l.getBoundingClientRect();
          const d = Math.abs(e.clientX - (b.left + b.width / 2)) / (w.width / 4);
          l.style.setProperty('--lift', inBand ? Math.max(0, 1 - d).toFixed(3) : '0');
        });
      }
    });

    footer.addEventListener('pointerleave', () => {
      magnet?.style.setProperty('--mx', '0px');
      magnet?.style.setProperty('--my', '0px');
      letters.forEach((l) => l.style.setProperty('--lift', '0'));
    });
  }
}

export {};
