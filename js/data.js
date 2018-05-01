// Модуль, который генерирует массив объявлений

'use strict';
(function () {
  var ADS_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
  var ADS_TYPES = ['palace', 'flat', 'house', 'bungalo'];
  var CHECKIN_CHECKOUT = ['12:00', '13:00', '14:00'];
  var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
  var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
  var adsCount = 8;

  // Создает массив из 8 сгенерированных объектов объявлений
  var createAdsArray = function (titles, types, checkinTime, features, photos, count) {
    var adsArray = [];
    var mixedTitles = window.util.shuffle(titles);
    for (var i = 0; i < count; i++) {
      var advertisement = {};

      var author = {};
      author.avatar = 'img/avatars/user0' + (i + 1) + '.png';
      advertisement.author = author;

      var location = {};
      location.x = window.util.getRandomNumber(300, 900);
      location.y = window.util.getRandomNumber(150, 500);
      advertisement.location = location;
      var offer = {};
      offer.title = mixedTitles[i];
      offer.address = advertisement.location.x + ', ' + advertisement.location.y;
      offer.price = window.util.getRandomNumber(1000, 1000000);
      offer.type = window.util.pickRandomItem(types);
      offer.rooms = window.util.getRandomNumber(1, 5);
      offer.guests = window.util.getRandomNumber(1, 6);
      offer.checkin = window.util.pickRandomItem(checkinTime);
      offer.checkout = window.util.pickRandomItem(checkinTime);
      offer.features = window.util.getRandomLengthArr(features);
      offer.description = '';
      offer.photos = window.util.shuffle(photos);
      advertisement.offer = offer;

      adsArray[i] = advertisement;
    }
    return adsArray;
  };

  // Экспорт массива сгенерированных объявлений
  window.data = {
    adsArray: createAdsArray(ADS_TITLES, ADS_TYPES, CHECKIN_CHECKOUT, FEATURES, PHOTOS, adsCount)
  };
})();
