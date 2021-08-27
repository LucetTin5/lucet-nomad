const videoContainer = document.querySelector('.video__container');
const form = document.querySelector('form');
const comments = document.querySelector('.comments__comments');

const getTargetNode = (node) => {
  while (node.className !== 'comment__comment') {
    node = node.parentNode;
  }
  return node;
};
const likeComment = async (event) => {
  event.preventDefault();
  let { target } = event;
  if (target.className !== 'comment-like') {
    target = target.parentNode;
  }
  if (typeof target.classList[1] !== 'undefined') {
    target.removeEventListener('click', likeComment);
    return;
  }
  target.removeEventListener('click', likeComment);
  const comment = getTargetNode(target);
  const commentId = comment.dataset.id;
  try {
    const res = await fetch(`/api/comments/${commentId}/like-comment`, {
      method: 'POST',
    });
    console.log(res.status);
    if (res.status === 200) {
      comment.querySelector('.comment-dislike').classList.add('disabled');
      target.classList.add('selected');
    }
  } catch (err) {
    console.log(err);
  }
};
const dislikeComment = async (event) => {
  event.preventDefault();
  let { target } = event;
  if (target.className !== 'comment-dislke') {
    target = target.parentNode;
  }
  if (typeof target.classList[1] !== 'undefined') {
    target.removeEventListener('click', dislikeComment);
    return;
  }
  target.removeEventListener('click', dislikeComment);
  try {
    const res = await fetch(`/api/comments/${commentId}/like-comment`, {
      method: 'POST',
    });
    if (res.status === 200) {
      comment.querySelector('.comment-like').classList.add('disabled');
      target.classList.add('selected');
    }
  } catch (err) {
    console.log(err);
  }
};
const editComment = (event) => {
  event.preventDefault();
  let { target } = event;
  if (target.className !== 'comment-edit') {
    target = target.parentNode;
  }
  target.removeEventListener('click', editComment);
  target.querySelector('span').innerText = 'done';
  const comment = getTargetNode(target);
  comment.querySelector('.comment-delete').style = 'display:none';
  const currentComment = comment.querySelector('.comment-text');
  const input = document.createElement('input');
  input.type = text;
  input.value = currentComment.innerText;
  comment.insertBefore(input, currentComment);
  currentComment.setAttribute('style', 'display:none');
  target.addEventListener('click', editCommentFinish);
};
const editCommentFinish = async (event) => {
  event.preventDefault();
  let { target } = event;
  if (target.className !== 'comment-edit') {
    target = target.parentNode;
  }
  target.removeEventListener('click', editCommentFinish);
  const comment = getTargetNode(target);
  const currentComment = comment.querySelector('.comment-text');
  const input = comment.querySelector('input');
  currentComment.innerText = input.value;
  try {
    const res = await fetch(`/api/comments/${comment.dataset.id}/edit`, {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/json',
      },
      body: JSON.stringify({
        text: input.value,
      }),
    });
    if (res.status === 200) {
      input.remove();
      currentComment.setAttribute('style', 'display: inline');
      target.querySelector('span').innerText = 'edit_note';
      target.addEventListener('click', editComment);
      comment.querySelector('.comment-delete').style = 'display:inline-block';
    }
  } catch (err) {
    console.log(err);
    comment.querySelector('.comment-delete').disabled = false;
  }
};
const deleteComment = async (event) => {
  event.preventDefault();
  const { target } = event;
  const comment = getTargetNode(target);
  try {
    const res = await fetch(
      `/api/videos/${videoContainer.dataset.id}/delete-comment`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'Application/json',
        },
        body: JSON.stringify({
          _id: comment.dataset.id,
        }),
      }
    );
    console.log(res);
    if (res.status === 200) comment.remove();
  } catch (err) {
    console.log(err);
  }
};

class FakeComment {
  $writer;
  $id;
  $text;
  constructor($writer, $id, $text) {
    this.$writer = $writer;
    this.$id = $id;
    this.$text = $text;
  }
  template() {
    return `<div class="comment__comment" data-id="${this.$id}">
      <a href="/users/${this.$writer}">
        <img src="/static/images/comment.svg" alt='new comment' class="avatar avatar-small" />
      </a>
      <span class="comment-text">${this.$text}</span>
      <div class="comment__buttons">
        <button class="comment-edit">
          <span class="material-icons material-icons-outlined">edit_note</span>
        </button>  
        <button class="comment-delete">
          <span class="material-icons material-icons-outlined">clear</span>
        </button>
      </div>
    </div>`;
  }
  create() {
    const comment = document.createElement('div');
    comment.className = 'fakeComment';
    comment.innerHTML = this.template();
    comment
      .querySelector('.comment-edit')
      .addEventListener('click', editComment);
    comment
      .querySelector('.comment-delete')
      .addEventListener('click', deleteComment);
    return comment;
  }
}
const addNewComment = async (event) => {
  event.preventDefault();
  const vidId = videoContainer.dataset.id;
  const text = form.querySelector('input').value;
  try {
    const res = await fetch(`/api/videos/${vidId}/new-comment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'Application/json',
      },
      body: JSON.stringify({
        text,
      }),
    });
    if (res.status === 201) {
      const { writer, id } = await res.json();
      const comment = new FakeComment(writer, id, text);
      comments.prepend(comment.create());
    }
  } catch (err) {
    console.log(err);
  }
};

form.addEventListener('submit', addNewComment);

(() => {
  comments
    .querySelectorAll('.comment-edit')
    .forEach((btn) => btn.addEventListener('click', editComment));
  comments
    .querySelectorAll('.comment-delete')
    .forEach((btn) => btn.addEventListener('click', deleteComment));
  comments
    .querySelectorAll('.comment-like')
    .forEach((btn) => btn.addEventListener('click', likeComment));
  comments
    .querySelectorAll('.comment-dislike')
    .forEach((btn) => btn.addEventListener('click', dislikeComment));
})();
