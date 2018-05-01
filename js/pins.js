// Модуль, создающий DOM-элемент пина объявления

'use strict';

(function () {
  var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

  window.pins = {
    // Создает DOM-элемент пина на основе шаблона пина и элемента из массива объявлений
    createPinElement: function (advertisement, pinIndex) {
      var pinElement = pinTemplate.cloneNode(true);
      var pinImage = pinElement.querySelector('img');
      pinElement.style.left = (advertisement.location.x - (pinImage.width / 2)) + 'px';
      pinElement.style.top = (advertisement.location.y - pinImage.height) + 'px';
      pinImage.src = advertisement.author.avatar;
      pinImage.alt = advertisement.offer.title;
      pinElement.setAttribute('id', pinIndex + 'ad-pin');
      return pinElement;
    }
  };
})();
