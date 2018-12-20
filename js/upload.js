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
  var picture = picturesBlock.querySelectorAll('a');

  var renderNewPhoto = function (array) {
    var randomStartNumber = window.util.getRandomNumber(0, array.length - NEW_PHOTO_NUMBER);
    var randomEndNumber = randomStartNumber + NEW_PHOTO_NUMBER;
    return window.util.shuffleArray(array).slice(randomStartNumber, randomEndNumber);
  };

  var renderDiscussedPhoto = function (array) {
    return array.slice().sort(function (first, second) {
      return second.comments.length - first.comments.length;
    });
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
        window.render(renderNewPhoto(photos));
        break;
      case Filter.DISCUSSED:
        window.render(renderDiscussedPhoto(photos));
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
