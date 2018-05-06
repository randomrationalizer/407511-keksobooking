// Модуль, работающий с формой объявления
'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormElements = adForm.querySelectorAll('.ad-form__element');
  var adFormReset = adForm.querySelector('.ad-form__reset');
  var adFormAddressField = adForm.querySelector('#address');
  var adFormTitleInput = adForm.querySelector('#title');
  var adFormPriceInput = adForm.querySelector('#price');
  var adFormHousingType = adForm.querySelector('#type');
  var adFormCheckIn = adForm.querySelector('#timein');
  var adFormCheckOut = adForm.querySelector('#timeout');
  var adFormRooms = adForm.querySelector('#room_number');
  var adFormCapacity = adForm.querySelector('#capacity');
  var adFormDescription = adForm.querySelector('#description');
  var adFormCheckboxes = adForm.querySelectorAll('checkbox');
  var adFormInputs = adForm.querySelectorAll('input');
  var adFormSelects = adForm.querySelectorAll('select');
  var successMsg = document.querySelector('.success');

  // Значения полей формы по умолчанию
  var formDefaultValues = {
    'title': '',
    'type': 'flat',
    'price': '',
    'timein': '12:00',
    'timeout': '12:00',
    'room_number': '1',
    'capacity': '1',
    'feature-wifi': false,
    'feature-dishwasher': false,
    'feature-parking': false,
    'feature-washer': false,
    'feature-elevator': false,
    'feature-conditioner': false,
    'description': ''
  };

  // Ограничения для поля цены в зависимости от типа жилья
  var typeToPrice = {
    'bungalo': {
      min: 0,
      placeholder: 0
    },
    'flat': {
      min: 1000,
      placeholder: 1000
    },
    'house': {
      min: 5000,
      placeholder: 5000
    },
    'palace': {
      min: 10000,
      placeholder: 10000
    },
  };

  // Убирает у элемента формы класс .ad-form--disabled
  var enableForm = function () {
    adForm.classList.remove('ad-form--disabled');
  };

  // Добавляет элементу формы класс .ad-form--disabled
  var disableForm = function () {
    adForm.classList.add('ad-form--disabled');
  };

  // Блокирует поля формы от редактирования
  var disableFormElements = function () {
    adFormElements.forEach(function (elem) {
      elem.disabled = true;
    });
  };

  // Делает поля формы доступными для редактирования
  var enableFormElements = function () {
    adFormElements.forEach(function (elem) {
      elem.disabled = false;
    });
  };

  // Блокирует поле адреса от редактирования
  var setAddressFieldReadonly = function () {
    adFormAddressField.setAttribute('readonly', '');
  };

  // Добавляет обработчик валидации для поля заголовка объявления
  adFormTitleInput.addEventListener('invalid', function () {
    if (adFormTitleInput.validity.tooShort) {
      adFormTitleInput.setCustomValidity('Длина заголовка должна быть больше 30 символов');
    } else if (adFormTitleInput.validity.tooLong) {
      adFormTitleInput.setCustomValidity('Длина заголовка должна быть меньше 100 символов');
    } else if (adFormTitleInput.validity.valueMissing) {
      adFormTitleInput.setCustomValidity('Обязательно для заполенния');
    } else {
      adFormTitleInput.setCustomValidity('');
    }
  });

  // Добавляет обработчик валидации min длины поля заголовка для edge
  adFormTitleInput.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value.length < 30) {
      target.setCustomValidity('Длина заголовка должна быть больше 30 символов');
    } else {
      target.setCustomValidity('');
    }
  });

  // Устанавливает соответствие между типом жилья и минимальным значением цены за ночь
  var matchTypePrice = function () {
    adFormPriceInput.min = typeToPrice[adFormHousingType.value].min;
    adFormPriceInput.placeholder = typeToPrice[adFormHousingType.value].placeholder;
  };

  // Добавляет обработчик на поле выбора типа жилья
  adFormHousingType.addEventListener('change', matchTypePrice);

  // Устанавливает ограничения для поля цены за ночь
  var checkAdPrice = function (evt) {
    var target = evt.target;
    if (target.value < 0) {
      target.setCustomValidity('Цена не может быть меньше 0');
    } else if (adFormPriceInput.validity.valueMissing) {
      target.setCustomValidity('Обязательно для заполения');
    } else if (target.value < 1000 && adFormHousingType.value === 'flat') {
      target.setCustomValidity('Цена для квартиры не может быть меньше 1000 за ночь');
    } else if (target.value < 5000 && adFormHousingType.value === 'house') {
      target.setCustomValidity('Цена для дома не может быть меньше 5000 за ночь');
    } else if (target.value < 10000 && adFormHousingType.value === 'palace') {
      target.setCustomValidity('Цена для дворца не может быть меньше 10000 за ночь');
    } else if (adFormPriceInput.validity.rangeOverflow) {
      target.setCustomValidity('Максимальная цена - 1 000 000');
    } else {
      target.setCustomValidity('');
    }
  };

  // Добавляет обработчик валидации для поля цены за ночь
  adFormPriceInput.addEventListener('invalid', checkAdPrice);

  // Устанавливает соответствие между значениями полей чекина и чекаута
  var matchCheckinCheckout = function (evt) {
    var target = evt.target;
    if (target === adFormCheckIn) {
      adFormCheckOut.value = target.value;
    } else if (target === adFormCheckOut) {
      adFormCheckIn.value = target.value;
    }
  };

  // Добавляет обработчики на поля чекина и чекаута
  adFormCheckIn.addEventListener('input', matchCheckinCheckout);
  adFormCheckOut.addEventListener('input', matchCheckinCheckout);

  // Задает ограничение числа гостей в зависимости от выбранного количества комнат
  var checkRoomNumberCapacity = function () {
    var rooms = adFormRooms.value;
    var guests = adFormCapacity.value;

    if (rooms === '100' && guests !== '0') {
      adFormCapacity.setCustomValidity('Выберите вариант "не для гостей"');
    } else if (rooms === '1' && guests > '1') {
      adFormCapacity.setCustomValidity('В 1 комнате можно разместить только 1 гостя');
    } else if (rooms === '2' && guests > '2') {
      adFormCapacity.setCustomValidity('В ' + rooms + ' комнатах можно разместить не более ' + rooms + ' гостей.');
    } else if (rooms !== '100' && guests === '0') {
      adFormCapacity.setCustomValidity('Укажите число гостей, но не более ' + rooms + '.');
    } else {
      adFormCapacity.setCustomValidity('');
    }
  };

  // Устанавливает соответствие между числом комнат и числом гостей
  var matchRoomsCapacity = function () {
    if (adFormRooms.value === '100') {
      adFormCapacity.value = '0';
    } else {
      adFormCapacity.value = adFormRooms.value;
    }
  };

  // Добавляет обработчики на поля числа комнат и количества гостей
  adFormRooms.addEventListener('change', checkRoomNumberCapacity);
  adFormCapacity.addEventListener('change', checkRoomNumberCapacity);

  matchTypePrice();
  matchRoomsCapacity();
  setAddressFieldReadonly();

  // Сбрасывает значения полей формы на значения по умолчанию
  var resetFormFields = function (fields) {
    fields.forEach(function (field) {
      if (field.type === 'checkbox') {
        field.checked = formDefaultValues[field.id];
      } else if (field.type !== 'file') {
        field.value = formDefaultValues[field.id];
      }
    });
  };

  // Показывает сообщение об успешной отправке формы
  var onSuccess = function () {
    successMsg.classList.remove('hidden');
    window.map.deactivatePage();
    successMsg.addEventListener('click', hideSuccessMsg);
  };

  // Скрывает сообщение об успешной отправке формы
  var hideSuccessMsg = function () {
    successMsg.classList.add('hidden');
    successMsg.removeEventListener('click', hideSuccessMsg);
  };

  // Отправляет данные формы на сервер
  var onAdFormSubmit = function (evt) {
    window.backend.upload(new FormData(adForm), onSuccess, window.util.showErrorMessage);
    evt.preventDefault();
  };

  // Добавляет обработчик события отправки формы
  adForm.addEventListener('submit', onAdFormSubmit);

  window.form = {
    // Переключает форму в активное состояние
    activateForm: function () {
      enableForm();
      enableFormElements();
      adFormReset.addEventListener('click', window.map.deactivatePage);
    },

    // Переключает форму в неактивное состояние
    deactivateForm: function () {
      disableForm();
      disableFormElements();
      adFormReset.removeEventListener('click', window.map.deactivatePage);
    },

    // Сбрасывает введенные значения полей формы
    resetAdForm: function () {
      resetFormFields(adFormCheckboxes);
      resetFormFields(adFormInputs);
      resetFormFields(adFormSelects);
      adFormDescription.value = formDefaultValues[adFormDescription.id];
    }
  };
})();
