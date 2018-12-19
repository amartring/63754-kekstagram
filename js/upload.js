'use strict';

(function () {
  var photos = [];

  // ----------------------------------------------------------

  var NEW_PHOTO_NUMBER = 10;

  var Filter = {
    POPULAR: 'filter-popular',
    NEW: 'filter-new',
    DISCUSSED: 'filter-discussed'
  };

  var imgFilter = document.querySelector('.img-filters');
  var imgFiltersForm = imgFilter.querySelector('.img-filters__form');
  var imgFiltersButton = imgFiltersForm.querySelectorAll('.img-filters__button');
  var picturesBlock = document.querySelector('.pictures');
  var picture = picturesBlock.querySelectorAll('.picture');

  var commentsComparator = function (left, right) {
    if (left < right) {
      return 1;
    } else if (left > right) {
      return -1;
    } else {
      return 0;
    }
  };

  var renderNewPhoto = function () {
    window.util.shuffleArray(photos);
    var randomStartNumber = window.util.getRandomNumber(0, photos.length - NEW_PHOTO_NUMBER);
    var randomEndNumber = randomStartNumber + NEW_PHOTO_NUMBER;
    var newArray = photos.slice(randomStartNumber, randomEndNumber);
    window.render(newArray);
  };

  var renderDiscussedPhoto = function () {
    var discussedArray = photos;
    window.render(discussedArray.sort(function (left, right) {
      return commentsComparator(left.comments.length, right.comments.length);
    }));
  };

  var changeClass = function (target) {
    imgFiltersButton.forEach(function (item) {
      item.classList.remove('img-filters__button--active');
    });
    target.classList.add('img-filters__button--active');
  };

  var changeFilter = function (evt) {
    var target = evt.target;
    picture.forEach(function (item) {
      picturesBlock.removeChild(item);
    });

    switch (target.id) {
      case Filter.POPULAR:
        window.render(photos);
        break;
      case Filter.NEW:
        renderNewPhoto();
        break;
      case Filter.DISCUSSED:
        renderDiscussedPhoto();
        break;
    }
  };

  imgFiltersForm.addEventListener('click', function (evt) {
    var target = evt.target;
    window.debounce(changeFilter(evt));
    changeClass(target);
  });

  var onGetSuccess = function (data) {
    imgFilter.classList.remove('img-filters--inactive');
    photos = data;
    window.render(photos);
  };

  window.backend.load(onGetSuccess, window.backend.onError);
})();
