'use strict';

var PHOTOS_ARRAY_MAX_LENGTH = 25;
var LIKES_MIN_NUMBER = 15;
var LIKES_MAX_NUMBER = 200;
var COMMENTS = [
  'Всё отлично!',
  'В целом всё неплохо. Но не всё.',
  'Когда вы делаете фотографию, хорошо бы убирать палец из кадра. В конце концов это просто непрофессионально.',
  'Моя бабушка случайно чихнула с фотоаппаратом в руках и у неё получилась фотография лучше.',
  'Я поскользнулся на банановой кожуре и уронил фотоаппарат на кота и у меня получилась фотография лучше.',
  'Лица у людей на фотке перекошены, как будто их избивают. Как можно было поймать такой неудачный момент?!'
];
var DESCRIPTIONS = [
  'Тестим новую камеру!',
  'Затусили с друзьями на море',
  'Как же круто тут кормят',
  'Отдыхаем...',
  'Цените каждое мгновенье. Цените тех, кто рядом с вами и отгоняйте все сомненья. Не обижайте всех словами......',
  'Вот это тачка!'
];
var COMMENTS_NUMBER = {
  min: 1,
  max: 10
};
var MAX_COMMENTS_VIEW_NUMBER = 5;
var AVATAR_NUMBER = {
  min: 1,
  max: 6
};
var PHOTO_URL_ADDRESS = {
  begin: 'photos/',
  end: '.jpg'
};
var AVATAR_SRC_ADDRESS = {
  begin: 'img/avatar-',
  end: '.svg'
};
var COMMENT = {
  class: 'social__comment',
  imgClass: 'social__picture',
  textClass: 'social__text',
  imgAlt: 'Аватар комментатора фотографии',
  imgWidth: 35,
  imgHeight: 35
};
var ESC_KEYCODE = 27;
var HASHTEG = {
  pattern: /^#[А-Яа-яЁёA-Za-z]{1,19}$/,
  maxCount: 5
};
var COORDS_UNITS = 'px';
var ValidityMessage = {
  tooManyHashtags: 'Нельзя указывать больше 5 хэш-тегов',
  notUnique: 'Один и тот же хэш-тег не может быть использован дважды',
  brokenPattern: 'Убедитесь, что: хэш-теги начинаются с #, длинна хэш-тегов не больше 20 символов, хэш-теги разделены пробелами.'
};
var photos = [];
var randomCommentsArray = [];

var setupSimilarPicture = document.querySelector('.pictures');
var setupBigPicture = document.querySelector('.big-picture');
var bigPictureCansel = setupBigPicture.querySelector('.big-picture__cancel');
var commentField = setupBigPicture.querySelector('.social__footer-text');
var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var commentsList = setupBigPicture.querySelector('.social__comments');
var commentCount = document.querySelector('.social__comment-count');
var commentsLoader = document.querySelector('.comments-loader');
var uploadButton = document.querySelector('.img-upload__input');
var uploadWindow = document.querySelector('.img-upload__overlay');
var uploadWindowCansel = uploadWindow.querySelector('.img-upload__cancel');
var photoPreview = uploadWindow.querySelector('.img-upload__preview');
var effectsList = uploadWindow.querySelector('.effects__list');
var effectWrapper = uploadWindow.querySelector('.effect-level');
var effectSlider = effectWrapper.querySelector('.effect-level__line');
var effectPin = effectWrapper.querySelector('.effect-level__pin');
var effectDepth = effectWrapper.querySelector('.effect-level__depth');
var hashtagsField = uploadWindow.querySelector('.text__hashtags');

var createArrayOfNumbers = function () {
  var result = [];
  for (var i = 1; i <= PHOTOS_ARRAY_MAX_LENGTH; i++) {
    result.push(i);
  }
  return result;
};

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

var getCommentsArray = function (initialArray, finalArray) {
  var finalArrayLength = getRandomNumber(COMMENTS_NUMBER.min, COMMENTS_NUMBER.max);
  for (var i = 0; i < finalArrayLength; i++) {
    shuffleArray(initialArray);
    var randomComments = getRandomNumber(1, 2);
    if (randomComments === 1) {
      finalArray[i] = initialArray[getRandomNumber(0, initialArray.length - 1)];
    } else {
      var randomIndexNumber = getRandomNumber(0, initialArray.length - 2);
      finalArray[i] = initialArray[randomIndexNumber] + ' ' + initialArray[randomIndexNumber + 1];
    }
  }
  return finalArray;
};

var createPictureAdress = function (addressBegin, addressEnd, pictureName) {
  return addressBegin + pictureName + addressEnd;
};

var createPhotosArray = function () {
  var urlsArray = createArrayOfNumbers();
  shuffleArray(urlsArray);
  shuffleArray(DESCRIPTIONS);
  for (var i = 0; i < PHOTOS_ARRAY_MAX_LENGTH; i++) {
    photos.push({});
    photos[i].url = createPictureAdress(PHOTO_URL_ADDRESS.begin, PHOTO_URL_ADDRESS.end, urlsArray[i]);
    photos[i].likes = getRandomNumber(LIKES_MIN_NUMBER, LIKES_MAX_NUMBER);
    randomCommentsArray = getCommentsArray(COMMENTS, randomCommentsArray);
    photos[i].comments = randomCommentsArray.slice();
    randomCommentsArray.splice(0, randomCommentsArray.length);
    photos[i].description = DESCRIPTIONS[getRandomNumber(0, DESCRIPTIONS.length - 1)];
  }
  return photos;
};

var createPicture = function (photo) {
  var pictureElement = similarPictureTemplate.cloneNode(true);
  pictureElement.querySelector('.picture__img').src = photo.url;
  pictureElement.querySelector('.picture__likes').textContent = photo.likes;
  pictureElement.querySelector('.picture__comments').textContent = photo.comments.length;
  return pictureElement;
};

var createBigPicture = function (photo) {
  setupBigPicture.querySelector('.big-picture__img').querySelector('img').src = photo.url;
  setupBigPicture.querySelector('.likes-count').textContent = photo.likes;
  setupBigPicture.querySelector('.comments-count').textContent = photo.comments.length;
  setupBigPicture.querySelector('.social__caption').textContent = photo.description;
  return setupBigPicture;
};

var removeChildren = function (element) {
  while (element.lastChild) {
    element.removeChild(element.lastChild);
  }
};

removeChildren(commentsList);

var makeElement = function (tegName, className, text) {
  var element = document.createElement(tegName);
  element.classList.add(className);
  if (text) {
    element.textContent = text;
  }
  return element;
};

var createComment = function (commentElement) {
  var listItem = makeElement('li', COMMENT.class);
  var picture = makeElement('img', COMMENT.imgClass);
  var randomAvatar = getRandomNumber(AVATAR_NUMBER.min, AVATAR_NUMBER.max);
  picture.src = createPictureAdress(AVATAR_SRC_ADDRESS.begin, AVATAR_SRC_ADDRESS.end, randomAvatar);
  picture.alt = COMMENT.imgAlt;
  picture.width = COMMENT.imgWidth;
  picture.height = COMMENT.imgHeight;
  listItem.appendChild(picture);
  var text = makeElement('p', COMMENT.textClass, commentElement);
  listItem.appendChild(text);
  return listItem;
};

var createCommentsList = function (array) {
  for (var k = 0; k < array.length && k < MAX_COMMENTS_VIEW_NUMBER; k++) {
    commentsList.appendChild(createComment(array[k]));
  }
};

var fragment = document.createDocumentFragment();
createPhotosArray();

var showFullscreenPicture = function (photo) {
  return function () {
    createBigPicture(photo);
    commentsList.innerHTML = '';
    createCommentsList(photo.comments);
    openSetupBigPicture();
  };
};

for (var i = 0; i < photos.length; i++) {
  var createCurrentPicture = createPicture(photos[i]);
  createCurrentPicture.addEventListener('click', showFullscreenPicture(photos[i]));
  fragment.appendChild(createCurrentPicture);
}

setupSimilarPicture.appendChild(fragment);

commentCount.classList.add('hidden');
commentsLoader.classList.add('hidden');

var openUploadWindow = function () {
  uploadWindow.classList.remove('hidden');
  document.addEventListener('keydown', onUploadWindowEscPress);
};

var closeUploadWindow = function () {
  uploadWindow.classList.add('hidden');
  document.removeEventListener('keydown', onUploadWindowEscPress);
  uploadButton.value = '';
};

var onUploadWindowEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE && hashtagsField !== document.activeElement) {
    closeUploadWindow();
  }
};

var openSetupBigPicture = function () {
  setupBigPicture.classList.remove('hidden');
  document.addEventListener('keydown', onBigPictureEscPress);
};

var closeSetupBigPicture = function () {
  setupBigPicture.classList.add('hidden');
  document.removeEventListener('keydown', onBigPictureEscPress);
};

var onBigPictureEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE && commentField !== document.activeElement) {
    closeSetupBigPicture();
  }
};

var convertStringIntoArray = function (field) {
  return field.value.split(' ');
};

var checkElementsInArray = function (array, pattern) {
  var counter = true;
  array.forEach(function (item) {
    if (!pattern.test(item)) {
      counter = false;
    }
  });
  return counter;
};

var deleteSimilarElementsInArray = function (array) {
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
  if (hashtagsArray.length > HASHTEG.maxCount) {
    target.setCustomValidity(ValidityMessage.tooManyHashtags);
  } else if (!checkElementsInArray(hashtagsArray, HASHTEG.pattern)) {
    target.setCustomValidity(ValidityMessage.brokenPattern);
  } else if (hashtagsArray.length !== deleteSimilarElementsInArray(hashtagsArray).length) {
    target.setCustomValidity(ValidityMessage.notUnique);
  } else {
    target.setCustomValidity('');
  }
  if (hashtagsField.value === '') {
    target.setCustomValidity('');
  }
});

bigPictureCansel.addEventListener('click', closeSetupBigPicture);

uploadButton.addEventListener('change', openUploadWindow);

uploadWindowCansel.addEventListener('click', closeUploadWindow);

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
  return (maxRightPosition * value) + COORDS_UNITS;
};

// --------------------------------- Эффекты -----------------------
var previewClassBegin = 'effects__preview--';
var currentEffect = '';
var checkedRadio = effectsList.querySelector('input[checked]');

var changeClass = function (element, classBegin, classsEnd) {
  element.classList.remove();
  element.classList.add(classBegin + classsEnd);
};

checkedRadio.removeAttribute('checked');
effectsList.addEventListener('click', function (evt) {
  var target = evt.target;
  var effectName = target.value;
  currentEffect = effectName;
  var effectExample = photoPreview.querySelector('img');
  effectWrapper.style.display = effectName === 'none' ? 'none' : 'block';
  changeClass(effectExample, previewClassBegin, effectName);
  photoPreview.querySelector('img').style.filter = getFilterValue(1);
  effectPin.style.left = setPinPosition(1, effectSlider);
  effectDepth.style.width = setPinPosition(1, effectSlider);
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

// ---------------------------------------------------------------

effectPin.addEventListener('mousedown', function (evt) {
  evt.preventDefault();
  var startCoordsX = calcStartCoords(evt);

  var onMouseMove = function (moveEvt) {
    moveEvt.preventDefault();
    var shiftX = calcShiftCoords(moveEvt, startCoordsX);
    startCoordsX = calcStartCoords(moveEvt);
    var finalPinCoords = calcNewCoords(moveEvt, shiftX, effectSlider);
    effectPin.style.left = finalPinCoords + COORDS_UNITS;
    effectDepth.style.width = finalPinCoords + COORDS_UNITS;

    var ratio = getRatioValue(finalPinCoords, effectSlider);
    photoPreview.querySelector('img').style.filter = getFilterValue(ratio);

    var effectForm = effectWrapper.querySelector('input');
    effectForm.setAttribute('value', getFieldsetInputValue(ratio));
  };

  var onMouseUp = function (upEvt) {
    upEvt.preventDefault();
    document.removeEventListener('mousemove', onMouseMove);
    document.removeEventListener('mouseup', onMouseUp);
  };

  document.addEventListener('mousemove', onMouseMove);
  document.addEventListener('mouseup', onMouseUp);
});

// ----------------- Изменение масштаба фото ----------------------

var EXTREME_VALUES = {
  min: 25,
  max: 100
};
var TRANSFORM = {
  begin: 'scale(',
  end: ')'
};
var photoScaleSmaller = uploadWindow.querySelector('.scale__control--smaller');
var photoScaleBigger = uploadWindow.querySelector('.scale__control--bigger');
var photoScaleValue = uploadWindow.querySelector('.scale__control--value');
var setScaleValue = function (number) {
  photoScaleValue.setAttribute('value', number + '%');
};

setScaleValue(EXTREME_VALUES.max);

var onPhotoScaleSmallerClick = function (value) {
  return (value <= EXTREME_VALUES.min) ? EXTREME_VALUES.min : value - 25;
};

var onPhotoScaleBiggerClick = function (value) {
  return (value >= EXTREME_VALUES.max) ? EXTREME_VALUES.max : Number(value) + 25;
};

var changedScaleValue = function (callback) {
  var currentScaleValue = photoScaleValue.value.substring(0, photoScaleValue.value.length - 1);
  var newScaleValue = callback(currentScaleValue);
  setScaleValue(newScaleValue);
  photoPreview.querySelector('img')
  .style
  .transform = TRANSFORM.begin + (newScaleValue / 100).toFixed(2) + TRANSFORM.end;
};

photoScaleSmaller.addEventListener('click', changedScaleValue.bind(null, onPhotoScaleSmallerClick));

photoScaleBigger.addEventListener('click', changedScaleValue.bind(null, onPhotoScaleBiggerClick));
