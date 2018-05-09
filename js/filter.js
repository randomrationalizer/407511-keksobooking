// Модуль фильтрации похожих объявлений
'use strict';

(function () {
  var mapFiltersElement = document.querySelector('.map__filters');
  var filterTypeElement = mapFiltersElement.querySelector('#housing-type');
  var filterPriceElement = mapFiltersElement.querySelector('#housing-price');
  var filterRoomsElement = mapFiltersElement.querySelector('#housing-rooms');
  var filterGuestsElement = mapFiltersElement.querySelector('#housing-guests');
  var filterFeaturesElement = mapFiltersElement.querySelector('#housing-features');
  var filterFeatureElements = filterFeaturesElement.querySelectorAll('.map__checkbox');
  var filterSelectElements = mapFiltersElement.querySelectorAll('select');

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

  resetFilters(filterSelectElements);
  resetFilters(filterFeatureElements);

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

    window.popup.close();
    window.pins.hide();
    window.pins.show(filteredAds, ads);
  };

  // Выбранное значение фильтра цены
  var selectedPrice = defaulFilterValues[filterPriceElement.id];

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
  filterPriceElement.addEventListener('change', onPriceChange);

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
  var checkOfferFeatures = function (adFeatures, filterFeatures) {
    var result;
    if (filterFeatures.length === 0) {
      result = true;
    } else {
      result = filterFeatures.every(function (feature) {
        return adFeatures.includes(feature);
      });
    }
    return result;
  };

  // Добавляет обработчики события на все чекбоксы фильтра
  var addFilterCheckboxHandlers = function () {
    filterFeatureElements.forEach(function (checkbox) {
      checkbox.addEventListener('change', onCheckboxChange);
    });
  };

  addFilterCheckboxHandlers();

  // Условие фильтрации объявлений по значением select фильтров
  var checkOfferValue = function (property, selectedField) {
    return selectedField === 'any' || selectedField === property;
  };

  // Выбранное значение фильтра типа жилья
  var selectedType = defaulFilterValues[filterTypeElement.id];

  // Записывает значение выбранного типа жилья в переменную selectedType и обновляет пины
  var onTypeChange = window.util.debounce(function (evt) {
    var target = evt.target;
    selectedType = target.value;
    updatePins();
  });

  // Добавляет обработчик события на поле типа жилья
  filterTypeElement.addEventListener('change', onTypeChange);

  // Выбранное значение фильтра количества комнат
  var selectedRooms = defaulFilterValues[filterRoomsElement.id];

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
  filterRoomsElement.addEventListener('change', onRoomsChange);

  // Выбранное значение фильтра числа гостей
  var selectedGuests = defaulFilterValues[filterGuestsElement.id];

  // Записывает значение выбранного числа гостей в переменную selectedRooms и обновляет пины
  var onGuestsChange = window.util.debounce(function (evt) {
    var target = evt.target;
    if (target.value !== 'any') {
      selectedGuests = parseInt(target.value, 10);
    } else {
      selectedGuests = target.value;
    }
    updatePins();
  });

  // Добавляет обработчик события на поле количества гостей
  filterGuestsElement.addEventListener('change', onGuestsChange);
})();
