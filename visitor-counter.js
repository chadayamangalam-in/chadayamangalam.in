/*
  Chadayamangalam.in — Stats4U visitor counter
  Counter: 8077471159

  Stats4U supplies the counting and the public statistics JSON.
  No account, API key, VPS or database is required on this site.
*/
(() => {
  const cfg = {
    counterId: '8077471159',
    statsUrl: 'https://www.stats4u.net/live/8077471159/stats.json?days=400',
    refreshMs: 120000
  };

  const widget = document.getElementById('visitorCounter');
  const totalEl = document.getElementById('visitorTotal');
  const liveEl = document.getElementById('visitorLive');
  if (!widget || !totalEl || !liveEl) return;

  const numberFromKeys = (obj, keys) => {
    if (!obj || typeof obj !== 'object') return null;
    for (const key of keys) {
      const value = obj[key];
      if (typeof value === 'number' && Number.isFinite(value)) return value;
      if (typeof value === 'string' && value.trim() !== '' && Number.isFinite(Number(value))) return Number(value);
    }
    return null;
  };

  const findNumber = (obj, keys, depth = 0) => {
    if (!obj || typeof obj !== 'object' || depth > 4) return null;
    const direct = numberFromKeys(obj, keys);
    if (direct !== null) return direct;
    for (const value of Object.values(obj)) {
      if (value && typeof value === 'object') {
        const found = findNumber(value, keys, depth + 1);
        if (found !== null) return found;
      }
    }
    return null;
  };

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
      const p = Math.min(1, (now - startTime) / duration);
      const value = Math.round(current + (end - current) * ease(p));
      el.textContent = format(value);
      if (p < 1) requestAnimationFrame(step);
      else {
        el.dataset.value = String(end);
        el.classList.remove('counting');
      }
    };
    requestAnimationFrame(step);
  };

  const update = async () => {
    try {
      const response = await fetch(cfg.statsUrl, {
        mode: 'cors'
      });
      if (!response.ok) throw new Error(`Stats4U returned ${response.status}`);
      const data = await response.json();

      // Stats4U's public JSON contains the counter totals and current online value.
      // The fallback key list keeps this widget tolerant of small API field changes.
      const total = findNumber(data, ['totalVisitors', 'visitorsTotal', 'total_visitors', 'total']);
      const visitors = findNumber(data, ['visitors']);
      const online = findNumber(data, ['online', 'onlineNow', 'online_now', 'live', 'now']);
      const totalValue = total !== null ? total : visitors;

      if (totalValue === null) throw new Error('Total visitor value not found in Stats4U response');

      widget.hidden = false;
      widget.classList.remove('is-loading');
      widget.classList.add('is-live');
      animateNumber(totalEl, totalValue, 1400);
      if (online !== null) animateNumber(liveEl, online, 500);
      else liveEl.textContent = '—';
    } catch (error) {
      // Keep the widget unobtrusive if Stats4U is temporarily unavailable.
      console.warn('Stats4U visitor counter:', error);
    }
  };

  widget.hidden = false;
  widget.classList.add('is-loading');
  update();
  setInterval(update, cfg.refreshMs);
})();
