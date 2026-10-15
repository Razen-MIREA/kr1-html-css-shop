(function () {
  const btn = document.createElement('button');
  btn.className = 'scroll-top';
  btn.type = 'button';
  btn.setAttribute('aria-label', 'Наверх');
  btn.innerHTML = `
    <svg class="scroll-top__icon" width="24" height="24" aria-hidden="true">
      <use href="#icon-arrow-up"></use>
    </svg>
  `;
  document.body.appendChild(btn);

  const threshold = 600;
  let ticking = false;

  function update() {
    btn.classList.toggle('scroll-top_visible', window.scrollY > threshold);
    ticking = false;
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(update);
      ticking = true;
    }
  }, { passive: true });

  update();

  btn.addEventListener('click', () => {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
  });
})();