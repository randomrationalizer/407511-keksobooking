// Модуль, создающий DOM-элемент карточки объявления
'use strict';

(function () {
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

  var adTypeToValue = {
    'flat': 'Квартира',
    'bungalo': 'Бунгало',
    'house': 'Дом',
    'palace': 'Дворец'
  };

  window.card = {
    // Создает DOM-элемент объявления на основе шаблона .map__card и элемента из массива объявлений
    createAdElement: function (advertisement) {
      var adElement = mapCardTemplate.cloneNode(true);
      adElement.querySelector('.popup__title').textContent = advertisement.offer.title;
      adElement.querySelector('.popup__text--address').textContent = advertisement.offer.address;
      adElement.querySelector('.popup__text--price').textContent = advertisement.offer.price + '₽/ночь';
      adElement.querySelector('.popup__type').textContent = adTypeToValue[advertisement.offer.type];
      adElement.querySelector('.popup__text--capacity').textContent = advertisement.offer.rooms + ' комнаты для ' + advertisement.offer.guests + ' гостей';
      adElement.querySelector('.popup__text--time').textContent = 'Заезд после ' + advertisement.offer.checkin + ' , выезд до ' + advertisement.offer.checkout;

      var featuresBlock = adElement.querySelector('.popup__features');
      var featureElements = featuresBlock.children;
      for (var i = 0; i < advertisement.offer.features.length; i++) {
        featureElements[i].textContent = advertisement.offer.features[i];
      }
      for (var j = 0; j < featureElements.length; j++) {
        if (!featureElements[j].classList.contains('popup__feature--' + advertisement.offer.features[j])) {
          featuresBlock.removeChild(featureElements[j]);
        }
      }

      adElement.querySelector('.popup__description').textContent = advertisement.offer.description;

      var adPhotos = adElement.querySelector('.popup__photos');
      var adPhoto = adPhotos.querySelector('img');
      if (advertisement.offer.photos.length !== 0) {
        adPhotos.innerHTML = '';
        for (var m = 0; m < advertisement.offer.photos.length; m++) {
          var adPhotoElement = adPhoto.cloneNode(true);
          adPhotoElement.src = advertisement.offer.photos[m];
          adPhotos.appendChild(adPhotoElement);
        }
      } else {
        adPhotos.parentNode.removeChild(adPhotos);
      }

      adElement.querySelector('.popup__avatar').src = advertisement.author.avatar;

      return adElement;
    }
  };
})();
