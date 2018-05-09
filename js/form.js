// Модуль, работающий с формой объявления
'use strict';

(function () {
  var adFormElement = document.querySelector('.ad-form');
  var adFormElements = adFormElement.querySelectorAll('.ad-form__element');
  var adFormResetElement = adFormElement.querySelector('.ad-form__reset');
  var adFormAddressElement = adFormElement.querySelector('#address');
  var adFormTitleElement = adFormElement.querySelector('#title');
  var adFormPriceElement = adFormElement.querySelector('#price');
  var adFormHousingTypeElement = adFormElement.querySelector('#type');
  var adFormCheckInElement = adFormElement.querySelector('#timein');
  var adFormCheckOutElement = adFormElement.querySelector('#timeout');
  var adFormRoomsElement = adFormElement.querySelector('#room_number');
  var adFormCapacityElement = adFormElement.querySelector('#capacity');
  var adFormDescriptionElement = adFormElement.querySelector('#description');
  var adFormCheckboxElements = adFormElement.querySelectorAll('checkbox');
  var adFormInputElements = adFormElement.querySelectorAll('input');
  var adFormSelectElements = adFormElement.querySelectorAll('select');
  var successMsgElement = document.querySelector('.success');

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
    adFormElement.classList.remove('ad-form--disabled');
  };

  // Добавляет элементу формы класс .ad-form--disabled
  var disableForm = function () {
    adFormElement.classList.add('ad-form--disabled');
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
    adFormAddressElement.setAttribute('readonly', '');
  };

  // Добавляет обработчик валидации для поля заголовка объявления
  adFormTitleElement.addEventListener('invalid', function () {
    if (adFormTitleElement.validity.tooShort) {
      adFormTitleElement.setCustomValidity('Длина заголовка должна быть больше 30 символов');
    } else if (adFormTitleElement.validity.tooLong) {
      adFormTitleElement.setCustomValidity('Длина заголовка должна быть меньше 100 символов');
    } else if (adFormTitleElement.validity.valueMissing) {
      adFormTitleElement.setCustomValidity('Обязательно для заполенния');
    } else {
      adFormTitleElement.setCustomValidity('');
    }
  });

  // Добавляет обработчик валидации min длины поля заголовка для edge
  adFormTitleElement.addEventListener('input', function (evt) {
    var target = evt.target;
    if (target.value.length < 30) {
      target.setCustomValidity('Длина заголовка должна быть больше 30 символов');
    } else {
      target.setCustomValidity('');
    }
  });

  // Устанавливает соответствие между типом жилья и минимальным значением цены за ночь
  var matchTypePrice = function () {
    adFormPriceElement.min = typeToPrice[adFormHousingTypeElement.value].min;
    adFormPriceElement.placeholder = typeToPrice[adFormHousingTypeElement.value].placeholder;
  };

  // Добавляет обработчик на поле выбора типа жилья
  adFormHousingTypeElement.addEventListener('change', matchTypePrice);

  // Устанавливает ограничения для поля цены за ночь
  var checkAdPrice = function () {
    if (adFormPriceElement.value < 0) {
      adFormPriceElement.setCustomValidity('Цена не может быть меньше 0');
    } else if (adFormPriceElement.validity.valueMissing) {
      adFormPriceElement.setCustomValidity('Обязательно для заполения');
    } else if (adFormPriceElement.value < 1000 && adFormHousingTypeElement.value === 'flat') {
      adFormPriceElement.setCustomValidity('Цена для квартиры не может быть меньше 1000 за ночь');
    } else if (adFormPriceElement.value < 5000 && adFormHousingTypeElement.value === 'house') {
      adFormPriceElement.setCustomValidity('Цена для дома не может быть меньше 5000 за ночь');
    } else if (adFormPriceElement.value < 10000 && adFormHousingTypeElement.value === 'palace') {
      adFormPriceElement.setCustomValidity('Цена для дворца не может быть меньше 10000 за ночь');
    } else if (adFormPriceElement.validity.rangeOverflow) {
      adFormPriceElement.setCustomValidity('Максимальная цена - 1 000 000');
    } else {
      adFormPriceElement.setCustomValidity('');
    }
  };

  // Добавляет обработчик валидации для поля цены за ночь
  adFormPriceElement.addEventListener('input', checkAdPrice);
  adFormHousingTypeElement.addEventListener('change', checkAdPrice);

  // Устанавливает соответствие между значениями полей чекина и чекаута
  var matchCheckinCheckout = function (evt) {
    var target = evt.target;
    if (target === adFormCheckInElement) {
      adFormCheckOutElement.value = target.value;
    } else if (target === adFormCheckOutElement) {
      adFormCheckInElement.value = target.value;
    }
  };

  // Добавляет обработчики на поля чекина и чекаута
  adFormCheckInElement.addEventListener('input', matchCheckinCheckout);
  adFormCheckOutElement.addEventListener('input', matchCheckinCheckout);

  // Задает ограничение числа гостей в зависимости от выбранного количества комнат
  var checkRoomNumberCapacity = function () {
    var rooms = adFormRoomsElement.value;
    var guests = adFormCapacityElement.value;

    if (rooms === '100' && guests !== '0') {
      adFormCapacityElement.setCustomValidity('Выберите вариант "не для гостей"');
    } else if (rooms === '1' && guests > '1') {
      adFormCapacityElement.setCustomValidity('В 1 комнате можно разместить только 1 гостя');
    } else if (rooms === '2' && guests > '2') {
      adFormCapacityElement.setCustomValidity('В ' + rooms + ' комнатах можно разместить не более ' + rooms + ' гостей.');
    } else if (rooms !== '100' && guests === '0') {
      adFormCapacityElement.setCustomValidity('Укажите число гостей, но не более ' + rooms + '.');
    } else {
      adFormCapacityElement.setCustomValidity('');
    }
  };

  // Устанавливает соответствие между числом комнат и числом гостей
  var matchRoomsCapacity = function () {
    if (adFormRoomsElement.value === '100') {
      adFormCapacityElement.value = '0';
    } else {
      adFormCapacityElement.value = adFormRoomsElement.value;
    }
  };

  // Добавляет обработчики на поля числа комнат и количества гостей
  adFormRoomsElement.addEventListener('change', checkRoomNumberCapacity);
  adFormCapacityElement.addEventListener('change', checkRoomNumberCapacity);

  matchTypePrice();
  matchRoomsCapacity();
  setAddressFieldReadonly();

  // Сбрасывает значения полей формы на значения по умолчанию
  var resetFormFields = function (fields) {
    fields.forEach(function (field) {
      if (field.type === 'checkbox') {
        field.checked = formDefaultValues[field.id];
      } else if (field.type === 'file') {
        field.value = '';
      } else {
        field.value = formDefaultValues[field.id];
      }
    });
  };

  // Показывает сообщение об успешной отправке формы
  var onSuccess = function () {
    successMsgElement.classList.remove('hidden');
    window.map.deactivatePage();
    successMsgElement.addEventListener('click', hideSuccessMsg);
  };

  // Скрывает сообщение об успешной отправке формы
  var hideSuccessMsg = function () {
    successMsgElement.classList.add('hidden');
    successMsgElement.removeEventListener('click', hideSuccessMsg);
  };

  // Отправляет данные формы на сервер
  var onAdFormSubmit = function (evt) {
    window.backend.upload(new FormData(adFormElement), onSuccess, window.util.showErrorMessage);
    evt.preventDefault();
  };

  // Добавляет обработчик события отправки формы
  adFormElement.addEventListener('submit', onAdFormSubmit);

  window.form = {
    // Переключает форму в активное состояние
    activate: function () {
      enableForm();
      enableFormElements();
      adFormResetElement.addEventListener('click', window.map.deactivatePage);
    },

    // Переключает форму в неактивное состояние
    deactivate: function () {
      disableForm();
      disableFormElements();
      adFormResetElement.removeEventListener('click', window.map.deactivatePage);
    },

    // Сбрасывает введенные значения полей формы
    reset: function () {
      resetFormFields(adFormCheckboxElements);
      resetFormFields(adFormInputElements);
      resetFormFields(adFormSelectElements);
      adFormDescriptionElement.value = formDefaultValues[adFormDescriptionElement.id];
      matchTypePrice();
    }
  };
})();
