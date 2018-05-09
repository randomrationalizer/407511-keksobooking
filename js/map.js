// Модуль отрисовывает пины и карточку объявления, устанавливает взаимодействие карточки и пина на карте
'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var mainPinElement = mapElement.querySelector('.map__pin--main');

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
    window.form.activate();
    window.mainpin.sendCoordinates(true);
    window.backend.load(window.pins.createdAdsData, window.util.showErrorMessage);
    mainPinElement.removeEventListener('mouseup', activatePage);
  };

  // Добавляет на метку-кекс обработчик события (отпускание элемента), активирующий страницу
  mainPinElement.addEventListener('mouseup', activatePage);

  window.map = {
    // Переключает страницу в неактивное состояние
    deactivatePage: function () {
      deactivateMap();
      window.form.deactivate();
      window.mainpin.reset();
      window.form.reset();
      window.pins.delete();
      window.popup.close();
      window.mainpin.sendCoordinates(false);
      mainPinElement.addEventListener('mouseup', activatePage);
    }
  };

  // Исходное состояние страницы
  window.map.deactivatePage();
})();
