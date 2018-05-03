// Модуль, содержащий переменные и функции для общего использования

'use strict';
(function () {
  var ESC_KEYCODE = 27;

  window.util = {
    // Обработчик события по нажатию esc
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },

    // Возвращает случайное число в диапазоне от min до max(включительно)
    getRandomNumber: function (min, max) {
      var randomNumber = min + Math.floor(Math.random() * (max + 1 - min));
      return randomNumber;
    },

    // Возвращает случайный элемент массива
    pickRandomItem: function (arr) {
      var randomItem = arr[window.util.getRandomNumber(0, arr.length - 1)];
      return randomItem;
    },

    // Возвращает массив случайной длины
    getRandomLengthArr: function (arr) {
      var randomLength = window.util.getRandomNumber(1, arr.length);
      var randomLengthArr = arr.slice(0, randomLength);
      return randomLengthArr;
    },

    // Перемешивает элементы массива в произвольном порядке
    shuffle: function (arr) {
      var copiedArr = arr.slice();
      var mixedArr = [];
      while (copiedArr.length > 0) {
        var randomIndex = window.util.getRandomNumber(0, copiedArr.length - 1);
        var removedItem = copiedArr[randomIndex];
        copiedArr.splice(randomIndex, 1);
        mixedArr.push(removedItem);
      }
      return mixedArr;
    },

    // Скрывает сообщение об ошибке
    hideErrorMessage: function () {
      var errorElement = document.querySelector('.error');
      errorElement.parentNode.removeChild(errorElement);
    },

    // Отображает сообщение об ошибке
    showErrorMessage: function (errorText) {
      var node = document.createElement('div');
      node.textContent = errorText;
      node.classList.add('error');
      document.body.insertAdjacentElement('beforeend', node);
      setTimeout(window.util.hideErrorMessage, 2000);
    }
  };
})();
