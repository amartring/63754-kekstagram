'use strict';

(function () {
  var setupSimilarPicture = document.querySelector('.pictures');
  var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');

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
      window.main.openSetupBigPicture();
      window.comments.commentsSetup(photo);
    };
  };

  window.render = function (data) {
    var fragment = document.createDocumentFragment();
    data.forEach(function (item) {
      var currentPhoto = createPicture(item);
      currentPhoto.addEventListener('click', showFullscreenPicture(item));
      fragment.appendChild(currentPhoto);
    });
    setupSimilarPicture.appendChild(fragment);
  };
})();
