'use strict';

(function () {
  var URL = {
    load: 'https://js.dump.academy/kekstagram/data',
    save: 'https://js.dump.academy/kekstagram'
  };
  var CONNECT_TIME = 10000;
  var TIME_UNIT = 'мс';
  var Code = {
    SUCCESS: 200,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    NOT_FOUND: 404,
    SERVER: 500
  };
  var Error = {
    CONNECT: 'Произошла ошибка соединения',
    TIMEOUT: 'Запрос не успел выполниться за '
  };

  var main = document.querySelector('main');
  var errorMessageTemplate = document.querySelector('#error').content.querySelector('.error');

  var tuneObject = function (object, callback) {
    object.responseType = 'json';
    object.addEventListener('load', function () {
      var error;
      switch (object.status) {
        case Code.SUCCESS:
          callback(object.response);
          break;
        case Code.MOVED_PERMANENTLY:
          error = 'Похоже, что сервер переехал в другое место.';
          break;
        case Code.FOUND:
          error = 'Сервер временно переехал, но скоро вернется.';
          break;
        case Code.BAD_REQUEST:
          error = 'Возможно Вы допустили какую-то ошибку в своем запросе?';
          break;
        case Code.UNAUTHORIZED:
          error = 'Извините, но у Вас недостаточно прав для выполнения этого действия.';
          break;
        case Code.NOT_FOUND:
          error = 'Запрашиваемая Вами страница не найдена.';
          break;
        case Code.SERVER:
          error = 'Извините, у нас на сервере небольшие проблемы.';
          break;

        default:
          error = 'Cтатус ответа: : ' + object.status + ' ' + object.statusText;
      }
      if (error) {
        onError(error);
      }
    });
  };

  var connectError = function (object) {
    object.addEventListener('error', function () {
      onError(Error.CONNECT);
    });
  };

  var timeoutError = function (object) {
    object.timeout = CONNECT_TIME;
    object.addEventListener('timeout', function () {
      onError(Error.TIMEOUT + object.timeout + TIME_UNIT);
    });
  };

  var load = function (onLoad) {
    var xhr = new XMLHttpRequest();

    tuneObject(xhr, onLoad);
    connectError(xhr);
    timeoutError(xhr);

    xhr.open('GET', URL.load);
    xhr.send();
  };

  var save = function (data, onLoad, onError) {
    var xhr = new XMLHttpRequest();

    tuneObject(xhr, onLoad);
    connectError(xhr);
    timeoutError(xhr);

    xhr.addEventListener('error', function () {
      onError(Error.CONNECT);
    });

    xhr.timeout = CONNECT_TIME;
    xhr.addEventListener('timeout', function () {
      onError(Error.TIMEOUT + xhr.timeout + TIME_UNIT);
    });

    xhr.open('POST', URL.save);
    xhr.send(data);
  };

  var onError = function (errorMessage) {
    var errorElement = errorMessageTemplate.cloneNode(true);
    errorElement.textContent = errorMessage;
    main.appendChild(errorElement);
  };

  window.backend = {
    load: load,
    save: save,
    onError: onError
  };
})();
