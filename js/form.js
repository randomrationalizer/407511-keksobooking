// Модуль, работающий с формой объявления
'use strict';

(function () {
  var adForm = document.querySelector('.ad-form');
  var adFormElements = document.querySelectorAll('.ad-form__element');
  var adFormReset = document.querySelector('.ad-form__reset');
  var adFormAddressField = document.getElementById('address');
  var adFormTitleInput = document.getElementById('title');
  var adFormPriceInput = document.getElementById('price');
  var adFormHousingType = document.getElementById('type');
  var adFormCheckIn = document.getElementById('timein');
  var adFormCheckOut = document.getElementById('timeout');
  var adFormRooms = document.getElementById('room_number');
  var adFormCapacity = document.getElementById('capacity');
  var adFormDescription = document.getElementById('description');
  var successMsg = document.querySelector('.success');

  // Значения полей формы по умолчанию
  var formDefaultValues = {
    type: 'flat',
    time: '12:00',
    rooms: '1',
    capacity: '1'
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
    for (var i = 0; i < adFormElements.length; i++) {
      adFormElements[i].disabled = true;
    }
  };

  // Делает поля формы доступными для редактирования
  var enableFormElements = function () {
    for (var i = 0; i < adFormElements.length; i++) {
      adFormElements[i].disabled = false;
    }
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

  // Показывает сообщение об успешной отправке формы
  var onSuccess = function () {
    successMsg.classList.remove('hidden');
    window.map.deactivatePage();
    setTimeout(hideSuccessMsg, 1300);
  };

  // Скрывает сообщение об успешной отправке формы
  var hideSuccessMsg = function () {
    successMsg.classList.add('hidden');
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
      var inputs = adForm.querySelectorAll('input');
      inputs.forEach(function (item) {
        if (item.type !== 'checkbox') {
          item.value = '';
        } else {
          item.checked = false;
        }
      });
      adFormHousingType.value = formDefaultValues.type;
      adFormCheckIn.value = formDefaultValues.time;
      adFormCheckOut.value = formDefaultValues.time;
      adFormRooms.value = formDefaultValues.rooms;
      adFormCapacity.value = formDefaultValues.capacity;
      adFormDescription.value = '';
    }
  };
})();
