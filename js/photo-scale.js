'use strict';

(function () {
  var EXTREME_VALUES = {
    min: 25,
    max: 100
  };
  var SCALE_STEP = 25;
  var TRANSFORM = {
    begin: 'scale(',
    end: ')'
  };
  var photoScaleSmaller = window.util.uploadWindow.querySelector('.scale__control--smaller');
  var photoScaleBigger = window.util.uploadWindow.querySelector('.scale__control--bigger');
  var photoScaleValue = window.util.uploadWindow.querySelector('.scale__control--value');
  var setScaleValue = function (number) {
    photoScaleValue.setAttribute('value', number + '%');
  };

  setScaleValue(EXTREME_VALUES.max);

  var onPhotoScaleSmallerClick = function (value) {
    return (value <= EXTREME_VALUES.min) ? EXTREME_VALUES.min : value - SCALE_STEP;
  };

  var onPhotoScaleBiggerClick = function (value) {
    return (value >= EXTREME_VALUES.max) ? EXTREME_VALUES.max : Number(value) + SCALE_STEP;
  };

  var changedScaleValue = function (callback) {
    var currentScaleValue = photoScaleValue.value.substring(0, photoScaleValue.value.length - 1);
    var newScaleValue = callback(currentScaleValue);
    setScaleValue(newScaleValue);
    window.util.photoPreview.querySelector('img')
    .style
    .transform = TRANSFORM.begin + (newScaleValue / 100).toFixed(2) + TRANSFORM.end;
  };

  photoScaleSmaller.addEventListener('click', changedScaleValue.bind(null, onPhotoScaleSmallerClick));

  photoScaleBigger.addEventListener('click', changedScaleValue.bind(null, onPhotoScaleBiggerClick));
})();
