// Form Follows Brand — landing interactions

(function () {
  // --- sticky topbar shadow ---
  const topbar = document.getElementById('topbar');
  const onScroll = () => {
    topbar.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // --- scroll reveal ---
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.classList.add('is-in');
          io.unobserve(e.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -8% 0px' }
  );
  document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

  // re-run reveal for hero that becomes visible after a tweak toggle
  window.__revealVisibleHero = function () {
    const active = document.querySelector(
      'body[data-hero="a"] #hero-a, body[data-hero="b"] #hero-b'
    );
    if (!active) return;
    active.querySelectorAll('.reveal').forEach((el) => el.classList.add('is-in'));
  };

  // --- email capture ---
  document.querySelectorAll('.capture-form').forEach((form) => {
    form.addEventListener('submit', async (ev) => {
      ev.preventDefault();
      const input = form.querySelector('input[type=email]');
      const btn = form.querySelector('button[type=submit]');
      const val = (input.value || '').trim();

      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) {
        input.style.borderColor = 'var(--brick)';
        input.focus();
        return;
      }
      input.style.borderColor = '';

      const origLabel = btn.textContent;
      btn.disabled = true;
      btn.textContent = 'Submitting…';

      try {
        const res = await fetch('/api/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: val }),
        });
        if (res.ok) {
          form.closest('.capture').classList.add('is-sent');
        } else {
          const data = await res.json().catch(() => ({}));
          input.style.borderColor = 'var(--brick)';
          input.title = data.error || 'Something went wrong. Please try again.';
        }
      } catch (_) {
        input.style.borderColor = 'var(--brick)';
        input.title = 'Network error — please try again.';
      } finally {
        btn.disabled = false;
        btn.textContent = origLabel;
      }
    });
  });
})();
