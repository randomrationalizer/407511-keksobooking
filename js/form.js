// Модуль, работающий с формой объявления

'use strict';
(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormElements = document.querySelectorAll('.ad-form__element');
  var adFormAddressField = document.getElementById('address');
  var adFormTitleInput = document.getElementById('title');
  var adFormPriceInput = document.getElementById('price');
  var adFormHousingType = document.getElementById('type');
  var adFormCheckIn = document.getElementById('timein');
  var adFormCheckOut = document.getElementById('timeout');
  var adFormRooms = document.getElementById('room_number');
  var adFormCapacity = document.getElementById('capacity');

  // Убирает у элемента формы класс .ad-form--disabled
  var adFormEnable = function () {
    adForm.classList.remove('ad-form--disabled');
  };

  // Добавляет элементу формы класс .ad-form--disabled
  var adFormDisable = function () {
    adForm.classList.add('ad-form--disabled');
  };

  // Блокирует поля формы от редактирования
  var adFormElementsDisable = function () {
    for (var i = 0; i < adFormElements.length; i++) {
      adFormElements[i].disabled = true;
    }
  };

  // Делает поля формы доступными для редактирования
  var adFormElementsEnable = function () {
    for (var i = 0; i < adFormElements.length; i++) {
      adFormElements[i].disabled = false;
    }
  };

  // Блокирует поле адреса от редактирования
  var adFormAddressFieldReadonly = function () {
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
  var adTypePriceMatch = function () {
    if (adFormHousingType.value === 'bungalo') {
      adFormPriceInput.min = 0;
      adFormPriceInput.placeholder = 0;
    } else if (adFormHousingType.value === 'flat') {
      adFormPriceInput.min = 1000;
      adFormPriceInput.placeholder = 1000;
    } else if (adFormHousingType.value === 'house') {
      adFormPriceInput.min = 5000;
      adFormPriceInput.placeholder = 5000;
    } else if (adFormHousingType.value === 'palace') {
      adFormPriceInput.min = 10000;
      adFormPriceInput.placeholder = 10000;
    }
  };

  // Добавляет обработчик на поле выбора типа жилья
  adFormHousingType.addEventListener('change', adTypePriceMatch);

  // Устанавливает ограничения для поля цены за ночь
  var adPriceCheck = function (evt) {
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
  adFormPriceInput.addEventListener('invalid', adPriceCheck);

  // Устанавливает соответствие между значениями полей чекина и чекаута
  var adCheckinCheckoutMatch = function (evt) {
    var target = evt.target;
    if (target === adFormCheckIn) {
      adFormCheckOut.value = target.value;
    } else if (target === adFormCheckOut) {
      adFormCheckIn.value = target.value;
    }
  };

  // Добавляет обработчики на поля чекина и чекаута
  adFormCheckIn.addEventListener('input', adCheckinCheckoutMatch);
  adFormCheckOut.addEventListener('input', adCheckinCheckoutMatch);

  // Задает ограничение числа гостей в зависимости от выбранного количества комнат
  var adRoomNumberCapacityMatch = function () {
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
  var adRoomsCapacityMatch = function () {
    if (adFormRooms.value === '100') {
      adFormCapacity.value = '0';
    } else {
      adFormCapacity.value = adFormRooms.value;
    }
  };

  // Добавляет обработчики на поля числа комнат и количества гостей
  adFormRooms.addEventListener('change', adRoomNumberCapacityMatch);
  adFormCapacity.addEventListener('change', adRoomNumberCapacityMatch);

  adTypePriceMatch();
  adRoomsCapacityMatch();
  adFormAddressFieldReadonly();

  window.form = {
    // Переключает форму в активное состояние
    activateForm: function () {
      adFormEnable();
      adFormElementsEnable();
      window.mainpin.sendMapPinMainCoordinates(true);
    },

    // Переключает форму в неактивное состояние
    deactivateForm: function () {
      adFormDisable();
      adFormElementsDisable();
      window.mainpin.sendMapPinMainCoordinates(false);
    }
  };
})();
