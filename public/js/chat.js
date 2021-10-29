'use strict';

// DOM Elements:
const txtUid = document.querySelector('#txtUid'),
  txtMessage = document.querySelector('#txtMessage'),
  userList = document.querySelector('.user-list'),
  chatList = document.querySelector('.chat-list'),
  btnLogOutManual = document.querySelector('.btn-logout-login'),
  sendMesgForm = document.querySelector('.send-message-form'),
  privateChatList = document.querySelector('.private-chat-list');

const url = window.location.hostname.includes('localhost')
  ? 'http://localhost:3300/api/auth/'
  : 'https://first-basic-rest-server-alx.herokuapp.com/api/auth/';

let user, socket;

// Validate localstorage token
const validateJWT = async () => {
  const token = localStorage.getItem('acces_token') || '';

  if (token.length <= 10) {
    window.location = 'index.html';

    throw new Error(`There isn't any token`);
  }

  const resp = await fetch(url, {
    headers: {
      'x-token': token,
    },
  });

  const { user: userDB, token: tokenDB } = await resp.json();

  // Renew token
  localStorage.setItem('acces_token', tokenDB);
  user = userDB;
  document.title = user.name;

  await connectSocket();
};

const connectSocket = async () => {
  socket = io({
    extraHeaders: {
      'x-token': localStorage.getItem('acces_token'),
    },
  });

  socket.on('connect', () => {
    console.log(`Socket Online`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket Offline`);
  });

  socket.on('recive-message', payload => {
    let msgLiHtml = '';

    payload.forEach(({ name, message }) => {
      msgLiHtml += `
        <li>
          <p>
            <h5 class="text-primary font-weight-bold">${name}</h5>
            <span class="fs-6 text-muted" >${message}</span>
          </p>
       </li>
      `;
    });

    chatList.innerHTML = msgLiHtml;
  });

  socket.on('user-connected', payload => {
    // console.log('payload: ', payload);
    displayUsers(payload);
  });

  socket.on('private-message', payload => {
    console.log(payload);
  });
};

const main = async () => {
  // Validate JWT
  await validateJWT();
};

const displayUsers = (users = []) => {
  let userLi = '';

  users.forEach(({ name, uid }) => {
    userLi += `
      <li>
        <p>
          <h5 class="text-success">${name}</h5>
          <span class="fs-6 text-muted" >${uid}</span>
        </p>
      </li>
    
    `;
  });

  userList.innerHTML = userLi;
};

main();

// // DOM: Event Handler
const clearFields = (...fields) => {
  fields.forEach(field => (field.value = ''));
};

sendMesgForm.addEventListener('submit', e => {
  e.preventDefault();

  const message = txtMessage.value.trim(),
    uid = txtUid.value.trim();
  if (!message) return;

  socket.emit('send-message', { uid, message });
  clearFields(txtMessage, txtUid);
});
