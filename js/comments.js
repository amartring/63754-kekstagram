'use strict';

(function () {
  var COMMENTS_VIEW_NUMBER = 5;
  var COMMENT = {
    class: 'social__comment',
    imgClass: 'social__picture',
    textClass: 'social__text',
    imgAlt: 'Аватар комментатора фотографии',
    imgWidth: 35,
    imgHeight: 35
  };

  var commentsList = window.util.setupBigPicture.querySelector('.social__comments');
  var commentsCount = document.querySelector('.social__comment-count');
  var commentsLoader = document.querySelector('.comments-loader');

  var setStartCommentsNumber = function () {
    commentsCount.firstChild.textContent = (commentsList.children.length < COMMENTS_VIEW_NUMBER)
      ? (commentsList.children.length + ' из ')
      : (COMMENTS_VIEW_NUMBER + ' из ');
  };

  var setupCommentsLoader = function () {
    var invisibleComments = commentsList.querySelectorAll('.visually-hidden');
    return invisibleComments.length === 0
      ? commentsLoader.classList.add('visually-hidden')
      : commentsLoader.classList.remove('visually-hidden');
  };

  var countComments = function () {
    var visibleComments = commentsList.querySelectorAll('.social__comment:not(.visually-hidden)');
    commentsCount.firstChild.textContent = '';
    commentsCount.firstChild.textContent = visibleComments.length + ' из ';
  };

  var createComment = function (commentElement) {
    var listItem = window.util.makeElement('li', COMMENT.class);
    var picture = window.util.makeElement('img', COMMENT.imgClass);
    picture.src = commentElement.avatar;
    picture.alt = COMMENT.imgAlt;
    picture.width = COMMENT.imgWidth;
    picture.height = COMMENT.imgHeight;
    listItem.appendChild(picture);
    var text = window.util.makeElement('p', COMMENT.textClass, commentElement.message);
    listItem.appendChild(text);
    return listItem;
  };

  var createCommentsList = function (array) {
    array.forEach(function (item, index) {
      var comment = createComment(item);
      if (index >= COMMENTS_VIEW_NUMBER) {
        comment.classList.add('visually-hidden');
      }
      commentsList.appendChild(comment);
      setupCommentsLoader();
    });
  };

  var onCommentsLoaderClick = function () {
    var invisibleComments = commentsList.querySelectorAll('.visually-hidden');
    for (var i = 0; i < invisibleComments.length && i < COMMENTS_VIEW_NUMBER; i++) {
      invisibleComments[i].classList.remove('visually-hidden');
    }
    countComments();
    setupCommentsLoader();
  };

  var commentsSetup = function (item) {
    commentsList.innerHTML = '';
    createCommentsList(item.comments);
    commentsLoader.addEventListener('click', onCommentsLoaderClick);
    setStartCommentsNumber();
  };

  window.comments = {
    commentsSetup: commentsSetup
  };
})();
