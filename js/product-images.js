document.addEventListener('DOMContentLoaded', () => {
  const escapeXml = (str) =>
    String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');

  const placeholder = (name) => {
    const safe = escapeXml(name || 'Изображение');
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 480 360">
  <defs>
    <linearGradient id="g" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0" stop-color="#eaf1fb"/>
      <stop offset="1" stop-color="#d6e3f5"/>
    </linearGradient>
  </defs>
  <rect width="480" height="360" fill="url(#g)"/>
  <text x="240" y="170" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="20" fill="#5a6b85">Изображение недоступно</text>
  <text x="240" y="200" text-anchor="middle" font-family="Arial, sans-serif"
        font-size="16" fill="#8a9ab3">${safe}</text>
</svg>`;
    return 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svg);
  };

  document.querySelectorAll('.product-card__image').forEach((img) => {
    const apply = () => {
      if (img.dataset.fallbackApplied === 'true') return;
      img.dataset.fallbackApplied = 'true';
      img.removeAttribute('srcset');
      img.src = placeholder(img.dataset.fallbackName || img.alt || '');
    };

    img.addEventListener('error', apply, { once: true });

    // Если картинка уже успела "сломаться" до навешивания обработчика
    if (img.complete && img.naturalWidth === 0) apply();
  });
});