// Модуль, описывающий поведение попапа карточки объявления

'use strict';
(function () {
  var mapElement = document.querySelector('.map');

  // Отрисовывает сгенерированный DOM-элемент карточки объявления в блок .map перед .map__filters-container
  var renderAd = function (arr, adIndex) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(window.card.createAdElement(arr[adIndex]));
    mapElement.insertBefore(fragment, mapElement.querySelector('.map__filters-container'));
  };

  // Закрывает попап с карточкой объявления, удаляет обработчик на закрытие попапа по esc
  var closeAdCard = function () {
    var adCard = mapElement.querySelector('.map__card');
    adCard.parentNode.removeChild(adCard);
    document.removeEventListener('keydown', onAdCardEscPress);
  };

  // Закрывает попап по нажатию esc
  var onAdCardEscPress = function (evt) {
    window.util.isEscEvent(evt, closeAdCard);
  };

  window.popup = {
    // Открывает попап с карточкой объявления, добавляет обработчики на закрытие по esc и enter
    openAdCard: function (evt) {
      var adCard = mapElement.querySelector('.map__card');
      if (adCard) {
        adCard.parentNode.removeChild(adCard);
      }
      var clickedPinIndex = parseInt(evt.currentTarget.getAttribute('id'), 10);
      renderAd(window.data.adsArray, clickedPinIndex);

      var adCardClose = mapElement.querySelector('.popup__close');
      adCardClose.addEventListener('click', closeAdCard);
      document.addEventListener('keydown', onAdCardEscPress);
    }
  };
})();
