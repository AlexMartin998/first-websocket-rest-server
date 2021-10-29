'use strict';

const { response, request } = require('express');
const bcryptjs = require('bcryptjs');
const User = require('../models/user.model.db');
const { generateJST } = require('../helpers/generate-jwt');
const { googleVerify } = require('../helpers/google-verify');

const login = async (req = request, res = response) => {
  try {
    const { mail, password } = req.body;
    const user = await User.findOne({ mail });

    // Check if user exist <- Ya lo hice en el route

    // Check if user is active on DB
    if (!user.state)
      return res.status(400).json({ msg: "User doesn't exist!" });

    // Chek password
    const validPassword = bcryptjs.compareSync(password, user.password);
    if (!validPassword)
      return res.status(400).json({ msg: 'Password is not correct!' });

    // Generate JWT
    const token = await generateJST(user._id);

    res.json({
      msg: 'Login ok',
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: 'Something went wrong!' });
  }
};

const googleSignIn = async (req = request, res = response) => {
  const { id_token } = req.body;

  try {
    const { name, img, mail } = await googleVerify(id_token);

    let user = await User.findOne({ mail });

    if (!user) {
      const data = {
        name,
        mail,
        password: ':P',
        img,
        google: true,
      };

      user = new User(data);

      await user.save();
    }

    // User state: false in own DB
    if (!user.state)
      return res.status(401).json({ msg: 'User blocked, talk to admin' });

    const token = await generateJST(user.id);

    res.json({
      msg: 'OK papu',
      // id_token,
      user,
      token,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({ ok: false, msg: 'Token could not be verified.' });
  }
};

const renewToken = async (req, res = response) => {
  const user = req.authenticatedUser;

  // Generate JWT
  const token = await generateJST(user._id);

  res.status(200).json({
    user,
    token,
  });
};

module.exports = {
  login,
  googleSignIn,
  renewToken,
};
