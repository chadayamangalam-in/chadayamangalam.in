/*
  Chadayamangalam.in — Stats4U visitor counter
  Counter: 8077471159
  Displays TOTAL VISITORS and TODAY only.
*/
(() => {
  const cfg = {
    statsUrl: 'https://www.stats4u.net/live/8077471159/stats.json?days=400',
    refreshMs: 300000
  };

  const widget = document.getElementById('visitorCounter');
  const totalEl = document.getElementById('visitorTotal');
  const todayEl = document.getElementById('visitorToday');
  if (!widget || !totalEl || !todayEl) return;

  const format = n => Math.max(0, Math.round(Number(n) || 0)).toLocaleString('en-US');

  const animateNumber = (el, target, duration = 1000) => {
    const current = Number((el.dataset.value || '0').replace(/,/g, '')) || 0;
    const end = Math.max(0, Math.round(Number(target) || 0));
    if (current === end) {
      el.textContent = format(end);
      el.dataset.value = String(end);
      return;
    }
    const startTime = performance.now();
    const ease = t => 1 - Math.pow(1 - t, 3);
    const step = now => {
      const progress = Math.min(1, (now - startTime) / duration);
      const value = Math.round(current + (end - current) * ease(progress));
      el.textContent = format(value);
      if (progress < 1) requestAnimationFrame(step);
      else el.dataset.value = String(end);
    };
    requestAnimationFrame(step);
  };

  const update = async () => {
    try {
      const response = await fetch(cfg.statsUrl, { mode: 'cors', cache: 'no-store' });
      if (!response.ok) throw new Error(`Stats4U returned ${response.status}`);
      const data = await response.json();

      const total = Number(data?.totals?.all);
      let today = Number(data?.totals?.today);

      // Stats4U data can expose today's figure in different daily structures.
      if (!Number.isFinite(today)) {
        const candidates = [
          data?.today?.all,
          data?.totals?.day,
          data?.days?.[0]?.all,
          data?.days?.[0]?.visitors
        ];
        today = candidates.map(Number).find(Number.isFinite);
      }

      if (!Number.isFinite(total) || !Number.isFinite(today)) {
        throw new Error('Stats4U total/today value not found');
      }

      animateNumber(totalEl, total);
      animateNumber(todayEl, today);
      widget.hidden = false;
    } catch (error) {
      console.warn('Stats4U visitor counter:', error);
    }
  };

  widget.hidden = false;
  update();
  setInterval(update, cfg.refreshMs);
})();
