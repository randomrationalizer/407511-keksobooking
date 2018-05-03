// Модуль, создающий DOM-элемент карточки объявления
'use strict';

(function () {
  var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');

  window.card = {
    // Создает DOM-элемент объявления на основе шаблона .map__card и элемента из массива объявлений
    createAdElement: function (advertisement) {
      var adElement = mapCardTemplate.cloneNode(true);
      adElement.querySelector('.popup__title').textContent = advertisement.offer.title;
      adElement.querySelector('.popup__text--address').textContent = advertisement.offer.address;
      adElement.querySelector('.popup__text--price').textContent = advertisement.offer.price + '₽/ночь';

      var adType = '';
      if (advertisement.offer.type === 'flat') {
        adType = 'Квартира';
      } else if (advertisement.offer.type === 'bungalo') {
        adType = 'Бунгало';
      } else if (advertisement.offer.type === 'house') {
        adType = 'Дом';
      } else {
        adType = 'Дворец';
      }
      adElement.querySelector('.popup__type').textContent = adType;

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
        for (var m = 0; m < advertisement.offer.photos.length - 1; m++) {
          var adPhotoElement = adPhoto.cloneNode(true);
          adPhotos.appendChild(adPhotoElement);
        }
      } else {
        adPhotos.parentNode.removeChild(adPhotos);
      }
      for (var n = 0; n < adPhotos.children.length; n++) {
        adPhotos.children[n].src = advertisement.offer.photos[n];
      }

      adElement.querySelector('.popup__avatar').src = advertisement.author.avatar;

      return adElement;
    }
  };
})();
