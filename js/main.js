'use strict';

(function () {
  var ESC_KEYCODE = 27;

  var setupBigPicture = document.querySelector('.big-picture');
  var bigPictureCansel = setupBigPicture.querySelector('.big-picture__cancel');
  var commentField = setupBigPicture.querySelector('.social__footer-text');
  var uploadButton = document.querySelector('.img-upload__input');
  var uploadWindow = document.querySelector('.img-upload__overlay');
  var uploadWindowCansel = uploadWindow.querySelector('.img-upload__cancel');
  var uploadForm = document.querySelector('.img-upload__form');

  var onUploadButtonClick = function () {
    window.photoFilter.setDefaultState();
    uploadWindow.classList.remove('hidden');
    document.addEventListener('keydown', onUploadWindowEscPress);
  };

  var closeUploadWindow = function () {
    uploadWindow.classList.add('hidden');
    document.removeEventListener('keydown', onUploadWindowEscPress);
    uploadButton.value = '';
  };

  var onUploadWindowEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE && window.hashtagsValidity.hashtagsField !== document.activeElement) {
      closeUploadWindow();
    }
  };

  var openSetupBigPicture = function () {
    setupBigPicture.classList.remove('hidden');
    document.addEventListener('keydown', onBigPictureEscPress);
  };

  var closeSetupBigPicture = function () {
    setupBigPicture.classList.add('hidden');
    document.removeEventListener('keydown', onBigPictureEscPress);
  };

  var onBigPictureEscPress = function (evt) {
    if (evt.keyCode === ESC_KEYCODE && commentField !== document.activeElement) {
      closeSetupBigPicture();
    }
  };

  bigPictureCansel.addEventListener('click', closeSetupBigPicture);

  uploadButton.addEventListener('change', onUploadButtonClick);

  uploadWindowCansel.addEventListener('click', closeUploadWindow);

  var onPostSuccess = function () {
    uploadWindow.classList.add('hidden');
  };

  uploadForm.addEventListener('submit', function (evt) {
    window.backend.save(new FormData(uploadForm), onPostSuccess, window.backend.onError);
    evt.preventDefault();
  });

  window.main = {
    openSetupBigPicture: openSetupBigPicture
  };
})();
