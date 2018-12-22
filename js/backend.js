'use strict';

(function () {
  var URL = {
    load: 'https://js.dump.academy/kekstagram/data',
    save: 'https://js.dump.academy/kekstagram'
  };
  var CONNECT_TIME = 10000;
  var TIME_UNIT = 'мс';
  var ErrorCode = {
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

  var tuneObject = function (callback) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      var error;
      switch (xhr.status) {
        case ErrorCode.SUCCESS:
          callback(xhr.response);
          break;
        case ErrorCode.MOVED_PERMANENTLY:
          error = ErrorMessage.MOVED_PERMANENTLY;
          break;
        case ErrorCode.FOUND:
          error = ErrorMessage.FOUND;
          break;
        case ErrorCode.BAD_REQUEST:
          error = ErrorMessage.BAD_REQUEST;
          break;
        case ErrorCode.UNAUTHORIZED:
          error = ErrorMessage.UNAUTHORIZED;
          break;
        case ErrorCode.NOT_FOUND:
          error = ErrorMessage.NOT_FOUND;
          break;
        case ErrorCode.SERVER:
          error = ErrorMessage.SERVER;
          break;
        default:
          error = 'Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText;
      }
      if (error) {
        onError(error);
      }
    });

    xhr.addEventListener('error', function () {
      onError(Error.CONNECT);
    });

    xhr.timeout = CONNECT_TIME;
    xhr.addEventListener('timeout', function () {
      onError(Error.TIMEOUT + xhr.timeout + TIME_UNIT);
    });

    return xhr;
  };

  var load = function (onLoad) {
    var xhr = tuneObject(onLoad);
    xhr.open('GET', URL.load);
    xhr.send();
  };

  var save = function (data, onLoad) {
    var xhr = tuneObject(onLoad);
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
