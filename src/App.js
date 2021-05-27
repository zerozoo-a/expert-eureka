import { userInfo } from './userInfo.js';

let comments = [];
let commentsCnt = 0;
let times = [];
const restrictWords = {
  kr: ['바보', '해삼', '말미잘', '도지코인'],
  eu: ['nerd', 'LaLaLa Love Song', 'dodgeCoin'],
  isRestricted: false,
};

// const askLogin = () => {
//   //   userInfo;
//   //   console.log('haha');
//   alert('haha');
// };
function askLogin() {
  userInfo();
}

const restrictSpam = () => {
  const waitSeconds = () => {
    return new Promise((res) => {
      setTimeout(() => {
        res('lock');
      }, 1000);
    });
  };
  const getWait = async () => {
    const result = await waitSeconds();
    document.getElementById('comment').disabled = false;
    document.getElementById('comment').focus();
  };
  const firstCommentTime = new Date();
  times.push(firstCommentTime);
  if (commentsCnt < 1) {
    return;
  }
  if (times[commentsCnt] - times[commentsCnt - 1] < 1100) {
    document.getElementById('comment').disabled = true;
    getWait();
    return;
  }
};
const restrictWord = (comment) => {
  comment = comment.toLowerCase();
  if (comment.slice(-1) === ' ') comment = comment.slice(0, comment.length - 1);
  if (comment.charAt(0) === ' ') comment = comment.slice(1, comment.length);
  const kr = restrictWords.kr;
  let eu = restrictWords.eu;
  eu = eu.map((v) => v.toLowerCase());
  let filteredComment = kr.filter((word) => word.includes(comment));
  filteredComment.push(eu.filter((word) => word.includes(comment)));
  filteredComment = filteredComment.flat();
  restrictWords.isRestricted = false;

  if (filteredComment.length > 0 && filteredComment.join() === comment) {
    alert(`${comment}는 제한된 단어입니다.`);
    restrictWords.isRestricted = true;
    return;
  }
};

document.getElementById('comment').focus();
const getComment = (event) => {
  event.preventDefault();

  restrictWord(document.querySelector('#comment').value);
  if (restrictWords.isRestricted) return;

  restrictWords.isRestricted = false;

  restrictSpam();
  comments.push(document.querySelector('#comment').value);
  document.querySelector('#comment').value = '';
  setComment(comments);
  makeDeleteBtn();
  makeModifyBtn(comments);
};

const setComment = (comments) => {
  const list = document.createElement('li');
  const div = document.createElement('div');
  div.innerText = comments[comments.length - 1];
  list.id = ++commentsCnt;
  div.id = commentsCnt + 'comment';
  document.querySelector('#showList').appendChild(list);
  document.getElementById(commentsCnt).appendChild(div);
};

const makeDeleteBtn = () => {
  const id = commentsCnt;
  const deleteBtn = document.createElement('button');
  deleteBtn.innerHTML = 'X';
  deleteBtn.onclick = () => {
    if (window.confirm('댓글을 지우시겠습니까?')) {
      if (document.getElementById(id + 'modifyBtn').innerHTML === '취소') {
        document.getElementById(id + 'modifyForm').remove();
      }
      document.getElementById(id).remove();
    }
  };
  document.getElementById(id).appendChild(deleteBtn);
};

const makeModifyBtn = (comments) => {
  const id = commentsCnt;
  const modifyBtn = document.createElement('button');
  modifyBtn.id = id + 'modifyBtn';
  modifyBtn.innerHTML = '수정';
  modifyBtn.onclick = () => {
    if (modifyBtn.innerHTML === '수정') {
      modifyBtn.innerHTML = '취소';

      console.log(comments);
      comments.map((v, i) => {
        if (parseInt(i + 1) === id) {
          return;
        } else if (
          document
            .getElementById('showList')
            .contains(document.getElementById(i + 1 + 'modifyBtn'))
        ) {
          document.getElementById(i + 1 + 'modifyBtn').innerHTML = '수정';
        } else {
          return;
        }
      });

      const modifyInputComment = document.createElement('input');
      modifyInputComment.id = id + 'modify';
      modifyInputComment.setAttribute('type', 'text');
      modifyInputComment.setAttribute('value', comments[id - 1]);

      const modifySubmitBtn = document.createElement('button');
      modifySubmitBtn.id = id + 'modifySubmit';
      modifySubmitBtn.innerHTML = '등록';

      const modifyForm = document.createElement('form');
      modifyForm.id = id + 'modifyForm';
      modifyForm.appendChild(modifyInputComment);
      modifyForm.appendChild(modifySubmitBtn);
      document.getElementById(id).insertAdjacentElement('afterend', modifyForm);

      const modifySubmitBtnFnc = () => {
        modifyBtn.innerHTML = '수정';
        const modifiedValue = document.getElementById(id + 'modify').value;
        console.log(comments[id - 1]);
        comments[id - 1] = modifiedValue;

        document.getElementById(id + 'comment').innerText = modifiedValue;
        document.getElementById(id + 'modifyForm').remove();
        document.getElementById('comment').focus();
      };

      modifySubmitBtn.onclick = (e) => {
        e.preventDefault();
        modifySubmitBtnFnc();
      };

      comments.map((v, i) => {
        if (parseInt(i + 1) === id) {
          return;
        }
        if (
          document
            .getElementById('showList')
            .contains(document.getElementById(i + 1 + 'modify'))
        ) {
          document.getElementById(i + 1 + 'modifyForm').remove();
        }
      });

      document.getElementById(id + 'modify').focus();
    } else {
      document.getElementById(id + 'modifyForm').remove();
      modifyBtn.innerHTML = '수정';
    }
  };
  document.getElementById(id).appendChild(modifyBtn);
};
