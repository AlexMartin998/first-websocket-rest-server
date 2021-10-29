'use strict';

const btnLogOut = document.querySelector('.google-logout');
const loginForm = document.querySelector('.login-form');

var url = window.location.hostname.includes('localhost')
  ? 'http://localhost:3300/api/auth/'
  : 'https://first-basic-rest-server-alx.herokuapp.com/api/auth/';

function handleCredentialResponse(response) {
  // Google token / ID token:
  const body = { id_token: response.credential };

  fetch(url + 'google', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  })
    .then(resp => resp.json())
    .then(({ user, token }) => {
      localStorage.setItem('acces_token', token);
      localStorage.setItem('email', user.mail);

      window.location = 'chat.html';
      // localStorage.setItem('mail', 'NO REMOVE IT');
    })
    .catch(console.warn);
}

btnLogOut.addEventListener('click', e => {
  console.log(google.accounts.id);
  google.accounts.id.disableAutoSelect();
  google.accounts.id.revoke(localStorage.getItem('email'), done => {
    // localStorage.clear();
    localStorage.removeItem('email');
    localStorage.removeItem('acces_token');
    location.reload();
  });
});

// DOM: Event handler
loginForm.addEventListener('submit', e => {
  e.preventDefault();

  const dataArr = [...new FormData(loginForm)];
  const data = Object.fromEntries(dataArr);
  if (!data.mail || !data.password) return;

  fetch(url + 'login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })
    .then(resp => resp.json())
    .then(({ token, msg }) => {
      console.log(token);
      console.log(msg);

      localStorage.setItem('acces_token', token);
      window.location = 'chat.html';
    })
    .catch(console.warn);
});
