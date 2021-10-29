'use strict';

const path = require('path');
const { v4: uuidv4 } = require('uuid');

const uploadFile = (
  files,
  allowedExtensions = ['png', 'jpg', 'jpeg', 'gif'],
  directory = ''
) => {
  return new Promise((resolve, reject) => {
    const { file } = files;
    const cutName = file.name.split('.');
    const fileExtension = cutName[cutName.length - 1];

    // Validate extension
    if (!allowedExtensions.includes(fileExtension))
      return reject(`File not allowed: .${fileExtension} isn't allowed!`);

    // Upload files
    const fileName = uuidv4() + '.' + fileExtension;
    const uploadPath = path.join(
      __dirname,
      './../uploads/',
      directory,
      fileName
    );

    file.mv(uploadPath, err => {
      if (err) reject(err);

      resolve(fileName);
    });
  });
};

module.exports = {
  uploadFile,
};
