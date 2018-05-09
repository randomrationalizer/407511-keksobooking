// Модуль, создающий DOM-элемент карточки объявления
'use strict';

(function () {
  var cardTemplateElement = document.querySelector('template').content.querySelector('.map__card');

  var adTypeToValue = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  var featureToClassName = {
    'wifi': '.popup__feature--wifi',
    'dishwasher': '.popup__feature--dishwasher',
    'parking': '.popup__feature--parking',
    'washer': '.popup__feature--washer',
    'elevator': '.popup__feature--elevator',
    'conditioner': '.popup__feature--conditioner'
  };

  window.card = {
    // Создает DOM-элемент объявления на основе шаблона .map__card и элемента из массива объявлений
    create: function (advertisement) {
      var adElement = cardTemplateElement.cloneNode(true);
      adElement.querySelector('.popup__title').textContent = advertisement.offer.title;
      adElement.querySelector('.popup__text--address').textContent = advertisement.offer.address;
      adElement.querySelector('.popup__text--price').textContent = advertisement.offer.price + '₽/ночь';
      adElement.querySelector('.popup__type').textContent = adTypeToValue[advertisement.offer.type];
      adElement.querySelector('.popup__text--capacity').textContent = advertisement.offer.rooms + ' комнаты для ' + advertisement.offer.guests + ' гостей';
      adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisement.offer.checkin + ' , выезд до ' + advertisement.offer.checkout;

      var featuresBlockElement = adElement.querySelector('.popup__features');
      var featureElements = featuresBlockElement.querySelectorAll('.popup__feature');

      advertisement.offer.features.forEach(function (offerFeature) {
        featuresBlockElement.querySelector(featureToClassName[offerFeature]).textContent = offerFeature;
      });
      featureElements.forEach(function (element) {
        if (element.textContent === '') {
          featuresBlockElement.removeChild(element);
        }
      });

      adElement.querySelector('.popup__description').textContent = advertisement.offer.description;

      var adPhotosBlockElement = adElement.querySelector('.popup__photos');
      var adPhotoElement = adPhotosBlockElement.querySelector('img');
      if (advertisement.offer.photos.length !== 0) {
        adPhotosBlockElement.innerHTML = '';
        advertisement.offer.photos.forEach(function (photo) {
          var cardPhotoElement = adPhotoElement.cloneNode(true);
          cardPhotoElement.src = photo;
          adPhotosBlockElement.appendChild(cardPhotoElement);
        });
      } else {
        adPhotosBlockElement.parentNode.removeChild(adPhotosBlockElement);
      }

      adElement.querySelector('.popup__avatar').src = advertisement.author.avatar;

      return adElement;
    }
  };
})();
