// Модуль отрисовывает пины и карточку объявления, устанавливает взаимодействие карточки и пина на карте
'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var mapPinMain = mapElement.querySelector('.map__pin--main');

  // Активирует карту
  var activateMap = function () {
    mapElement.classList.remove('map--faded');
  };

  // Переключает карту в неактивное состояние
  var deactivateMap = function () {
    mapElement.classList.add('map--faded');
  };

  // Переключает страницу в активное состояние
  var activatePage = function () {
    activateMap();
    window.form.activateForm();
    window.mainpin.sendMapPinMainCoordinates(true);
    window.pins.renderMapPins(window.pins.adsData);
    window.pins.hidePins();
    window.pins.showPins(window.pins.adsData, window.pins.adsData);
    mapPinMain.removeEventListener('mouseup', activatePage);
  };

  // Добавляет на метку-кекс обработчик события (отпускание элемента), активирующий страницу
  mapPinMain.addEventListener('mouseup', activatePage);

  window.map = {
    // Переключает страницу в неактивное состояние
    deactivatePage: function () {
      deactivateMap();
      window.form.deactivateForm();
      window.mainpin.resetPinMain();
      window.form.resetAdForm();
      window.pins.deletePins();
      window.popup.closeAdCard();
      window.mainpin.sendMapPinMainCoordinates(false);
      mapPinMain.addEventListener('mouseup', activatePage);
    }
  };

  // Исходное состояние страницы
  window.map.deactivatePage();
})();
