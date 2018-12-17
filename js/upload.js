'use strict';

(function () {
  var MAX_COMMENTS_VIEW_NUMBER = 5;
  var COMMENT = {
    class: 'social__comment',
    imgClass: 'social__picture',
    textClass: 'social__text',
    imgAlt: 'Аватар комментатора фотографии',
    imgWidth: 35,
    imgHeight: 35
  };

  var setupSimilarPicture = document.querySelector('.pictures');
  var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

  var commentsList = window.util.setupBigPicture.querySelector('.social__comments');
  var commentCount = document.querySelector('.social__comment-count');
  var commentsLoader = document.querySelector('.comments-loader');

  var photos = [];

  var createPicture = function (photo) {
    var pictureElement = similarPictureTemplate.cloneNode(true);
    pictureElement.querySelector('.picture__img').src = photo.url;
    pictureElement.querySelector('.picture__likes').textContent = photo.likes;
    pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;
    return pictureElement;
  };

  var createBigPicture = function (photo) {
    window.util.setupBigPicture.querySelector('.big-picture__img').querySelector('img').src = photo.url;
    window.util.setupBigPicture.querySelector('.likes-count').textContent = photo.likes;
    window.util.setupBigPicture.querySelector('.comments-count').textContent = photo.comments.length;
    window.util.setupBigPicture.querySelector('.social__caption').textContent = photo.description;
    return window.util.setupBigPicture;
  };

  var showFullscreenPicture = function (photo) {
    return function () {
      createBigPicture(photo);
      commentsList.innerHTML = '';
      createCommentsList(photo.comments);
      window.main.openSetupBigPicture();
    };
  };

  var createComment = function (commentElement) {
    var listItem = window.util.makeElement('li', COMMENT.class);
    var picture = window.util.makeElement('img', COMMENT.imgClass);
    picture.src = commentElement.avatar;
    picture.alt = COMMENT.imgAlt;
    picture.width = COMMENT.imgWidth;
    picture.height = COMMENT.imgHeight;
    listItem.appendChild(picture);
    var text = window.util.makeElement('p', COMMENT.textClass, commentElement.message);
    listItem.appendChild(text);
    return listItem;
  };

  var createCommentsList = function (array) {
    for (var k = 0; k < array.length && k < MAX_COMMENTS_VIEW_NUMBER; k++) {
      commentsList.appendChild(createComment(array[k]));
    }
  };

  var removeChildren = function (element) {
    while (element.lastChild) {
      element.removeChild(element.lastChild);
    }
  };

  removeChildren(commentsList);

  var onGetSuccess = function (data) {
    photos = data;
    window.util.shuffleArray(photos);
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
})();
