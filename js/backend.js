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
  var ErrorMessage = {
    MOVED_PERMANENTLY: 'Похоже, что сервер переехал в другое место.',
    FOUND: 'Сервер временно переехал, но скоро вернется.',
    BAD_REQUEST: 'Возможно Вы допустили какую-то ошибку в своем запросе?',
    UNAUTHORIZED: 'Извините, но у Вас недостаточно прав для выполнения этого действия.',
    NOT_FOUND: 'Запрашиваемая Вами страница не найдена.',
    SERVER: 'Извините, у нас на сервере небольшие проблемы.'
  };
  var Error = {
    CONNECT: 'Произошла ошибка соединения',
    TIMEOUT: 'Запрос не успел выполниться за '
  };

  var mainElement = document.querySelector('main');
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
          error = ErrorMessage.MOVED_PERMANENTLY;
          break;
        case Code.FOUND:
          error = ErrorMessage.FOUND;
          break;
        case Code.BAD_REQUEST:
          error = ErrorMessage.BAD_REQUEST;
          break;
        case Code.UNAUTHORIZED:
          error = ErrorMessage.UNAUTHORIZED;
          break;
        case Code.NOT_FOUND:
          error = ErrorMessage.NOT_FOUND;
          break;
        case Code.SERVER:
          error = ErrorMessage.SERVER;
          break;
        default:
          error = 'Cтатус ответа: : ' + object.status + ' ' + object.statusText;
      }
      if (error) {
        onError(error);
      }
    });

    object.addEventListener('error', function () {
      onError(Error.CONNECT);
    });

    object.timeout = CONNECT_TIME;
    object.addEventListener('timeout', function () {
      onError(Error.TIMEOUT + object.timeout + TIME_UNIT);
    });
  };

  var load = function (onLoad) {
    var xhr = new XMLHttpRequest();
    tuneObject(xhr, onLoad);
    xhr.open('GET', URL.load);
    xhr.send();
  };

  var save = function (data, onLoad) {
    var xhr = new XMLHttpRequest();
    tuneObject(xhr, onLoad);
    xhr.open('POST', URL.save);
    xhr.send(data);
  };

  var onError = function (errorMessage) {
    var errorElement = errorMessageTemplate.cloneNode(true);
    errorElement.textContent = errorMessage;
    mainElement.appendChild(errorElement);
  };

  window.backend = {
    load: load,
    save: save,
    onError: onError
  };
})();
