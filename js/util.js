// Модуль, содержащий переменные и функции для общего использования

'use strict';
(function () {
  var ESC_KEYCODE = 27;
  var DEBOUNCE_INTERVAL = 500;
  var lastTimeout;

  // Скрывает сообщение об ошибке
  var hideErrorMessage = function () {
    var errorElement = document.querySelector('.error');
    errorElement.parentNode.removeChild(errorElement);
  };

  window.util = {
    // Обработчик события по нажатию esc
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },

    // Отображает сообщение об ошибке
    showErrorMessage: function (errorText) {
      var node = document.createElement('div');
      node.textContent = errorText;
      node.classList.add('error');
      document.body.insertAdjacentElement('beforeend', node);
      setTimeout(hideErrorMessage, 2000);
    },

    // Функция устранения 'дребезга'
    debounce: function (fun) {
      lastTimeout = null;

      return function () {
        var args = arguments;
        if (lastTimeout) {
          window.clearTimeout(lastTimeout);
        }
        lastTimeout = window.setTimeout(function () {
          fun.apply(null, args);
        }, DEBOUNCE_INTERVAL);
      };
    }
  };
})();
