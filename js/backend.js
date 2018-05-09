// Модуль для работы с сервером
'use strict';

(function () {
  var LOAD_URL = 'https://js.dump.academy/keksobooking/data';
  var UPLOAD_URL = 'https://js.dump.academy/keksobooking';
  var HTTP_STATUS_OK = 200;
  var REQUEST_TIMEOUT = 10000;

  window.backend = {
    // Загржает данные с сервера
    load: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === HTTP_STATUS_OK) {
          onLoad(xhr.response);
        } else {
          onError('Произошла ошибка. Статус ответа ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
      });
      xhr.timeout = REQUEST_TIMEOUT;

      xhr.open('GET', LOAD_URL);
      xhr.send();
    },

    // Отправляет данные на сервер
    upload: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === HTTP_STATUS_OK) {
          onLoad(xhr.response);
        } else {
          onError('Произошла ошибка. Статус ответа ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + ' мс');
      });
      xhr.timeout = REQUEST_TIMEOUT;

      xhr.open('POST', UPLOAD_URL);
      xhr.send(data);
    }
  };
})();
