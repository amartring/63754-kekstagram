'use strict';

(function () {
  var Display = {
    BLOCK: 'block',
    NONE: 'none'
  };
  var Effect = {
    chrome: {
      NAME: 'chrome',
      ATTRIBUTE: 'grayscale',
      MIN_VALUE: 0,
      MAX_VALUE: 1,
      UNIT: ''
    },
    sepia: {
      NAME: 'sepia',
      ATTRIBUTE: 'sepia',
      MIN_VALUE: 0,
      MAX_VALUE: 1,
      UNIT: ''
    },
    marvin: {
      NAME: 'marvin',
      ATTRIBUTE: 'invert',
      MIN_VALUE: 0,
      MAX_VALUE: 100,
      UNIT: '%'
    },
    phobos: {
      NAME: 'phobos',
      ATTRIBUTE: 'blur',
      MIN_VALUE: 0,
      MAX_VALUE: 3,
      UNIT: 'px'
    },
    heat: {
      NAME: 'heat',
      ATTRIBUTE: 'brightness',
      MIN_VALUE: 1,
      MAX_VALUE: 3,
      UNIT: ''
    }
  };
  var effectsList = window.util.uploadWindow.querySelector('.effects__list');
  var effectWrapper = document.querySelector('.effect-level');

  var previewClassBegin = 'effects__preview--';
  var currentEffect = '';
  var noFilterElement = effectsList.querySelector('#effect-none');
  var previewPhoto = window.util.photoPreview.querySelector('img');

  var changeClass = function (element, classBegin, classsEnd) {
    element.classList.remove();
    element.classList.add(classBegin + classsEnd);
  };

  var setDefaultEffect = function () {
    noFilterElement.checked = true;
    previewPhoto.classList = '';
    previewPhoto.style.filter = '';
    previewPhoto.classList.remove();
    effectWrapper.style.display = Display.NONE;
  };

  var setDefaultState = function () {
    setDefaultEffect();
    window.hashtagsValidity.hashtagsField.value = null;
    window.hashtagsValidity.commentField.value = null;
  };

  window.slider.effectWrapper.classList.add('hidden');
  effectsList.addEventListener('change', function (evt) {
    var target = evt.target;
    var effectName = target.value;
    currentEffect = effectName;
    window.slider.effectWrapper.style.display = effectName === 'none' ? Display.NONE : Display.BLOCK;
    changeClass(previewPhoto, previewClassBegin, effectName);
    window.util.photoPreview.querySelector('img').style.filter = getFilterValue(1);
    window.slider.effectPin.style.left = window.slider.setPinPosition(1, window.slider.effectSlider);
    window.slider.effectDepth.style.width = window.slider.setPinPosition(1, window.slider.effectSlider);
  });

  var compileEffectStyle = function (elem, value) {
    return elem.ATTRIBUTE + '(' + (elem.MIN_VALUE + value * (elem.MAX_VALUE - elem.MIN_VALUE)) + elem.UNIT + ')';
  };

  var compileEffectValue = function (elem, value) {
    return elem.MIN_VALUE + value * (elem.MAX_VALUE - elem.MIN_VALUE);
  };

  var getFilterValue = function (value) {
    var result;
    switch (currentEffect) {
      case Effect.chrome.NAME:
        result = compileEffectStyle(Effect.chrome, value);
        break;
      case Effect.sepia.NAME:
        result = compileEffectStyle(Effect.sepia, value);
        break;
      case Effect.marvin.NAME:
        result = compileEffectStyle(Effect.marvin, value);
        break;
      case Effect.phobos.NAME:
        result = compileEffectStyle(Effect.phobos, value);
        break;
      case Effect.heat.NAME:
        result = compileEffectStyle(Effect.heat, value);
        break;
      case 'none':
        result = 'none';
        break;
    }
    return result;
  };

  var getFieldsetInputValue = function (value) {
    var result;
    switch (currentEffect) {
      case Effect.chrome.NAME:
        result = compileEffectValue(Effect.chrome, value);
        break;
      case Effect.sepia.NAME:
        result = compileEffectValue(Effect.sepia, value);
        break;
      case Effect.marvin.NAME:
        result = compileEffectValue(Effect.marvin, value);
        break;
      case Effect.phobos.NAME:
        result = compileEffectValue(Effect.phobos, value);
        break;
      case Effect.heat.NAME:
        result = compileEffectValue(Effect.heat, value);
        break;
    }
    return result;
  };

  window.photoFilter = {
    getFilterValue: getFilterValue,
    getFieldsetInputValue: getFieldsetInputValue,
    setDefaultState: setDefaultState
  };
})();
