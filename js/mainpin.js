// Модуль, описывающий механизм работы главного пина
'use strict';

(function () {
  var MAX_POS_Y = 500;
  var MIN_POS_Y = 150;
  var START_POS = {
    left: '570px',
    top: '375px'
  };

  var mapElement = document.querySelector('.map');
  var mapPinMain = mapElement.querySelector('.map__pin--main');
  var adFormAddressField = document.getElementById('address');
  var mapPinMainWidth = mapPinMain.offsetWidth;
  var mapPinMainHeight = mapPinMain.offsetHeight;
  var mapPinMainNeedleHeight = 22;
  var mapPinVerticalShift = Math.floor(mapPinMainHeight / 2);
  var mapWidth = mapElement.offsetWidth;
  var mapPinMainMaxPosX = mapWidth - mapPinMainWidth;

  // Возвращает координаты метки-кекса по X
  var getMapPinMainX = function () {
    var mapPinX = parseInt(mapPinMain.style.left, 10) + Math.floor(mapPinMainWidth / 2);
    return mapPinX;
  };

  // Возвращает координаты метки-кекса по Y
  var getMapPinMainY = function (isPageActive) {
    var mapPinMainY = parseInt(mapPinMain.style.top, 10) + mapPinMainHeight + mapPinMainNeedleHeight;
    if (!isPageActive) {
      mapPinMainY -= mapPinVerticalShift + mapPinMainNeedleHeight;
    }
    return mapPinMainY;
  };

  // Добавляет на метку-кекс обработчик события перетаскивания главного пина
  mapPinMain.addEventListener('mousedown', function (evt) {
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

      mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
      mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
      checkMainPinPosition();
      window.mainpin.sendMapPinMainCoordinates(true);
    };

    var onMainPinMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMainPinMouseMove);
      document.removeEventListener('mouseup', onMainPinMouseUp);
    };

    document.addEventListener('mousemove', onMainPinMouseMove);
    document.addEventListener('mouseup', onMainPinMouseUp);
  });

  // Ограничивает область перетаскивания главного пина
  var checkMainPinPosition = function () {
    var minY = MIN_POS_Y - mapPinMainHeight - mapPinMainNeedleHeight;
    var maxY = MAX_POS_Y - mapPinMainHeight - mapPinMainNeedleHeight;

    if (mapPinMain.offsetTop < minY) {
      mapPinMain.style.top = minY + 'px';
    } else if (mapPinMain.offsetTop > maxY) {
      mapPinMain.style.top = maxY + 'px';
    } else if (mapPinMain.offsetLeft < 0) {
      mapPinMain.style.left = 0 + 'px';
    } else if (mapPinMain.offsetLeft > mapPinMainMaxPosX) {
      mapPinMain.style.left = mapPinMainMaxPosX + 'px';
    }
  };

  window.mainpin = {
    // Записывает в поле адреса координаты острого конца метки-кекса (активное состояние) или центра (неактивное состояние).
    sendMapPinMainCoordinates: function (isPageActive) {
      adFormAddressField.value = getMapPinMainX() + ' ,' + getMapPinMainY(isPageActive);
    },

    // Перемещает главный пин в стартовое положение
    resetPinMain: function () {
      mapPinMain.style.top = START_POS.top;
      mapPinMain.style.left = START_POS.left;
    }
  };
})();
