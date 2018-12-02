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
var COMMENT = {
  class: 'social__comment',
  imgClass: 'social__picture',
  textClass: 'social__text',
  imgAlt: 'Аватар комментатора фотографии',
  imgWidth: 35,
  imgHeight: 35
};
var photos = [];
var urlsArray = [];
var randomCommentsArray = [];

var ESC_KEYCODE = 27;

var setupSimilarPicture = document.querySelector('.pictures');
var setupBigPicture = document.querySelector('.big-picture');
var bigPictureCansel = setupBigPicture.querySelector('.big-picture__cancel');
var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var commentsList = setupBigPicture.querySelector('.social__comments');
var commentCount = document.querySelector('.social__comment-count');
var commentsLoader = document.querySelector('.comments-loader');
var uploadButton = document.querySelector('.img-upload__input');
var uploadWindow = document.querySelector('.img-upload__overlay');
var uploadWindowCansel = uploadWindow.querySelector('.img-upload__cancel');

var createArrayOfNumbers = function (array) {
  for (var i = 1; i <= PHOTOS_ARRAY_MAX_LENGTH; i++) {
    array.push(i);
  }
  return array;
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

var createPhotosArray = function () {
  createArrayOfNumbers(urlsArray);
  shuffleArray(urlsArray);
  shuffleArray(DESCRIPTIONS);
  for (var i = 0; i < PHOTOS_ARRAY_MAX_LENGTH; i++) {
    photos.push({});
    photos[i].url = 'photos/' + urlsArray[i] + '.jpg';
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
  picture.src = 'img/avatar-' + randomAvatar + '.svg';
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

var onPictureClick = function (thumbnail, photo) {
  thumbnail.addEventListener('click', function () {
    createBigPicture(photo);
    createCommentsList(photo.comments);
    openSetupBigPicture();
  });
};

for (var i = 0; i < photos.length; i++) {
  var createCurrentPicture = createPicture(photos[i]);
  fragment.appendChild(createCurrentPicture);
  onPictureClick(createCurrentPicture, photos[i]);
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
  if (evt.keyCode === ESC_KEYCODE) {
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
  if (evt.keyCode === ESC_KEYCODE) {
    closeSetupBigPicture();
  }
};

uploadButton.addEventListener('change', function () {
  openUploadWindow();
});

uploadWindowCansel.addEventListener('click', function () {
  closeUploadWindow();
});

bigPictureCansel.addEventListener('click', function () {
  closeSetupBigPicture();
});
