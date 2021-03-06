'use strict';

(function () {
  var FILE_TYPES = ['gif', 'jpg', 'jpeg', 'png'];

  var fileChooser = window.main.uploadForm.querySelector('#upload-file');
  var previewPhoto = window.main.photoPreview.querySelector('img');

  fileChooser.addEventListener('change', function () {
    var file = fileChooser.files[0];
    var fileName = file.name.toLowerCase();

    var matches = FILE_TYPES.some(function (it) {
      return fileName.endsWith(it);
    });

    if (matches) {
      var reader = new FileReader();

      reader.addEventListener('load', function () {
        previewPhoto.src = reader.result;
      });

      reader.readAsDataURL(file);
    }
  });
})();
