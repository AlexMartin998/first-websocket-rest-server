'use strict';

const express = require('express');
const cors = require('cors');
const fileUpload = require('express-fileupload');
const { createServer } = require('http');

const { PORT } = require('../config');
const {
  usersRoutes,
  authLoginRoutes,
  categoriesRouter,
  productsRouter,
  searchRouter,
  uploadRouter,
} = require('../routes');
const { dbConnection } = require('../db/config.db.js');
const { socketController } = require('../sockets/socket.controller');

class Server {
  constructor() {
    this.app = express();
    this.port = PORT;

    this.paths = {
      auth: '/api/auth',
      categories: '/api/categories',
      users: '/api/users',
      products: '/api/products',
      search: '/api/search',
      uploads: '/api/uploads',
    };

    // Socket.io
    this.server = createServer(this.app);
    this.io = require('socket.io')(this.server);

    // Connect to DB
    this.connectToDB();

    // Middlerares
    this.middlewares();

    // Routes
    this.routes();

    // Sockets
    this.sockets();
  }

  async connectToDB() {
    await dbConnection();
  }

  middlewares() {
    // Cors
    this.app.use(cors());

    // Reading and parsing the body
    this.app.use(express.json());

    // Static directory
    this.app.use(express.static('public'));

    // Upload file
    this.app.use(
      fileUpload({
        useTempFiles: true,
        tempFileDir: '/tmp/',
        createParentPath: true,
      })
    );
  }

  routes() {
    this.app.use(this.paths.auth, authLoginRoutes);
    this.app.use(this.paths.users, usersRoutes);
    this.app.use(this.paths.categories, categoriesRouter);
    this.app.use(this.paths.products, productsRouter);
    this.app.use(this.paths.search, searchRouter);
    this.app.use(this.paths.uploads, uploadRouter);
  }

  sockets() {
    this.io.on('connection', socket => socketController(socket, this.io));
  }

  listenServer() {
    this.app.listen(this.port, () => {
      console.log(`Server on port ${this.port}`);
    });
  }

  listenSocketIo() {
    this.server.listen(this.port, () => {
      console.log(`Server on port ${this.port}`);
    });
  }
}

module.exports = new Server();
