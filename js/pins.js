// Модуль, создающий DOM-элемент пина объявления
'use strict';

(function () {
  var PINS_COUNT = 5;

  var mapElement = document.querySelector('.map');
  var pinTemplateElement = document.querySelector('template').content.querySelector('.map__pin');
  var pinsElement = mapElement.querySelector('.map__pins');

  // Создает DOM-элемент пина на основе шаблона пина и элемента из массива объявлений
  var createPinElement = function (advertisement, pinIndex) {
    var pinElement = pinTemplateElement.cloneNode(true);
    var pinImageElement = pinElement.querySelector('img');
    pinElement.style.left = (advertisement.location.x - (pinImageElement.width / 2)) + 'px';
    pinElement.style.top = (advertisement.location.y - pinImageElement.height) + 'px';
    pinImageElement.src = advertisement.author.avatar;
    pinImageElement.alt = advertisement.offer.title;
    pinElement.setAttribute('id', pinIndex + 'ad-pin');
    return pinElement;
  };

  // Отрисовывает сгенерированные DOM-элементы пинов в блок .map__pins
  var renderPins = function (advertisements) {
    var fragment = document.createDocumentFragment();
    advertisements.forEach(function (advertisement, i) {
      fragment.appendChild(createPinElement(advertisement, i));
    });
    pinsElement.appendChild(fragment);

    addPinsClickHandlers();
  };

  // Добавляет на все пины, кроме метки-кекса, обработчики, открывающие попап с карточой объявления
  var addPinsClickHandlers = function () {
    var pinElements = [].slice.call(pinsElement.querySelectorAll('.map__pin:not(.map__pin--main'));
    pinElements.forEach(function (pin) {
      pin.addEventListener('click', window.popup.open);
    });
  };

  window.pins = {
    // В этот массив добавляются загруженные с сервера данные объявлений
    adsData: [],

    // Удаляет элементы пинов
    delete: function () {
      var pinElements = [].slice.call(pinsElement.querySelectorAll('.map__pin:not(.map__pin--main'));
      pinElements.forEach(function (pin) {
        pin.parentNode.removeChild(pin);
      });
    },

    // Прячет пины при фильтрации
    hide: function () {
      var pinElements = [].slice.call(pinsElement.querySelectorAll('.map__pin:not(.map__pin--main'));
      pinElements.forEach(function (pin) {
        pin.classList.add('hidden');
      });
    },

    // Отображает пины при фильтрации
    show: function (showedAds, originalAds) {
      var pinElements = [].slice.call(pinsElement.querySelectorAll('.map__pin:not(.map__pin--main'));
      if (showedAds.length > PINS_COUNT) {
        showedAds = showedAds.slice(0, PINS_COUNT);
      }
      showedAds.forEach(function (ad) {
        pinElements.forEach(function (pin) {
          var pinIndex = parseInt(pin.getAttribute('id'), 10);
          if (originalAds.indexOf(ad) === pinIndex) {
            pin.classList.remove('hidden');
          }
        });
      });
    },

    // Сохраняет загруженный с сервера массив объявлений, отображает пины
    createdAdsData: function (uploadedAds) {
      renderPins(uploadedAds);
      window.pins.adsData = uploadedAds;
      window.pins.hide();
      window.pins.show(window.pins.adsData, window.pins.adsData);
    },
  };
})();
