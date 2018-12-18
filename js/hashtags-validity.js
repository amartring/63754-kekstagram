'use strict';

(function () {
  var HASHTAG = {
    pattern: /^#[А-Яа-яЁёA-Za-z]{1,19}$/,
    maxCount: 5
  };
  var ValidityMessage = {
    tooManyHashtags: 'Нельзя указывать больше 5 хэш-тегов',
    notUnique: 'Один и тот же хэш-тег не может быть использован дважды',
    brokenPattern: 'Убедитесь, что: хэш-теги разделены пробелами, начинаются с # и длина каждого не больше 20 символов.'
  };
  var hashtagsField = window.util.uploadWindow.querySelector('.text__hashtags');
  var commentField = window.util.uploadWindow.querySelector('.text__description');

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
    var hashtagsArray = convertStringIntoArray(hashtagsField);
    var target = evt.target;
    if (hashtagsArray.length > HASHTAG.maxCount) {
      target.setCustomValidity(ValidityMessage.tooManyHashtags);
    } else if (!checkElements(hashtagsArray, HASHTAG.pattern)) {
      target.setCustomValidity(ValidityMessage.brokenPattern);
    } else if (hashtagsArray.length !== deleteSimilarElements(hashtagsArray).length) {
      target.setCustomValidity(ValidityMessage.notUnique);
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
