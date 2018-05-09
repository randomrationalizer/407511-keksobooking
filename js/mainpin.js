// Модуль, описывающий механизм работы главного пина
'use strict';

(function () {
  var MAX_POS_Y = 500;
  var MIN_POS_Y = 150;
  var MAIN_PIN_NEEDLE_HEIGHT = 22;
  var START_POS = {
    left: '570px',
    top: '375px'
  };

  var mapElement = document.querySelector('.map');
  var mainPinElement = mapElement.querySelector('.map__pin--main');
  var adFormElement = document.querySelector('.ad-form');
  var adFormAddressElement = adFormElement.querySelector('#address');
  var mainPinWidth = mainPinElement.offsetWidth;
  var mainPinHeight = mainPinElement.offsetHeight;

  var mainPinVerticalShift = Math.floor(mainPinHeight / 2);
  var mapWidth = mapElement.offsetWidth;
  var mainPinMaxPosX = mapWidth - mainPinWidth;

  // Возвращает координаты метки-кекса по X
  var getMainPinX = function () {
    var mainPinX = parseInt(mainPinElement.style.left, 10) + Math.floor(mainPinWidth / 2);
    return mainPinX;
  };

  // Возвращает координаты метки-кекса по Y
  var getMainPinY = function (isPageActive) {
    var mainPinY = parseInt(mainPinElement.style.top, 10) + mainPinHeight + MAIN_PIN_NEEDLE_HEIGHT;
    if (!isPageActive) {
      mainPinY -= mainPinVerticalShift + MAIN_PIN_NEEDLE_HEIGHT;
    }
    return mainPinY;
  };

  // Добавляет на метку-кекс обработчик события перетаскивания главного пина
  mainPinElement.addEventListener('mousedown', function (evt) {
    evt.preventDefault();

    var startCoords = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onMainPinMouseMove = function (moveEvt) {
      moveEvt.preventDefault();

      var shift = {
        x: startCoords.x - moveEvt.clientX,
        y: startCoords.y - moveEvt.clientY,
      };

      startCoords = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      mainPinElement.style.top = (mainPinElement.offsetTop - shift.y) + 'px';
      mainPinElement.style.left = (mainPinElement.offsetLeft - shift.x) + 'px';
      checkMainPinPosition();
      window.mainpin.sendCoordinates(true);
    };

    var onMainPinMouseUp = function (upEvt) {
      upEvt.preventDefault();
      mainPinElement.blur();
      document.removeEventListener('mousemove', onMainPinMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseUp);
    };

    mainPinElement.focus();
    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  });

  // Ограничивает область перетаскивания главного пина
  var checkMainPinPosition = function () {
    var minY = MIN_POS_Y - mainPinHeight - MAIN_PIN_NEEDLE_HEIGHT;
    var maxY = MAX_POS_Y - mainPinHeight - MAIN_PIN_NEEDLE_HEIGHT;

    if (mainPinElement.offsetTop < minY) {
      mainPinElement.style.top = minY + 'px';
    } else if (mainPinElement.offsetTop > maxY) {
      mainPinElement.style.top = maxY + 'px';
    } else if (mainPinElement.offsetLeft < 0) {
      mainPinElement.style.left = 0 + 'px';
    } else if (mainPinElement.offsetLeft > mainPinMaxPosX) {
      mainPinElement.style.left = mainPinMaxPosX + 'px';
    }
  };

  window.mainpin = {
    // Записывает в поле адреса координаты острого конца метки-кекса (активное состояние) или центра (неактивное состояние).
    sendCoordinates: function (isPageActive) {
      adFormAddressElement.value = getMainPinX() + ' ,' + getMainPinY(isPageActive);
    },

    // Перемещает главный пин в стартовое положение
    reset: function () {
      mainPinElement.style.top = START_POS.top;
      mainPinElement.style.left = START_POS.left;
    }
  };
})();
