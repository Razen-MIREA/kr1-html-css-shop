document.addEventListener('DOMContentLoaded', () => {
  /* =========================================================
     1. ДИАЛОГ ОФОРМЛЕНИЯ ЗАЯВКИ
     ========================================================= */
  const orderDialog = document.getElementById('order-dialog');
  const orderButtons = document.querySelectorAll('[data-product]');
  const closeDialogButton = document.getElementById('close-order-dialog');
  const closeDialogX = document.getElementById('close-order-dialog-x');
  const clearButton = document.getElementById('clear-order-form');
  const selectedProductInput = document.getElementById('selected-product');
  const submitDialogButton = document.getElementById('submit-order-dialog');
  const checkboxDialogButton = document.getElementById('checkbox-order-dialog');
  const orderForm = document.getElementById('order-form');
  const successMessage = document.getElementById('success-message');

  if (!orderDialog || !orderForm) return;

  /* --- Поля с правилами валидации и подсказками --- */
  const fields = {
    name: {
      el: document.getElementById('order-name'),
      error: document.getElementById('order-name-error'),
      validate: (v) =>
        v.trim().length >= 2 ? '' : 'Введите имя (минимум 2 символа)',
    },
    email: {
      el: document.getElementById('order-email'),
      error: document.getElementById('order-email-error'),
      validate: (v) => {
        if (!v.trim()) return 'Укажите e-mail';
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim())
          ? ''
          : 'Некорректный e-mail, пример: user@mail.ru';
      },
    },
    phone: {
      el: document.getElementById('order-phone'),
      error: document.getElementById('order-phone-error'),
      validate: (v) => {
        if (!v.trim()) return 'Укажите номер телефона';
        return /^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(v.trim())
          ? ''
          : 'Формат: +7 (900) 000-00-00';
      },
    },
    topic: {
      el: document.getElementById('order-topic'),
      error: document.getElementById('order-topic-error'),
      validate: (v) => (v ? '' : 'Выберите тему заявки'),
    },
    agreement: {
      el: checkboxDialogButton,
      error: document.getElementById('checkbox-order-dialog-error'),
      validate: (_v, el) =>
        el.checked ? '' : 'Необходимо согласие на обработку данных',
    },
  };

  const touched = new Set();

  const showError = (field, message) => {
    if (!field.el || !field.error) return;
    if (message) {
      field.error.textContent = message;
      field.error.hidden = false;
      field.el.setAttribute('aria-invalid', 'true');
    } else {
      field.error.textContent = '';
      field.error.hidden = true;
      field.el.setAttribute('aria-invalid', 'false');
    }
  };

  const validateField = (key) => {
    const f = fields[key];
    if (!f.el) return true;
    const msg = f.validate(f.el.value, f.el);
    showError(f, msg);
    return !msg;
  };

  const clearAllErrors = () => {
    Object.values(fields).forEach((f) => showError(f, ''));
    touched.clear();
  };

  const syncSubmitState = () => {
    if (submitDialogButton && checkboxDialogButton) {
      submitDialogButton.disabled = !checkboxDialogButton.checked;
    }
  };

  // Начальное состояние
  syncSubmitState();

  /* --- Открытие диалога при клике на «Заказать» --- */
  orderButtons.forEach((button) => {
    button.addEventListener('click', () => {
      // пропускаем «Подробнее» — у него нет data-product
      if (!button.dataset.product) return;

      if (selectedProductInput) {
        selectedProductInput.value = button.dataset.product;
      }

      // На случай, если чекбокс был изменён программно
      syncSubmitState();

      orderDialog.showModal();
    });
  });

  /* --- Закрытие --- */
  const closeDialog = () => {
    if (typeof orderDialog.close === 'function') orderDialog.close();
    else orderDialog.removeAttribute('open');
  };

  closeDialogButton?.addEventListener('click', closeDialog);
  closeDialogX?.addEventListener('click', closeDialog);

  // Клик по подложке
  orderDialog.addEventListener('click', (e) => {
    if (e.target !== orderDialog) return; // клик внутри формы игнорируем
    const rect = orderDialog.getBoundingClientRect();
    const inside =
      e.clientX >= rect.left &&
      e.clientX <= rect.right &&
      e.clientY >= rect.top &&
      e.clientY <= rect.bottom;
    if (!inside) closeDialog();
  });

  /* --- Связка «чекбокс → кнопка» (на живое изменение) --- */
  if (checkboxDialogButton) {
    checkboxDialogButton.addEventListener('change', () => {
      syncSubmitState();
      if (touched.has('agreement')) validateField('agreement');
    });
  }

  /* --- Валидация: blur → всегда, input/change → если «трогали» --- */
  Object.entries(fields).forEach(([key, f]) => {
    if (!f.el) return;
    if (key === 'agreement') return; // уже обработали выше

    f.el.addEventListener('blur', () => {
      touched.add(key);
      validateField(key);
    });

    const liveEvent =
      f.el.tagName === 'SELECT' ? 'change' : 'input';

    f.el.addEventListener(liveEvent, () => {
      if (touched.has(key)) validateField(key);
    });
  });

  /* --- «Очистить всё» --- */
  clearButton?.addEventListener('click', () => {
    orderForm.reset();
    if (selectedProductInput) selectedProductInput.value = '';
    clearAllErrors();
    if (successMessage) successMessage.hidden = true;

    // reset() не вызывает change у чекбокса — синхронизируем кнопку вручную
    syncSubmitState();

    if (typeof orderDialog.scrollTo === 'function') {
      orderDialog.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // fallback для старых браузеров
      orderDialog.scrollTop = 0;
    }
  });

  /* --- Отправка --- */
  orderForm.addEventListener('submit', (event) => {
    event.preventDefault();

    Object.keys(fields).forEach((k) => touched.add(k));

    let allValid = true;
    Object.keys(fields).forEach((k) => {
      if (!validateField(k)) allValid = false;
    });

    if (!allValid) {
      const firstInvalid = Object.values(fields).find(
        (f) => f.el && f.el.getAttribute('aria-invalid') === 'true'
      );
      firstInvalid?.el.focus();
      return;
    }

    if (successMessage) {
      successMessage.hidden = false;
      successMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }

    orderForm.reset();
    if (selectedProductInput) selectedProductInput.value = '';
    clearAllErrors();

    // reset() не снимает disabled — принудительно возвращаем «выключено»
    syncSubmitState();

    closeDialog();
  });

  /* =========================================================
     2. FAQ-АККОРДЕОН (кастомный, совместим с aria-разметкой)
     ========================================================= */
  const faqList = document.querySelector('.faq__list');

  faqList?.addEventListener('click', (event) => {
    const trigger = event.target.closest('.faq-item__trigger');
    if (!trigger) return;

    const item = trigger.closest('.faq-item');
    const panel = document.getElementById(trigger.getAttribute('aria-controls'));
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    trigger.setAttribute('aria-expanded', String(!isOpen));
    item.classList.toggle('faq-item_open', !isOpen);
    if (panel) panel.hidden = isOpen;
  });
});