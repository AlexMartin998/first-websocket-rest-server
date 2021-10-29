'use strict';

const { checkToken } = require('../helpers');
const chatModel = require('../models/chat.model.js');

const socketController = async (socket, io) => {
  // console.log(socket.handshake.headers['x-token']);

  const user = await checkToken(socket.handshake.headers['x-token']);
  if (!user) return socket.disconnect();

  // Add user connected
  chatModel.connectUser(user);
  io.emit('user-connected', chatModel.userArr);
  socket.emit('recive-message', chatModel.lastTen); // El q se conecte reciba todos los chats

  // Connect to special room
  socket.join(user.id); // Global, socket.id, user.id

  // Log Out user
  socket.on('disconnect', () => {
    chatModel.logOutUser(user.id);
    io.emit('user-connected', chatModel.userArr);
  });

  // Listen message
  socket.on('send-message', ({ uid, message }) => {
    if (uid) {
      // Private msg
      if (uid === user.id) return;

      // Necesitariamos pantallas diferentes, como enuna app real. X c/u se habre una ventana
      // chatModel.sendPrivateMsg(user.id, user.name, message);

      socket.to(uid).emit('private-message', { name: user.name, message });
    } else {
      chatModel.sendMessage(user.id, user.name, message);
      io.emit('recive-message', chatModel.lastTen);
    }
  });
};

module.exports = {
  socketController,
};
