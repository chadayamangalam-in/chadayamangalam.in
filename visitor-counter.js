/*
  Chadayamangalam.in — Stats4U visitor counter
  Counter: 8077471159

  TOTAL VISITORS comes from Stats4U's public JSON (totals.all).
  TODAY comes from the same public JSON (totals.today).
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

  const animateNumber = (el, target, duration = 1200) => {
    const current = Number((el.dataset.value || '0').replace(/,/g, '')) || 0;
    const end = Math.max(0, Math.round(Number(target) || 0));
    if (current === end) {
      el.textContent = format(end);
      el.dataset.value = String(end);
      return;
    }
    const startTime = performance.now();
    el.classList.add('counting');
    const ease = t => 1 - Math.pow(1 - t, 3);
    const step = now => {
      const progress = Math.min(1, (now - startTime) / duration);
      const value = Math.round(current + (end - current) * ease(progress));
      el.textContent = format(value);
      if (progress < 1) requestAnimationFrame(step);
      else {
        el.dataset.value = String(end);
        el.classList.remove('counting');
      }
    };
    requestAnimationFrame(step);
  };

  const updateStats = async () => {
    try {
      const response = await fetch(cfg.statsUrl, { mode: 'cors', cache: 'no-store' });
      if (!response.ok) throw new Error(`Stats4U returned ${response.status}`);
      const data = await response.json();
      const total = data?.totals?.all;
      const today = data?.totals?.today;
      if (!Number.isFinite(Number(total)) || !Number.isFinite(Number(today))) {
        throw new Error('Stats4U totals.all/totals.today was not found');
      }
      animateNumber(totalEl, total);
      animateNumber(todayEl, today);
      widget.hidden = false;
      widget.classList.remove('is-loading');
      widget.classList.add('is-live');
    } catch (error) {
      console.warn('Stats4U visitor counter:', error);
    }
  };

  widget.hidden = false;
  widget.classList.add('is-loading');
  updateStats();
  setInterval(updateStats, cfg.refreshMs);
})();
