'use strict';

var MAX_COMMENTS_VIEW_NUMBER = 5;
var COMMENT = {
  class: 'social__comment',
  imgClass: 'social__picture',
  textClass: 'social__text',
  imgAlt: 'Аватар комментатора фотографии',
  imgWidth: 35,
  imgHeight: 35
};
var ESC_KEYCODE = 27;
var photos = [];

var setupSimilarPicture = document.querySelector('.pictures');
var setupBigPicture = document.querySelector('.big-picture');
var bigPictureCansel = setupBigPicture.querySelector('.big-picture__cancel');
var commentField = setupBigPicture.querySelector('.social__footer-text');
var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var commentsList = setupBigPicture.querySelector('.social__comments');
var commentCount = document.querySelector('.social__comment-count');
var commentsLoader = document.querySelector('.comments-loader');
var uploadButton = document.querySelector('.img-upload__input');
var uploadWindow = document.querySelector('.img-upload__overlay');
var uploadWindowCansel = uploadWindow.querySelector('.img-upload__cancel');
var uploadWindowSubmit = uploadWindow.querySelector('.img-upload__submit');

var shuffleArray = function (array) {
  for (var j = array.length - 1; j > 0; j--) {
    var randomNumber = Math.floor(Math.random() * (j + 1));
    var temp = array[j];
    array[j] = array[randomNumber];
    array[randomNumber] = temp;
  }
  return array;
};

var createPicture = function (photo) {
  var pictureElement = similarPictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = photo.url;
  pictureElement.querySelector('.picture__likes').textContent = photo.likes;
  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;
  return pictureElement;
};

var createBigPicture = function (photo) {
  setupBigPicture.querySelector('.big-picture__img').querySelector('img').src = photo.url;
  setupBigPicture.querySelector('.likes-count').textContent = photo.likes;
  setupBigPicture.querySelector('.comments-count').textContent = photo.comments.length;
  setupBigPicture.querySelector('.social__caption').textContent = photo.description;
  return setupBigPicture;
};


// --------------------------- Комментарии ----------------------------------

var removeChildren = function (element) {
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
};

removeChildren(commentsList);

var makeElement = function (tegName, className, text) {
  var element = document.createElement(tegName);
  element.classList.add(className);
  if (text) {
    element.textContent = text;
  }
  return element;
};

var createComment = function (commentElement) {
  var listItem = makeElement('li', COMMENT.class);
  var picture = makeElement('img', COMMENT.imgClass);
  picture.src = commentElement.avatar;
  picture.alt = COMMENT.imgAlt;
  picture.width = COMMENT.imgWidth;
  picture.height = COMMENT.imgHeight;
  listItem.appendChild(picture);
  var text = makeElement('p', COMMENT.textClass, commentElement.message);
  listItem.appendChild(text);
  return listItem;
};

var createCommentsList = function (array) {
  for (var k = 0; k < array.length && k < MAX_COMMENTS_VIEW_NUMBER; k++) {
    commentsList.appendChild(createComment(array[k]));
  }
};

var showFullscreenPicture = function (photo) {
  return function () {
    createBigPicture(photo);
    commentsList.innerHTML = '';
    createCommentsList(photo.comments);
    openSetupBigPicture();
  };
};

// -------------------------------------------------------------

var onGetSuccess = function (data) {
  photos = data;
  shuffleArray(photos);
  var fragment = document.createDocumentFragment();
  photos.forEach(function (item) {
    var currentPhoto = createPicture(item);
    currentPhoto.addEventListener('click', showFullscreenPicture(item));
    fragment.appendChild(currentPhoto);
  });
  setupSimilarPicture.appendChild(fragment);
};

window.backend.load(onGetSuccess, window.backend.onError);

commentCount.classList.add('hidden');
commentsLoader.classList.add('hidden');

// ----------------------------------------------------------------

var openUploadWindow = function () {
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

uploadButton.addEventListener('change', openUploadWindow);

uploadWindowCansel.addEventListener('click', closeUploadWindow);

var onPostSuccess = function () {
  uploadWindow.classList.add('hidden');
};

uploadWindowSubmit.addEventListener('click', function (evt) {
  evt.preventDefault();
  window.backend.save(new FormData(uploadWindow), onPostSuccess, window.backend.onError);
  // evt.preventDefault();
});
