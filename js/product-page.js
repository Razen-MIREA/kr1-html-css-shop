document.addEventListener('DOMContentLoaded', () => {
  const PRODUCTS = {
    'aurora-x1': {
      name: 'Смартфон Aurora X1',
      price: '1 000 руб.',
      specs: '6.5" AMOLED · 8/128 ГБ · 5000 мА·ч',
      description:
        'Сбалансированный смартфон для повседневных задач и мультимедиа: ' +
        'яркий AMOLED-экран, ёмкий аккумулятор и быстрая зарядка.',
    },
    'sonic-pro': {
      name: 'Наушники Sonic Pro',
      price: '1 500 руб.',
      specs: 'Bluetooth 5.3 · ANC · до 30 ч',
      description:
        'Полноразмерные беспроводные наушники с активным шумоподавлением ' +
        'и автономностью до 30 часов — для работы, поездок и музыки.',
    },
    'kliko-87': {
      name: 'Клавиатура Kliko 87',
      price: '2 000 руб.',
      specs: 'механика · TKL 87 · RGB',
      description:
        'Компактная механическая клавиатура формата TKL с подсветкой RGB — ' +
        'удобна и для работы с текстом, и для игр.',
    },
    'glide-mini': {
      name: 'Мышь Glide Mini',
      price: '800 руб.',
      specs: 'беспроводная · 8000 DPI · 58 г',
      description:
        'Лёгкая беспроводная мышь весом всего 58 г — хорошо подходит ' +
        'для ноутбука и поездок.',
    },
    'viewmax-24': {
      name: 'Монитор ViewMax 24"',
      price: '12 000 руб.',
      specs: '24" IPS · 1920×1080 · 75 Гц',
      description:
        'Офисный монитор с IPS-матрицей и тонкими рамками: хорошая ' +
        'цветопередача и комфорт при долгой работе.',
    },
    'clearview-cam': {
      name: 'Веб-камера ClearView',
      price: '3 200 руб.',
      specs: '1080p · 30 fps · USB',
      description:
        'Веб-камера с разрешением Full HD и встроенным микрофоном — ' +
        'для видеозвонков, учёбы и стримов.',
    },
    'boombox-s': {
      name: 'Колонка BoomBox S',
      price: '4 500 руб.',
      specs: 'Bluetooth · 20 Вт · до 12 ч',
      description:
        'Компактная портативная колонка с громким и чистым звуком ' +
        'и автономностью до 12 часов.',
    },
    'volt-20000': {
      name: 'Powerbank Volt 20000',
      price: '2 700 руб.',
      specs: '20 000 мА·ч · USB-C PD 20 Вт',
      description:
        'Универсальный внешний аккумулятор на 20 000 мА·ч с быстрой ' +
        'зарядкой USB-C PD — хватит на несколько подзарядок телефона.',
    },
    'phone-case': {
      name: 'Чехол для смартфона',
      price: '600 руб.',
      specs: 'силикон · soft-touch · Qi-зарядка',
      description:
        'Тонкий защитный чехол из силикона с приятной на ощупь ' +
        'поверхностью; не мешает беспроводной зарядке.',
    },
  };

  const DEFAULT_ID = 'aurora-x1';

  const id = new URLSearchParams(location.search).get('id') || DEFAULT_ID;
  const product = PRODUCTS[id] || PRODUCTS[DEFAULT_ID];

  const isKnown = Object.prototype.hasOwnProperty.call(PRODUCTS, id);

  // --- Подстановка данных ---
  const setText = (el, value) => { if (el) el.textContent = value; };
  const setAttr = (el, attr, value) => { if (el) el.setAttribute(attr, value); };

  const title = product.name;
  const fullTitle = `${title} — Учебный интернет-магазин`;
  const imageSrc = `images/products/${id in PRODUCTS ? id : DEFAULT_ID}.jpg`;

  document.title = fullTitle;
  setText(document.getElementById('page-title'), fullTitle);
  setAttr(document.getElementById('page-description'), 'content', product.description);
  setText(document.getElementById('og-title'), fullTitle);
  setAttr(document.getElementById('og-title'), 'content', fullTitle);
  setAttr(document.getElementById('og-description'), 'content', product.description);
  setAttr(document.getElementById('og-image'), 'content', imageSrc);

  setText(document.getElementById('product-breadcrumb'), title);
  setText(document.getElementById('product-title'), title);
  setText(document.getElementById('product-specs'), product.specs);
  setText(document.getElementById('product-price'), product.price);
  setText(document.getElementById('product-description'), product.description);

  const orderButton = document.getElementById('product-order-button');
  if (orderButton) orderButton.dataset.product = title;

  const image = document.getElementById('product-image');
  if (image) {
    image.src = imageSrc;
    image.alt = title;
    image.dataset.fallbackName = title;
    // Сбрасываем флаг fallback, если картинка уже была заменена ранее
    delete image.dataset.fallbackApplied;
    // Если src успел сломаться до срабатывания product-images.js —
    // повторная установка src перезапустит загрузку.
    if (image.complete && image.naturalWidth === 0) {
      // Дождёмся, пока product-images.js навесит обработчик
    }
  }

  // Если товар не найден — деликатно сообщаем
  if (!isKnown) {
    const info = document.querySelector('.product-page__info');
    if (info) {
      const note = document.createElement('p');
      note.className = 'product-page__note';
      note.textContent =
        'Товар не найден — показан один из популярных товаров. ' +
        'Вернитесь в каталог, чтобы выбрать другой.';
      info.appendChild(note);
    }
  }
});