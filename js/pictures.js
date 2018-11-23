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
  MIN: 1,
  MAX: 10
};
var MAX_COMMENTS_VIEW_NUMBER = 5;
var AVATAR_NUMBER = {
  MIN: 1,
  MAX: 6
};
var photos = [];
var urlArray = [];
var randomCommentsArray = [];
var comment = {
  CLASS: 'social__comment',
  IMG_CLASS: 'social__picture',
  TEXT_CLASS: 'social__text',
  IMG_ALT: 'Аватар комментатора фотографии',
  IMG_WIDTH: 35,
  IMG_HEIGHT: 35
};

var setupSimilarPicture = document.querySelector('.pictures');
var setupBigPicture = document.querySelector('.big-picture');
var similarPictureTemplate = document.querySelector('#picture').content.querySelector('.picture');
var commentsList = setupBigPicture.querySelector('.social__comments');
var commentCount = document.querySelector('.social__comment-count');
var commentsLoader = document.querySelector('.comments-loader');

var shuffleArray = function (array) {
  for (var i = 1; i <= PHOTOS_ARRAY_MAX_LENGTH; i++) {
    urlArray.push(i);
  }
  for (var j = array.length - 1; j > 0; j--) {
    var randomNumber = Math.floor(Math.random() * (j + 1));
    var temp = array[j];
    array[j] = array[randomNumber];
    array[randomNumber] = temp;
  }
  return array;
};

var getRandomNumber = function (min, max) {
  var randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
  return randomNumber;
};

var getCommentsArray = function (initialArray, finalArray) {
  var finalArrayLength = getRandomNumber(COMMENTS_NUMBER.MIN, COMMENTS_NUMBER.MAX);
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
  shuffleArray(urlArray);
  shuffleArray(DESCRIPTIONS);
  for (var i = 0; i < PHOTOS_ARRAY_MAX_LENGTH; i++) {
    photos.push({});
    photos[i].url = 'photos/' + urlArray[i] + '.jpg';
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
  setupBigPicture.querySelector('.big-picture__img').src = photo.url;
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
  var listItem = makeElement('li', comment.CLASS);
  var picture = makeElement('img', comment.IMG_CLASS);
  var randomAvatar = getRandomNumber(AVATAR_NUMBER.MIN, AVATAR_NUMBER.MAX);
  picture.src = 'img/avatar-' + randomAvatar + '.svg';
  picture.alt = comment.IMG_ALT;
  picture.width = comment.IMG_WIDTH;
  picture.height = comment.IMG_HEIGHT;
  listItem.appendChild(picture);
  var text = makeElement('p', comment.TEXT_CLASS, commentElement);
  listItem.appendChild(text);
  return listItem;
};

var createCommentsList = function (array) {
  if (array.length > MAX_COMMENTS_VIEW_NUMBER) {
    for (var m = 0; m < MAX_COMMENTS_VIEW_NUMBER; m++) {
      var commentItem = createComment(array[m]);
      commentsList.appendChild(commentItem);
    }
  } else {
    for (var p = 0; p < array.length; p++) {
      commentItem = createComment(array[p]);
      commentsList.appendChild(commentItem);
    }
  }
};

var fragment = document.createDocumentFragment();
createPhotosArray();
for (var i = 0; i < photos.length; i++) {
  fragment.appendChild(createPicture(photos[i]));
}
setupSimilarPicture.appendChild(fragment);

createBigPicture(photos[0]);
createCommentsList(photos[0].comments);


setupBigPicture.classList.remove('hidden');
commentCount.classList.add('hidden');
commentsLoader.classList.add('hidden');

