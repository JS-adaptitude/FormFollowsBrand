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

  // --- email capture mock ---
  document.querySelectorAll('.capture-form').forEach((form) => {
    form.addEventListener('submit', (ev) => {
      ev.preventDefault();
      const input = form.querySelector('input[type=email]');
      const val = (input.value || '').trim();
      const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
      if (!ok) {
        input.style.borderColor = 'var(--brick)';
        input.focus();
        return;
      }
      input.style.borderColor = '';
      const cap = form.closest('.capture');
      cap.classList.add('is-sent');
      try {
        const list = JSON.parse(localStorage.getItem('ffb_signups') || '[]');
        list.push({ email: val, at: Date.now() });
        localStorage.setItem('ffb_signups', JSON.stringify(list));
      } catch (e) {}
    });
  });
})();
