'use strict';

(function () {
  var COORDS_UNIT = 'px';

  var shuffleArray = function (array) {
    for (var j = array.length - 1; j > 0; j--) {
      var randomNumber = Math.floor(Math.random() * (j + 1));
      var temp = array[j];
      array[j] = array[randomNumber];
      array[randomNumber] = temp;
    }
    return array;
  };

  var getRandomNumber = function (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };

  var makeElement = function (tegName, className, text) {
    var element = document.createElement(tegName);
    element.classList.add(className);
    element.textContent = text || '';
    return element;
  };

  window.util = {
    COORDS_UNIT: COORDS_UNIT,
    shuffleArray: shuffleArray,
    getRandomNumber: getRandomNumber,
    makeElement: makeElement
  };
})();
