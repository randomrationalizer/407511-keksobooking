// Модуль, описывающий поведение попапа карточки объявления
'use strict';

(function () {
  var mapElement = document.querySelector('.map');

  // Отрисовывает сгенерированный DOM-элемент карточки объявления в блок .map перед .map__filters-container
  var renderCard = function (cards, cardIndex) {
    var fragment = document.createDocumentFragment();
    fragment.appendChild(window.card.create(cards[cardIndex]));
    mapElement.insertBefore(fragment, mapElement.querySelector('.map__filters-container'));
  };

  // Закрывает попап по нажатию esc
  var onAdCardEscPress = function (evt) {
    window.util.isEscEvent(evt, window.popup.close);
  };

  window.popup = {
    // Открывает попап с карточкой объявления, добавляет обработчики на закрытие по esc и enter
    open: function (evt) {
      var cardElement = mapElement.querySelector('.map__card');
      if (cardElement) {
        cardElement.parentNode.removeChild(cardElement);
      }
      var clickedPinIndex = parseInt(evt.currentTarget.getAttribute('id'), 10);
      renderCard(window.pins.adsData, clickedPinIndex);

      var cardCloseElement = mapElement.querySelector('.popup__close');
      cardCloseElement.addEventListener('click', window.popup.close);
      document.addEventListener('keydown', onAdCardEscPress);
    },

    // Закрывает попап с карточкой объявления, удаляет обработчик на закрытие попапа по esc
    close: function () {
      var cardElement = mapElement.querySelector('.map__card');
      if (cardElement) {
        cardElement.parentNode.removeChild(cardElement);
        document.removeEventListener('keydown', onAdCardEscPress);
      }
    }
  };
})();
