'use strict';

(function () {
  var effectsList = window.util.uploadWindow.querySelector('.effects__list');

  var previewClassBegin = 'effects__preview--';
  var currentEffect = '';
  var checkedRadio = effectsList.querySelector('input[checked]');
  var noFilterElement = effectsList.querySelector('#effect-none');

  var changeClass = function (element, classBegin, classsEnd) {
    element.classList.remove();
    element.classList.add(classBegin + classsEnd);
  };

  checkedRadio.removeAttribute('checked');
  noFilterElement.setAttribute('checked', 'checked');
  window.slider.effectWrapper.style.display = 'none';
  effectsList.addEventListener('change', function (evt) {
    var target = evt.target;
    var effectName = target.value;
    currentEffect = effectName;
    var effectExample = window.util.photoPreview.querySelector('img');
    window.slider.effectWrapper.style.display = effectName === 'none' ? 'none' : 'block';
    changeClass(effectExample, previewClassBegin, effectName);
    window.util.photoPreview.querySelector('img').style.filter = getFilterValue(1);
    window.slider.effectPin.style.left = window.slider.setPinPosition(1, window.slider.effectSlider);
    window.slider.effectDepth.style.width = window.slider.setPinPosition(1, window.slider.effectSlider);
  });

  var getFilterValue = function (value) {
    var result;
    switch (currentEffect) {
      case 'chrome':
        result = 'grayscale(' + value + ')';
        break;
      case 'sepia':
        result = 'sepia(' + value + ')';
        break;
      case 'marvin':
        result = 'invert(' + (value * 100) + '%)';
        break;
      case 'phobos':
        result = 'blur(' + (value * 3) + 'px)';
        break;
      case 'heat':
        result = 'brightness(' + (1 + value * 2) + ')';
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
      case 'chrome':
        result = value;
        break;
      case 'sepia':
        result = value;
        break;
      case 'marvin':
        result = value * 100;
        break;
      case 'phobos':
        result = value * 3;
        break;
      case 'heat':
        result = 1 + value * 2;
        break;
    }
    return result;
  };

  window.photoFilter = {
    getFilterValue: getFilterValue,
    getFieldsetInputValue: getFieldsetInputValue
  };
})();
