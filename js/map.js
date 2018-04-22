'use strict';

var ADS_TITLES = ['Большая уютная квартира', 'Маленькая неуютная квартира', 'Огромный прекрасный дворец', 'Маленький ужасный дворец', 'Красивый гостевой домик', 'Некрасивый негостеприимный домик', 'Уютное бунгало далеко от моря', 'Неуютное бунгало по колено в воде'];
var ADS_TYPES = ['palace', 'flat', 'house', 'bungalo'];
var CHECKIN_CHECKOUT = ['12:00', '13:00', '14:00'];
var FEATURES = ['wifi', 'dishwasher', 'parking', 'washer', 'elevator', 'conditioner'];
var PHOTOS = ['http://o0.github.io/assets/images/tokyo/hotel1.jpg', 'http://o0.github.io/assets/images/tokyo/hotel2.jpg', 'http://o0.github.io/assets/images/tokyo/hotel3.jpg'];
var adsCount = 8;
var MAX_POS_Y = 500;
var MIN_POS_Y = 150;
var ESC_KEYCODE = 27;
var ENTER_KEYCODE = 13;

var mapElement = document.querySelector('.map');
var mapPinsElement = mapElement.querySelector('.map__pins');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var adForm = document.querySelector('.ad-form');
var adFormElements = document.querySelectorAll('.ad-form__element');
var mapPinMain = mapElement.querySelector('.map__pin--main');
var mapPinMainImg = mapPinMain.querySelector('img');
var mapPinVerticalShift = parseInt((mapPinMainImg.height / 2), 10);
var adFormAddressField = document.getElementById('address');

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
var shuffle = function (arr) {
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
    offer.title = shuffle(titles)[i];
    offer.address = advertisement.location.x + ', ' + advertisement.location.y;
    offer.price = getRandomNumber(1000, 1000000);
    offer.type = pickRandomItem(types);
    offer.rooms = getRandomNumber(1, 5);
    offer.guests = getRandomNumber(1, 6);
    offer.checkin = pickRandomItem(checkinTime);
    offer.checkout = pickRandomItem(checkinTime);
    offer.features = getRandomLengthArr(features);
    offer.description = '';
    offer.photos = shuffle(photos);
    advertisement.offer = offer;

    adsArray[i] = advertisement;
  }
  return adsArray;
};

// Функция, создающая DOM-элемент пина на основе шаблона пина и элемента из массива объявлений
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

// Функция, отрисовывающая сгенерированные DOM-элементы пинов в блок .map__pins
var renderMapPins = function (arr) {
  var fragment = document.createDocumentFragment();
  for (var i = 0; i < arr.length; i++) {
    fragment.appendChild(createPinElement(arr[i], i));
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

// Функция, отрисовывающая сгенерированный DOM-элемент карточки объявления в блок .map перед .map__filters-container
var renderAd = function (arr, adIndex) {
  var fragment = document.createDocumentFragment();
  fragment.appendChild(createAdElement(arr[adIndex]));
  mapElement.insertBefore(fragment, mapElement.querySelector('.map__filters-container'));
};

// Активирует карту
var mapActivate = function () {
  mapElement.classList.remove('map--faded');
};

// Переключает карту в неактивное состояние
var mapDeactivate = function () {
  mapElement.classList.add('map--faded');
};

// Убирает у элемента формы класс .ad-form--disabled
var adFormEnable = function () {
  adForm.classList.remove('ad-form--disabled');
};

// Добавляет элементу формы класс .ad-form--disabled
var adFormDisable = function () {
  adForm.classList.add('ad-form--disabled');
};

// Блокирует поля формы от редактирования
var adFormElementsDisable = function () {
  for (var i = 0; i < adFormElements.length; i++) {
    adFormElements[i].disabled = true;
  }
};

// Делает поля формы доступными для редактирования
var adFormElementsEnable = function () {
  for (var i = 0; i < adFormElements.length; i++) {
    adFormElements[i].disabled = false;
  }
};

// Возвращает координаты метки-кекса по X
var getMapPinMainX = function () {
  var mapPinX = parseInt(mapPinMain.style.left, 10) + parseInt((mapPinMainImg.width / 2), 10);
  if (mapPinX >= mapElement.width) {
    mapPinX = mapElement.width;
  }
  return mapPinX;
};

// Возвращает координаты метки-кекса по Y
var getMapPinMainY = function () {
  var mapPinMainY = parseInt(mapPinMain.style.top, 10) + parseInt(mapPinMainImg.height, 10);
  if (mapPinMainY > MAX_POS_Y) {
    mapPinMainY = MAX_POS_Y;
  } else if (mapPinMainY < MIN_POS_Y) {
    mapPinMainY = MIN_POS_Y;
  }
  return mapPinMainY;
};

// Записывает в поле адреса координаты острого конца метки-кекса (активное состояние) или центра (неактивное состояние).
var sendMapPinMainCoordinates = function (shift) {
  adFormAddressField.value = getMapPinMainX() + ' ,' + (getMapPinMainY() - shift);
};

// Блокирует поле адреса от редактирования
var adFormAddressFieldDisable = function () {
  adFormAddressField.disabled = true;
};

// Переключает страницу в неактивное состояние
var pageDeactivate = function () {
  mapDeactivate();
  adFormDisable();
  adFormElementsDisable();
  sendMapPinMainCoordinates(mapPinVerticalShift);
};

// Переключает страницу в активное состояние
var pageActivate = function () {
  mapActivate();
  adFormEnable();
  adFormElementsEnable();
  sendMapPinMainCoordinates(0);
  adFormAddressFieldDisable();
  renderMapPins(adsArray);
  addPinsClickHandlers();
  mapPinMain.removeEventListener('mouseup', pageActivate);
};

// Добавляет на все пины, кроме метки-кекса, обработчики, открывающие попап с карточой обявления
var addPinsClickHandlers = function () {
  for (var j = 0; j < mapPinsElement.children.length; j++) {
    mapPinsElement.children[j].addEventListener('click', openAdCard);
  }
  mapPinMain.removeEventListener('click', openAdCard);
};

// Открывает попап с карточкой объявления, добавляет обработчики на закрытие по esc и enter
var openAdCard = function (evt) {
  var adCard = mapElement.querySelector('.map__card');
  if (adCard) {
    adCard.parentNode.removeChild(adCard);
  }
  var clickedPinIndex = parseInt(evt.target.getAttribute('id'), 10);
  renderAd(adsArray, clickedPinIndex);

  var adCardClose = mapElement.querySelector('.popup__close');
  adCardClose.addEventListener('click', closeAdCard);
  adCardClose.addEventListener('keydown', onAdCardCloseEnterPress);
  document.addEventListener('keydown', onAdCardEscPress);
};

// Закрывает попап с карточкой объявления, удаляет обработчик на закрытие попапа по esc
var closeAdCard = function () {
  var adCard = mapElement.querySelector('.map__card');
  adCard.parentNode.removeChild(adCard);
  document.removeEventListener('keydown', onAdCardEscPress);
};

// Закрывает попап по нажатию esc
var onAdCardEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeAdCard();
  }
};

// Закрывает попап при нажатии enter на кнопке закрытия
var onAdCardCloseEnterPress = function (evt) {
  if (evt.keyCode === ENTER_KEYCODE) {
    closeAdCard();
  }
};

// Исходное состояние страницы
pageDeactivate();
var adsArray = createAdsArray(ADS_TITLES, ADS_TYPES, CHECKIN_CHECKOUT, FEATURES, PHOTOS, adsCount);

// Добавляет на метку-кекс обработчик события (отпускание элемента), активирующий страницу
mapPinMain.addEventListener('mouseup', pageActivate);
