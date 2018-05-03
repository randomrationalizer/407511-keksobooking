// Модуль, создающий DOM-элемент пина объявления
'use strict';

(function () {
  var mapElement = document.querySelector('.map');
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
  var mapPinsElement = mapElement.querySelector('.map__pins');
  var mapPinMain = mapElement.querySelector('.map__pin--main');

  // Создает DOM-элемент пина на основе шаблона пина и элемента из массива объявлений
  var createPinElement = function (advertisement, pinIndex) {
    var pinElement = pinTemplate.cloneNode(true);
    var pinImage = pinElement.querySelector('img');
    pinElement.style.left = (advertisement.location.x - (pinImage.width / 2)) + 'px';
    pinElement.style.top = (advertisement.location.y - pinImage.height) + 'px';
    pinImage.src = advertisement.author.avatar;
    pinImage.alt = advertisement.offer.title;
    pinElement.setAttribute('id', pinIndex + 'ad-pin');
    return pinElement;
  };

  // Добавляет на все пины, кроме метки-кекса, обработчики, открывающие попап с карточой объявления
  var addPinsClickHandlers = function () {
    var pins = mapPinsElement.querySelectorAll('.map__pin');
    for (var i = 0; i < pins.length; i++) {
      pins[i].addEventListener('click', window.popup.openAdCard);
    }
    mapPinMain.removeEventListener('click', window.popup.openAdCard);
  };

  window.pins = {
    // В этот массив добавляются загруженные с сервера данные объявлений
    adsData: [],

    // Отрисовывает сгенерированные DOM-элементы пинов в блок .map__pins
    renderMapPins: function (data) {
      window.pins.adsData = data;
      var fragment = document.createDocumentFragment();
      for (var i = 0; i < data.length; i++) {
        fragment.appendChild(createPinElement(data[i], i));
      }
      mapPinsElement.appendChild(fragment);

      addPinsClickHandlers();
    },

    // Удаляет элементы пинов
    deletePins: function () {
      var pins = mapPinsElement.querySelectorAll('.map__pin');
      pins.forEach(function (item) {
        if (item.id) {
          item.parentNode.removeChild(item);
        }
      });
    }
  };
})();
