'use strict';

(function () {
  var SLIDER_STEP = 1;
  var Keycode = {
    LEFT_ARROW: 37,
    RIGHT_ARROW: 39
  };
  var effectWrapper = window.util.uploadWindow.querySelector('.effect-level');
  var effectSlider = effectWrapper.querySelector('.effect-level__line');
  var effectPin = effectWrapper.querySelector('.effect-level__pin');
  var effectDepth = effectWrapper.querySelector('.effect-level__depth');
  var photoPreview = window.util.uploadWindow.querySelector('.img-upload__preview');

  var calcStartCoords = function (evt) {
    return evt.clientX;
  };

  var calcShiftCoords = function (moveEvt, startCoords) {
    return startCoords - moveEvt.clientX;
  };

  var calcBlockCoords = function (block) {
    var blockCoords = block.getBoundingClientRect();
    return {
      top: blockCoords.top + pageYOffset,
      left: blockCoords.left + pageXOffset,
      width: blockCoords.width
    };
  };

  var calcNewCoords = function (moveEvt, shift, block) {
    var blockCoords = calcBlockCoords(block);
    var elementCoordsLeft = moveEvt.clientX - shift - blockCoords.left;
    var blockRightEdge = block.offsetWidth - 1;
    if (elementCoordsLeft < 0) {
      elementCoordsLeft = 0;
    } else if (elementCoordsLeft > blockRightEdge) {
      elementCoordsLeft = blockRightEdge;
    }
    return elementCoordsLeft;
  };

  var getRatioValue = function (currentCoords, block) {
    return (currentCoords / calcBlockCoords(block).width).toFixed(2);
  };

  var setPinPosition = function (value, block) {
    var maxRightPosition = calcBlockCoords(block).width;
    return (maxRightPosition * value) + window.util.COORDS_UNIT;
  };

  effectPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoordsX = calcStartCoords(evt);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shiftX = calcShiftCoords(moveEvt, startCoordsX);
      startCoordsX = calcStartCoords(moveEvt);
      var finalPinCoords = calcNewCoords(moveEvt, shiftX, effectSlider);
      effectPin.style.left = finalPinCoords + window.util.COORDS_UNIT;
      effectDepth.style.width = finalPinCoords + window.util.COORDS_UNIT;

      var ratio = getRatioValue(finalPinCoords, effectSlider);
      photoPreview.querySelector('img').style.filter = window.photoFilter.getFilterValue(ratio);

      var effectForm = effectWrapper.querySelector('input');
      effectForm.setAttribute('value', window.photoFilter.getFieldsetInputValue(ratio));
    };

    var onMouseUp = function (upEvt) {
      upEvt.preventDefault();
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mouseup', onMouseUp);
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp);
  });

  document.addEventListener('keydown', function (evt) {

    var onLeftArrowPress = function (pin) {
      if (evt.keyCode === Keycode.LEFT_ARROW) {
        evt.preventDefault();
        var pinPosition = pin.style.left.substring(0, pin.style.left.length - 2);
        if (pinPosition < 0) {
          pinPosition = 0;
        } else {
          pinPosition = Number(pinPosition) - SLIDER_STEP;
        }
      }
      effectPin.style.left = pinPosition + window.util.COORDS_UNIT;
      effectDepth.style.width = pinPosition + window.util.COORDS_UNIT;

      var ratio = getRatioValue(pinPosition, effectSlider);
      photoPreview.querySelector('img').style.filter = window.photoFilter.getFilterValue(ratio);
    };

    var onRightArrowPress = function (pin, block) {
      if (evt.keyCode === Keycode.RIGHT_ARROW) {
        evt.preventDefault();
        var rightLimit = block.offsetWidth - 1;
        var pinPosition = pin.style.left.substring(0, pin.style.left.length - 2);
        if (pinPosition > rightLimit) {
          pinPosition = rightLimit;
        } else {
          pinPosition = Number(pinPosition) + SLIDER_STEP;
        }
      }
      effectPin.style.left = pinPosition + window.util.COORDS_UNIT;
      effectDepth.style.width = pinPosition + window.util.COORDS_UNIT;

      var ratio = getRatioValue(pinPosition, effectSlider);
      photoPreview.querySelector('img').style.filter = window.photoFilter.getFilterValue(ratio);
    };

    onLeftArrowPress(effectPin);
    onRightArrowPress(effectPin, effectSlider);
  });

  window.slider = {
    effectWrapper: effectWrapper,
    effectSlider: effectSlider,
    effectPin: effectPin,
    effectDepth: effectDepth,
    setPinPosition: setPinPosition
  };
})();
