// Модуль фильтрации похожих объявлений
'use strict';

(function () {
  var mapFilter = document.querySelector('.map__filters');
  var filterTypeElem = mapFilter.querySelector('#housing-type');
  var filterPriceElem = mapFilter.querySelector('#housing-price');
  var filterRoomsElem = mapFilter.querySelector('#housing-rooms');
  var filterGuestsElem = mapFilter.querySelector('#housing-guests');
  var filterFeaturesElem = mapFilter.querySelector('#housing-features');
  var filterFeatures = filterFeaturesElem.querySelectorAll('.map__checkbox');
  var filterSelects = mapFilter.querySelectorAll('select');

  var defaulFilterValues = {
    'housing-type': 'any',
    'housing-price': 'any',
    'housing-rooms': 'any',
    'housing-guests': 'any',
    'filter-wifi': false,
    'filter-dishwasher': false,
    'filter-parking': false,
    'filter-washer': false,
    'filter-elevator': false,
    'filter-conditioner': false
  };

  // Сбрасывает фильтры на значения по умолчанию
  var resetFilters = function (fileds) {
    fileds.forEach(function (field) {
      if (field.type === 'checkbox') {
        field.checked = defaulFilterValues[field.id];
      } else {
        field.value = defaulFilterValues[field.id];
      }
    });
  };

  resetFilters(filterSelects);
  resetFilters(filterFeatures);

  // Обновляет отображенные на карте пины в зависимости от выбранных условий фильтров
  var updatePins = function () {
    var ads = window.pins.adsData.slice();

    var filteredAds = ads.filter(function (it) {
      return checkOfferPrice(it.offer.price, selectedPrice) &&
        checkOfferFeatures(it.offer.features, selectedFeatures) &&
        checkOfferValue(it.offer.type, selectedType) &&
        checkOfferValue(it.offer.rooms, selectedRooms) &&
        checkOfferValue(it.offer.guests, selectedGuests);
    });

    window.popup.closeAdCard();
    window.pins.hidePins();
    window.pins.showPins(filteredAds, ads);
  };

  // Выбранное значение фильтра цены
  var selectedPrice = defaulFilterValues[filterPriceElem.id];

  // Записывает значение выбранной цены в переменную selectedPrice и обновляет пины
  var onPriceChange = window.util.debounce(function (evt) {
    var target = evt.target;
    selectedPrice = target.value;
    updatePins();
  });

  // Условие фильтрации объявлений по цене
  var checkOfferPrice = function (price, fieldValue) {
    var result;
    switch (fieldValue) {
      case 'low':
      {
        result = price < 10000;
        break;
      }
      case 'middle':
      {
        result = price >= 10000 && price <= 50000;
        break;
      }
      case 'high':
      {
        result = price > 50000;
        break;
      }
      case 'any':
      {
        result = true;
        break;
      }
    }
    return result;
  };

  // Добавляет обработчик события на фильтр цены
  filterPriceElem.addEventListener('change', onPriceChange);

  // Массив выбранных в фильтре фич
  var selectedFeatures = [];

  // Записывает значения выбранных фич в массив и обновляет пины
  var onCheckboxChange = window.util.debounce(function (evt) {
    var target = evt.target;
    if (target.checked === true) {
      selectedFeatures.push(target.value);
      updatePins();
    } else {
      var featureIndex = selectedFeatures.indexOf(target.value);
      selectedFeatures.splice(featureIndex, 1);
      updatePins();
    }
  });

  // Условие фильтрации объявлений по фичам
  var checkOfferFeatures = function (arr, featuresArr) {
    var result;
    if (featuresArr.length === 0) {
      result = true;
    } else {
      result = true;
      featuresArr.forEach(function (item) {
        var featureIndex = arr.indexOf(item);
        if (featureIndex < 0) {
          result = false;
        }
      });
    }
    return result;
  };

  // Добавляет обработчики события на все чекбоксы фильтра
  var addFilterCheckboxHandlers = function () {
    filterFeatures.forEach(function (checkbox) {
      checkbox.addEventListener('change', onCheckboxChange);
    });
  };

  addFilterCheckboxHandlers();

  // Условие фильтрации объявлений по значением select фильтров
  var checkOfferValue = function (property, selectedField) {
    return selectedField === 'any' || selectedField === property;
  };

  // Выбранное значение фильтра типа жилья
  var selectedType = defaulFilterValues[filterTypeElem.id];

  // Записывает значение выбранного типа жилья в переменную selectedType и обновляет пины
  var onTypeChange = window.util.debounce(function (evt) {
    var target = evt.target;
    selectedType = target.value;
    updatePins();
  });

  // Добавляет обработчик события на поле типа жилья
  filterTypeElem.addEventListener('change', onTypeChange);

  // Выбранное значение фильтра количества комнат
  var selectedRooms = defaulFilterValues[filterRoomsElem.id];

  // Записывает значение выбранного количества комнат в переменную selectedRooms и обновляет пины
  var onRoomsChange = window.util.debounce(function (evt) {
    var target = evt.target;
    if (target.value !== 'any') {
      selectedRooms = parseInt(target.value, 10);
    } else {
      selectedRooms = target.value;
    }
    updatePins();
  });

  // Добавляет обработчик события на поле числа комнат
  filterRoomsElem.addEventListener('change', onRoomsChange);

  // Выбранное значение фильтра числа гостей
  var selectedGuests = defaulFilterValues[filterGuestsElem.id];

  // Записывает значение выбранного числа гостей в переменную selectedRooms и обновляет пины
  var onGuestsChange = window.util.debounce(function (evt) {
    var target = evt.target;
    if (typeof target.value !== 'number' && target.value !== 'any') {
      selectedGuests = parseInt(target.value, 10);
    } else {
      selectedGuests = target.value;
    }
    updatePins();
  });

  // Добавляет обработчик события на поле количества гостей
  filterGuestsElem.addEventListener('change', onGuestsChange);
})();
