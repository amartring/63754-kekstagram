'use strict';

(function () {
  var TIMEOUT = 10000;
  var TIME_UNIT = 'мс';
  var Url = {
    LOAD: 'https://js.dump.academy/kekstagram/data',
    SAVE: 'https://js.dump.academy/kekstagram'
  };
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
  var successMessageTemplate = document.querySelector('#success').content.querySelector('.success');

  var setupObject = function (callback, onError) {
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'json';
    xhr.addEventListener('load', function () {
      switch (xhr.status) {
        case ErrorCode.SUCCESS:
          callback(xhr.response);
          break;
        case ErrorCode.MOVED_PERMANENTLY:
          onError(ErrorMessage.MOVED_PERMANENTLY);
          break;
        case ErrorCode.FOUND:
          onError(ErrorMessage.FOUND);
          break;
        case ErrorCode.BAD_REQUEST:
          onError(ErrorMessage.BAD_REQUEST);
          break;
        case ErrorCode.UNAUTHORIZED:
          onError(ErrorMessage.UNAUTHORIZED);
          break;
        case ErrorCode.NOT_FOUND:
          onError(ErrorMessage.NOT_FOUND);
          break;
        case ErrorCode.SERVER:
          onError(ErrorMessage.SERVER);
          break;
        default:
          onError('Cтатус ответа: : ' + xhr.status + ' ' + xhr.statusText);
      }
    });

    xhr.addEventListener('error', function () {
      onError(Error.CONNECT);
    });

    xhr.timeout = TIMEOUT;
    xhr.addEventListener('timeout', function () {
      onError(Error.TIMEOUT + xhr.timeout + TIME_UNIT);
    });

    return xhr;
  };

  var load = function (onLoad) {
    var xhr = setupObject(onLoad, onErrorGet);
    xhr.open('GET', Url.LOAD);
    xhr.send();
  };

  var save = function (data, onLoad) {
    var xhr = setupObject(onLoad, onErrorPost);
    xhr.open('POST', Url.SAVE);
    xhr.send(data);
  };

  var onErrorGet = function (errorMessage) {
    var errorElement = errorMessageTemplate.cloneNode(true);
    errorElement.textContent = errorMessage;
    mainElement.appendChild(errorElement);
  };

  var onErrorPost = function () {
    var errorElement = errorMessageTemplate.cloneNode(true);
    mainElement.appendChild(errorElement);
    window.main.closeUploadWindow();
  };

  var createSuccessMessage = function () {
    var successElement = successMessageTemplate.cloneNode(true);
    mainElement.appendChild(successElement);
    // successElement.classList.add('visually-hidden');
  };

  // createSuccessMessage();

  // var successMessage = document.querySelector('.success');
  // var successMessageClose = successMessage.querySelector('.success__button');

  var showSuccessMessage = function () {
    var successElement = successMessageTemplate.cloneNode(true);
    mainElement.appendChild(successElement);
    var successMessage = document.querySelector('.success');
    var successMessageClose = successMessage.querySelector('.success__button');

    // successMessage.classList.remove('visually-hidden');

    var closeSuccessMessage = function () {
      mainElement.parentNode.removeChild(successElement);
      // successMessage.classList.add('visually-hidden');
      document.removeEventListener('keydown', onSuccessMessageEscPress);
    };

    var onSuccessMessageEscPress = function (evt) {
      if (evt.keyCode === window.main.KeyCode.ESC) {
        closeSuccessMessage();
      }
    };

    var onsuccessMessageCloseClick = function () {
      closeSuccessMessage();
    };

    successMessageClose.addEventListener('click', onsuccessMessageCloseClick);
    document.addEventListener('keydown', onSuccessMessageEscPress);
    document.addEventListener('click', onsuccessMessageCloseClick);
  };

  window.backend = {
    load: load,
    save: save,
    showSuccessMessage: showSuccessMessage
  };
})();
