'use strict';

var ADS_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var ADS_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN_CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var adsCount = 8;

// Функция, возваращающая случайное число в диапазоне от min до max(включительно)
var getRandomNumber = function (min, max) {
  var randomNumber = min + Math.floor(Math.random() * (max + 1 - min));
  return randomNumber;
};

// Функция, возвращающая случайный элемент массива
var pickRandomItem = function (arr) {
  var randomItem = arr[getRandomNumber(0, arr.length - 1)];
  return randomItem;
};

// Функция, возвращающая массив случайной длины
var getRandomLengthArr = function (arr) {
  var randomLength = getRandomNumber(1, arr.length);
  var randomLengthArr = arr.slice(0, randomLength); // не включая end
  return randomLengthArr;
};

// Функция, перемешивающая элементы массива в произвольном порядке
var getMixedArr = function (arr) {
  var mixedArr = [];
  while (mixedArr.length < arr.length) {
    var randomElem = pickRandomItem(arr);
    if (mixedArr.indexOf(randomElem) === -1) {
      mixedArr.push(randomElem);
    }
  }
  return mixedArr;
};

// Функция, создающая массив из 8 сгенерированных объектов объявлений
var createAdsArray = function (titles, types, checkinTime, features, photos, count) {
  var adsArray = [];
  for (var i = 0; i < count; i++) {
    var advertisement = {};

    var author = {};
    author.avatar = 'img/avatars/user0' + (i + 1) + '.png';
    advertisement.author = author;

    var location = {};
    location.x = getRandomNumber(300, 900);
    location.y = getRandomNumber(150, 500);
    advertisement.location = location;
    var offer = {};
    offer.title = getMixedArr(titles)[i];
    offer.address = advertisement.location.x + ', ' + advertisement.location.y;
    offer.price = getRandomNumber(1000, 1000000);
    offer.type = pickRandomItem(types);
    offer.rooms = getRandomNumber(1, 5);
    offer.guests = getRandomNumber(1, 6);
    offer.checkin = pickRandomItem(checkinTime);
    offer.checkout = pickRandomItem(checkinTime);
    offer.features = getRandomLengthArr(features);
    offer.description = '';
    offer.photos = getMixedArr(photos);
    advertisement.offer = offer;

    adsArray[i] = advertisement;
  }
  return adsArray;
};

// Функция, создающая DOM-элемент пина на основе шаблона пина и элемента из массива объявлений
var createPinElement = function (advertisement) {
  var pinElement = pinTemplate.cloneNode(true);
  var pinImage = pinElement.querySelector('img');
  pinElement.style.left = (advertisement.location.x - (pinImage.width / 2)) + 'px';
  pinElement.style.top = (advertisement.location.y - pinImage.height) + 'px';
  pinImage.src = advertisement.author.avatar;
  pinImage.alt = advertisement.offer.title;
  return pinElement;
};

// Функция, отрисовывающая сгенерированные DOM-элементы пинов в блок .map__pins
var renderMapPins = function (arr) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(createPinElement(arr[i]));
  }
  mapPinsElement.appendChild(fragment);
};

// Функция, создающая DOM-элемент объявления на основе шаблона .map__card и элемента из массива объявлений
var createAdElement = function (advertisement) {
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
  for (var m = 0; m < advertisement.offer.photos.length - 1; m++) {
    var adPhotoElement = adPhoto.cloneNode(true);
    adPhotos.appendChild(adPhotoElement);
  }
  for (var n = 0; n < adPhotos.children.length; n++) {
    adPhotos.children[n].src = advertisement.offer.photos[n];
  }

  adElement.querySelector('.popup__avatar').src = advertisement.author.avatar;

  return adElement;
};

// Функция, отрисовывающая сгенерированные DOM-элементы объявлений в блок .map перед .map__filters-container
var renderAds = function (arr) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(createAdElement(arr[0]));
  mapElement.insertBefore(fragment, mapElement.querySelector('map__filters-container'));
};

var mapElement = document.querySelector('.map');
mapElement.classList.remove('map--faded');

var mapPinsElement = mapElement.querySelector('.map__pins');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');

var adsArray = createAdsArray(ADS_TITLES, ADS_TYPES, CHECKIN_CHECKOUT, FEATURES, PHOTOS, adsCount);
renderMapPins(adsArray);
renderAds(adsArray);
