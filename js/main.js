const orderDialog = document.getElementById('order-dialog');
const orderButtons = document.querySelectorAll('.product-card__button');
const closeDialogButton = document.getElementById('close-order-dialog');
const selectedProductInput = document.getElementById('selected-product');
const submitDialogButton = document.getElementById('submit-order-dialog');
const orderForm = document.getElementById('order-form');
const successMessage = document.getElementById('success-message');
const checkboxDialogButton = document.getElementById('checkbox-order-dialog');

// Начальное состояние кнопки
submitDialogButton.disabled = true;

orderButtons.forEach((button) => {
  button.addEventListener('click', () => {
    const productName = button.dataset.product;
    selectedProductInput.value = productName;
    orderDialog.showModal();
  });
});

closeDialogButton.addEventListener('click', () => {
  orderDialog.close();
});

// Включаем/выключаем кнопку в зависимости от чекбокса
checkboxDialogButton.addEventListener('change', () => {
  submitDialogButton.disabled = !submitDialogButton.disabled;
});

// Обработка отправки формы
orderForm.addEventListener('submit', (event) => {
  event.preventDefault();

  const formElements = Array.from(orderForm.elements);

  formElements.forEach((element) => {
    if (element.willValidate) {
      element.removeAttribute('aria-invalid');
    }
  });

  if (!orderForm.checkValidity()) {
    formElements.forEach((element) => {
      if (element.willValidate && !element.checkValidity()) {
        element.setAttribute('aria-invalid', 'true');
      }
    });
    orderForm.reportValidity();
    return;
  }

  successMessage.hidden = false;
  orderForm.reset();
  submitDialogButton.disabled = true; // если нужно снова
  orderDialog.close();
});