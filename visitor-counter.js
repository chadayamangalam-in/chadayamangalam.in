/*
  Chadayamangalam.in — Stats4U visitor counter
  Counter: 8077471159

  TOTAL VISITORS comes from Stats4U's public JSON (totals.all).
  LIVE NOW is supplied by a tiny Stats4U "Right now" image (design 3900),
  refreshed every 30 seconds. The image is display-only (rl=1), so it does
  not create a second visit count.
*/
(() => {
  const cfg = {
    statsUrl: 'https://www.stats4u.net/live/8077471159/stats.json?days=400',
    liveImageUrl: 'https://www.stats4u.net/c/8077471159-3800.svg?rl=1',
    refreshTotalMs: 300000,
    refreshLiveMs: 30000
  };

  const widget = document.getElementById('visitorCounter');
  const totalEl = document.getElementById('visitorTotal');
  const liveEl = document.getElementById('visitorLiveValue');
  const liveSource = document.getElementById('visitorLiveSource');
  if (!widget || !totalEl || !liveEl || !liveSource) return;

  const format = n => Math.max(0, Math.round(Number(n) || 0)).toLocaleString('en-US');

  const animateNumber = (el, target, duration = 1400) => {
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

  const updateTotal = async () => {
    try {
      const response = await fetch(cfg.statsUrl, { mode: 'cors', cache: 'no-store' });
      if (!response.ok) throw new Error(`Stats4U returned ${response.status}`);
      const data = await response.json();
      const total = data?.totals?.all;
      if (!Number.isFinite(Number(total))) throw new Error('Stats4U totals.all was not found');
      animateNumber(totalEl, total);
      widget.hidden = false;
      widget.classList.remove('is-loading');
      widget.classList.add('is-live');
    } catch (error) {
      console.warn('Stats4U total counter:', error);
    }
  };

  const updateLive = () => {
    // The live design is an image, so there is no CORS/API-key problem.
    // Cache-busting forces Stats4U to return the current "right now" figure.
    liveSource.onload = () => {
      liveEl.hidden = true;
      liveSource.hidden = false;
    };
    liveSource.onerror = () => {
      liveSource.hidden = true;
      liveEl.hidden = false;
      liveEl.textContent = '—';
    };
    liveSource.src = `${cfg.liveImageUrl}&t=${Date.now()}`;
  };

  widget.hidden = false;
  widget.classList.add('is-loading');
  liveSource.hidden = true;
  liveEl.hidden = false;
  updateTotal();
  updateLive();
  setInterval(updateTotal, cfg.refreshTotalMs);
  setInterval(updateLive, cfg.refreshLiveMs);
})();
