'use strict';

(function () {
  var uploadWindow = document.querySelector('.img-upload__overlay');
  var photoPreview = uploadWindow.querySelector('.img-upload__preview');

  window.util = {
    COORDS_UNITS: 'px',
    uploadWindow: uploadWindow,
    photoPreview: photoPreview

  };
})();
