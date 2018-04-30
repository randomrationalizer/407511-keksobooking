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

var mapElement = document.querySelector('.map');
var mapPinsElement = mapElement.querySelector('.map__pins');
var mapCardTemplate = document.querySelector('template').content.querySelector('.map__card');
var pinTemplate = document.querySelector('template').content.querySelector('.map__pin');
var adForm = document.querySelector('.ad-form');
var adFormElements = document.querySelectorAll('.ad-form__element');
var mapPinMain = mapElement.querySelector('.map__pin--main');
var mapPinMainWidth = mapPinMain.offsetWidth;
var mapPinMainHeight = mapPinMain.offsetHeight;
var mapPinMainNeedleHeight = 22;
var mapPinVerticalShift = Math.floor(mapPinMainHeight / 2);
var mapWidth = mapElement.offsetWidth;
var mapPinMainMaxPosX = mapWidth - mapPinMainWidth;
var adFormAddressField = document.getElementById('address');
var adFormTitleInput = document.getElementById('title');
var adFormPriceInput = document.getElementById('price');
var adFormHousingType = document.getElementById('type');
var adFormCheckIn = document.getElementById('timein');
var adFormCheckOut = document.getElementById('timeout');
var adFormRooms = document.getElementById('room_number');
var adFormCapacity = document.getElementById('capacity');

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
  var randomLengthArr = arr.slice(0, randomLength);
  return randomLengthArr;
};

// Функция, перемешивающая элементы массива в произвольном порядке
var shuffle = function (arr) {
  var copiedArr = arr.slice();
  var mixedArr = [];
  while (copiedArr.length > 0) {
    var randomIndex = getRandomNumber(0, copiedArr.length - 1);
    var removedItem = copiedArr[randomIndex];
    copiedArr.splice(randomIndex, 1);
    mixedArr.push(removedItem);
  }
  return mixedArr;
};

// Функция, создающая массив из 8 сгенерированных объектов объявлений
var createAdsArray = function (titles, types, checkinTime, features, photos, count) {
  var adsArray = [];
  var mixedTitles = shuffle(titles);
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
    offer.title = mixedTitles[i];
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
  var mapPinX = parseInt(mapPinMain.style.left, 10) + Math.floor(mapPinMainWidth / 2);
  return mapPinX;
};

// Возвращает координаты метки-кекса по Y
var getMapPinMainY = function (isPageActive) {
  var mapPinMainY = parseInt(mapPinMain.style.top, 10) + mapPinMainHeight + mapPinMainNeedleHeight;
  if (!isPageActive) {
    mapPinMainY -= mapPinVerticalShift + mapPinMainNeedleHeight;
  }
  return mapPinMainY;
};

// Записывает в поле адреса координаты острого конца метки-кекса (активное состояние) или центра (неактивное состояние).
var sendMapPinMainCoordinates = function (isPageActive) {
  adFormAddressField.value = getMapPinMainX() + ' ,' + getMapPinMainY(isPageActive);
};

// Блокирует поле адреса от редактирования
var adFormAddressFieldReadonly = function () {
  adFormAddressField.setAttribute('readonly', '');
};

// Добавляет обработчик валидации для поля заголовка объявления
adFormTitleInput.addEventListener('invalid', function () {
  if (adFormTitleInput.validity.tooShort) {
    adFormTitleInput.setCustomValidity('Длина заголовка должна быть больше 30 символов');
  } else if (adFormTitleInput.validity.tooLong) {
    adFormTitleInput.setCustomValidity('Длина заголовка должна быть меньше 100 символов');
  } else if (adFormTitleInput.validity.valueMissing) {
    adFormTitleInput.setCustomValidity('Обязательно для заполенния');
  } else {
    adFormTitleInput.setCustomValidity('');
  }
});

// Добавляет обработчик валидации min длины поля заголовка для edge
adFormTitleInput.addEventListener('input', function (evt) {
  var target = evt.target;
  if (target.value.length < 30) {
    target.setCustomValidity('Длина заголовка должна быть больше 30 символов');
  } else {
    target.setCustomValidity('');
  }
});

// Устанавливает соответствие между типом жилья и минимальным значением цены за ночь
var adTypePriceMatch = function () {
  if (adFormHousingType.value === 'bungalo') {
    adFormPriceInput.min = 0;
    adFormPriceInput.placeholder = 0;
  } else if (adFormHousingType.value === 'flat') {
    adFormPriceInput.min = 1000;
    adFormPriceInput.placeholder = 1000;
  } else if (adFormHousingType.value === 'house') {
    adFormPriceInput.min = 5000;
    adFormPriceInput.placeholder = 5000;
  } else if (adFormHousingType.value === 'palace') {
    adFormPriceInput.min = 10000;
    adFormPriceInput.placeholder = 10000;
  }
};

adTypePriceMatch();

// Добавляет обработчик на поле выбора типа жилья
adFormHousingType.addEventListener('change', adTypePriceMatch);

// Устанавливает ограничения для поля цены за ночь
var adPriceCheck = function (evt) {
  var target = evt.target;
  if (target.value < 0) {
    target.setCustomValidity('Цена не может быть меньше 0');
  } else if (adFormPriceInput.validity.valueMissing) {
    target.setCustomValidity('Обязательно для заполения');
  } else if (target.value < 1000 && adFormHousingType.value === 'flat') {
    target.setCustomValidity('Цена для квартиры не может быть меньше 1000 за ночь');
  } else if (target.value < 5000 && adFormHousingType.value === 'house') {
    target.setCustomValidity('Цена для дома не может быть меньше 5000 за ночь');
  } else if (target.value < 10000 && adFormHousingType.value === 'palace') {
    target.setCustomValidity('Цена для дворца не может быть меньше 10000 за ночь');
  } else if (adFormPriceInput.validity.rangeOverflow) {
    target.setCustomValidity('Максимальная цена - 1 000 000');
  } else {
    target.setCustomValidity('');
  }
};

// Добавляет обработчик валидации для поля цены за ночь
adFormPriceInput.addEventListener('invalid', adPriceCheck);

// Устанавливает соответствие между значениями полей чекина и чекаута
var adCheckinCheckoutMatch = function (evt) {
  var target = evt.target;
  if (target === adFormCheckIn) {
    adFormCheckOut.value = target.value;
  } else if (target === adFormCheckOut) {
    adFormCheckIn.value = target.value;
  }
};

// Добавляет обработчики на поля чекина и чекаута
adFormCheckIn.addEventListener('input', adCheckinCheckoutMatch);
adFormCheckOut.addEventListener('input', adCheckinCheckoutMatch);

// Задает ограничение числа гостей в зависимости от выбранного количества комнат
var adRoomNumberCapacityMatch = function () {
  var rooms = adFormRooms.value;
  var guests = adFormCapacity.value;

  if (rooms === '100' && guests !== '0') {
    adFormCapacity.setCustomValidity('Выберите вариант "не для гостей"');
  } else if (rooms === '1' && guests > '1') {
    adFormCapacity.setCustomValidity('В 1 комнате можно разместить только 1 гостя');
  } else if (rooms === '2' && guests > '2') {
    adFormCapacity.setCustomValidity('В ' + rooms + ' комнатах можно разместить не более ' + rooms + ' гостей.');
  } else if (rooms !== '100' && guests === '0') {
    adFormCapacity.setCustomValidity('Укажите число гостей, но не более ' + rooms + '.');
  } else {
    adFormCapacity.setCustomValidity('');
  }
};

// Устанавливает соответствие между числом комнат и числом гостей
var adRoomsCapacityMatch = function () {
  if (adFormRooms.value === '100') {
    adFormCapacity.value = '0';
  } else {
    adFormCapacity.value = adFormRooms.value;
  }
};

adRoomsCapacityMatch();

// Добавляет обработчики на поля числа комнат и количества гостей
adFormRooms.addEventListener('change', adRoomNumberCapacityMatch);
adFormCapacity.addEventListener('change', adRoomNumberCapacityMatch);

// Переключает страницу в неактивное состояние
var pageDeactivate = function () {
  mapDeactivate();
  adFormDisable();
  adFormElementsDisable();
  sendMapPinMainCoordinates(false);
};

// Переключает страницу в активное состояние
var pageActivate = function () {
  mapActivate();
  adFormEnable();
  adFormElementsEnable();
  sendMapPinMainCoordinates(true);
  adFormAddressFieldReadonly();
  renderMapPins(adsArray);
  addPinsClickHandlers();
  mapPinMain.removeEventListener('mouseup', pageActivate);
};

// Добавляет на все пины, кроме метки-кекса, обработчики, открывающие попап с карточой обявления
var addPinsClickHandlers = function () {
  var pins = mapPinsElement.querySelectorAll('.map__pin');
  for (var i = 0; i < pins.length; i++) {
    pins[i].addEventListener('click', openAdCard);
  }
  mapPinMain.removeEventListener('click', openAdCard);
};

// Открывает попап с карточкой объявления, добавляет обработчики на закрытие по esc и enter
var openAdCard = function (evt) {
  var adCard = mapElement.querySelector('.map__card');
  if (adCard) {
    adCard.parentNode.removeChild(adCard);
  }
  var clickedPinIndex = parseInt(evt.currentTarget.getAttribute('id'), 10);
  renderAd(adsArray, clickedPinIndex);

  var adCardClose = mapElement.querySelector('.popup__close');
  adCardClose.addEventListener('click', closeAdCard);
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

// Исходное состояние страницы
pageDeactivate();
adFormAddressFieldReadonly();
var adsArray = createAdsArray(ADS_TITLES, ADS_TYPES, CHECKIN_CHECKOUT, FEATURES, PHOTOS, adsCount);

// Добавляет на метку-кекс обработчик события (отпускание элемента), активирующий страницу
mapPinMain.addEventListener('mouseup', pageActivate);

// Механизм перетаскивания главного пина
mapPinMain.addEventListener('mousedown', function (evt) {
  evt.preventDefault();

  var startCoords = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onMainPinMouseMove = function (moveEvt) {
    moveEvt.preventDefault();

    var shift = {
      x: startCoords.x - moveEvt.clientX,
      y: startCoords.y - moveEvt.clientY,
    };

    startCoords = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    mapPinMain.style.top = (mapPinMain.offsetTop - shift.y) + 'px';
    mapPinMain.style.left = (mapPinMain.offsetLeft - shift.x) + 'px';
    checkMainPinPosition();
    sendMapPinMainCoordinates(true);
  };

  var onMainPinMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMainPinMouseMove);
    document.removeEventListener('mouseup', onMainPinMouseUp);
  };

  document.addEventListener('mousemove', onMainPinMouseMove);
  document.addEventListener('mouseup', onMainPinMouseUp);
});

// Ограничивает область перетаскивания главного пина
var checkMainPinPosition = function () {
  var minY = MIN_POS_Y - mapPinMainHeight - mapPinMainNeedleHeight;
  var maxY = MAX_POS_Y - mapPinMainHeight - mapPinMainNeedleHeight;

  if (mapPinMain.offsetTop < minY) {
    mapPinMain.style.top = minY + 'px';
  } else if (mapPinMain.offsetTop > maxY) {
    mapPinMain.style.top = maxY + 'px';
  } else if (mapPinMain.offsetLeft < 0) {
    mapPinMain.style.left = 0 + 'px';
  } else if (mapPinMain.offsetLeft > mapPinMainMaxPosX) {
    mapPinMain.style.left = mapPinMainMaxPosX + 'px';
  }
};
