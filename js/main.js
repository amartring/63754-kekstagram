'use strict';

(function () {
  var KeyCode = {
    ESC: 27,
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39
  };

  var setupBigPicture = document.querySelector('.big-picture');
  var bigPictureCancel = setupBigPicture.querySelector('.big-picture__cancel');
  var commentField = setupBigPicture.querySelector('.social__footer-text');

  var uploadWindow = document.querySelector('.img-upload__overlay');
  var uploadWindowCancel = uploadWindow.querySelector('.img-upload__cancel');
  var photoPreview = uploadWindow.querySelector('.img-upload__preview');
  var effectWrapper = uploadWindow.querySelector('.effect-level');

  var uploadForm = document.querySelector('.img-upload__form');
  var uploadButton = uploadForm.querySelector('.img-upload__input');

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
    if (evt.keyCode === KeyCode.ESC
        && window.hashtagsValidity.hashtagsField !== document.activeElement
        && window.hashtagsValidity.commentField !== document.activeElement) {
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
    if (evt.keyCode === KeyCode.ESC && commentField !== document.activeElement) {
      closeSetupBigPicture();
    }
  };

  var onBigPictureCancelClick = function () {
    closeSetupBigPicture();
  };

  var onUploadWindowCancelClick = function () {
    closeUploadWindow();
  };

  bigPictureCancel.addEventListener('click', onBigPictureCancelClick);

  uploadButton.addEventListener('change', onUploadButtonClick);

  uploadWindowCancel.addEventListener('click', onUploadWindowCancelClick);

  var onPostSuccess = function () {
    uploadWindow.classList.add('hidden');
    window.backend.showSuccessMessage();
  };

  uploadForm.addEventListener('submit', function (evt) {
    evt.preventDefault();
    window.backend.save(new FormData(uploadForm), onPostSuccess, window.backend.onError);
  });

  window.main = {
    openSetupBigPicture: openSetupBigPicture,
    uploadForm: uploadForm,
    uploadWindow: uploadWindow,
    effectWrapper: effectWrapper,
    photoPreview: photoPreview,
    setupBigPicture: setupBigPicture,
    KeyCode: KeyCode
  };
})();
