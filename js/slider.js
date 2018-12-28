'use strict';

(function () {
  var SLIDER_STEP = 1;
  var effectSlider = window.main.effectWrapper.querySelector('.effect-level__line');
  var effectPin = window.main.effectWrapper.querySelector('.effect-level__pin');
  var effectDepth = window.main.effectWrapper.querySelector('.effect-level__depth');

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
    var blockRightEdge = block.offsetWidth - 1;
    var elementCoordsLeft = moveEvt.clientX - shift - blockCoords.left;
    elementCoordsLeft = elementCoordsLeft < 0 ? 0 : elementCoordsLeft;
    elementCoordsLeft = elementCoordsLeft > blockRightEdge ? blockRightEdge : elementCoordsLeft;
    return elementCoordsLeft;
  };

  var getRatioValue = function (currentCoords, block) {
    return (currentCoords / calcBlockCoords(block).width).toFixed(2);
  };

  var setPinPosition = function (value, block) {
    var maxRightPosition = calcBlockCoords(block).width;
    return (maxRightPosition * value) + window.util.COORDS_UNIT;
  };

  var pasteStyleInfo = function (value) {
    effectPin.style.left = value + window.util.COORDS_UNIT;
    effectDepth.style.width = value + window.util.COORDS_UNIT;

    var ratio = getRatioValue(value, effectSlider);
    window.main.photoPreview.querySelector('img').style.filter = window.photoFilter.getFilterValue(ratio);

    var effectForm = window.main.effectWrapper.querySelector('input');
    effectForm.setAttribute('value', window.photoFilter.getFieldsetInputValue(ratio));
  };

  effectPin.addEventListener('mousedown', function (evt) {
    evt.preventDefault();
    var startCoordsX = calcStartCoords(evt);

    var onMouseMove = function (moveEvt) {
      moveEvt.preventDefault();
      var shiftX = calcShiftCoords(moveEvt, startCoordsX);
      startCoordsX = calcStartCoords(moveEvt);
      var finalPinCoords = calcNewCoords(moveEvt, shiftX, effectSlider);
      pasteStyleInfo(finalPinCoords);
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

    var onArrowPress = function (pin, block) {
      var pinPosition = pin.style.left.substring(0, pin.style.left.length - 2);
      if (evt.keyCode === window.main.KeyCode.LEFT_ARROW) {
        evt.preventDefault();
        pinPosition = pinPosition < 0 ? 0 : Number(pinPosition) - SLIDER_STEP;
      } else if (evt.keyCode === window.main.KeyCode.RIGHT_ARROW) {
        evt.preventDefault();
        var rightLimit = block.offsetWidth - 1;
        pinPosition = pinPosition > rightLimit ? rightLimit : Number(pinPosition) + SLIDER_STEP;
      }
      pasteStyleInfo(pinPosition);
    };

    onArrowPress(effectPin, effectSlider);
  });

  window.slider = {
    effectSlider: effectSlider,
    effectPin: effectPin,
    effectDepth: effectDepth,
    setPinPosition: setPinPosition
  };
})();
