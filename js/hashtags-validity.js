'use strict';

(function () {
  var HASHTAG = {
    pattern: /^#[А-Яа-яЁёA-Za-z]{1,19}$/,
    maxCount: 5
  };
  var ValidityMessage = {
    TOO_MANY_HASHTAGS: 'Нельзя указывать больше 5 хэш-тегов',
    NOT_UNIQUE: 'Один и тот же хэш-тег не может быть использован дважды',
    BROKEN_PATTERN: 'Убедитесь, что: хэш-теги разделены пробелами, начинаются с # и длина каждого не больше 20 символов.'
  };
  var hashtagsField = window.main.uploadWindow.querySelector('.text__hashtags');
  var commentField = window.main.uploadWindow.querySelector('.text__description');

  var convertStringIntoArray = function (field) {
    return field.value.split(' ');
  };

  var checkElements = function (array, pattern) {
    var counter = true;
    array.forEach(function (item) {
      if (!pattern.test(item)) {
        counter = false;
      }
    });
    return counter;
  };

  var deleteSimilarElements = function (array) {
    var object = {};
    array.forEach(function (item) {
      var str = item.toLowerCase();
      object[str] = true;
    });
    return Object.keys(object);
  };

  hashtagsField.addEventListener('input', function (evt) {
    var hashtags = convertStringIntoArray(hashtagsField);
    var target = evt.target;
    if (hashtags.length > HASHTAG.maxCount) {
      target.setCustomValidity(ValidityMessage.TOO_MANY_HASHTAGS);
    } else if (!checkElements(hashtags, HASHTAG.pattern)) {
      target.setCustomValidity(ValidityMessage.BROKEN_PATTERN);
    } else if (hashtags.length !== deleteSimilarElements(hashtags).length) {
      target.setCustomValidity(ValidityMessage.NOT_UNIQUE);
    } else {
      target.setCustomValidity('');
    }
    if (hashtagsField.value === '') {
      target.setCustomValidity('');
    }
  });

  window.hashtagsValidity = {
    hashtagsField: hashtagsField,
    commentField: commentField
  };
})();
