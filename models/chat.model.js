'use strict';

class Message {
  constructor(uid, name, message) {
    this.uid = uid;
    this.name = name;
    this.message = message;
  }
}

class ChatMessages {
  constructor() {
    this.message = [];
    this.privateMsg = [];
    this.users = {
      // 'uid':{}
    };
  }

  get lastTen() {
    this.message = this.message.splice(0, 10);
    return this.message;
  }

  get lastTenPrivateMsg() {
    this.privateMsg = this.privateMsg.splice(0, 10);
    return this.privateMsg;
  }

  get userArr() {
    return Object.values(this.users);
  }

  sendMessage(uid, name, message) {
    this.message.unshift(new Message(uid, name, message));
  }

  sendPrivateMsg(uid, name, message) {
    this.privateMsg.unshift(new Message(uid, name, message));
  }

  connectUser(user) {
    this.users[user.id] = user;
  }

  logOutUser(id) {
    delete this.users[id];
  }
}

module.exports = new ChatMessages();
