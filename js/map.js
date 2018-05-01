// Модуль отрисовывает пины и карточку объявления, устанавливает взаимодействие карточки и пина на карте
'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var mapPinMain = mapElement.querySelector('.map__pin--main');

  // Отрисовывает сгенерированные DOM-элементы пинов в блок .map__pins
  var renderMapPins = function (arr) {
    var fragment = document.createDocumentFragment();
    for (var i = 0; i < arr.length; i++) {
      fragment.appendChild(window.pins.createPinElement(arr[i], i));
    }
    mapPinsElement.appendChild(fragment);
  };

  // Добавляет на все пины, кроме метки-кекса, обработчики, открывающие попап с карточой обявления
  var addPinsClickHandlers = function () {
    var pins = mapPinsElement.querySelectorAll('.map__pin');
    for (var i = 0; i < pins.length; i++) {
      pins[i].addEventListener('click', window.popup.openAdCard);
    }
    mapPinMain.removeEventListener('click', window.popup.openAdCard);
  };

  // Активирует карту
  var mapActivate = function () {
    mapElement.classList.remove('map--faded');
  };

  // Переключает карту в неактивное состояние
  var mapDeactivate = function () {
    mapElement.classList.add('map--faded');
  };

  // Переключает страницу в неактивное состояние
  var pageDeactivate = function () {
    mapDeactivate();
    window.form.deactivateForm();
  };

  // Переключает страницу в активное состояние
  var pageActivate = function () {
    mapActivate();
    window.form.activateForm();
    renderMapPins(window.data.adsArray);
    addPinsClickHandlers();
    mapPinMain.removeEventListener('mouseup', pageActivate);
  };

  // Добавляет на метку-кекс обработчик события (отпускание элемента), активирующий страницу
  mapPinMain.addEventListener('mouseup', pageActivate);

  // Исходное неактивное состояние страницы
  pageDeactivate();
})();
