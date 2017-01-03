'use strict';

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

router.get('/api/token', (req, res) => {
  const token = req.cookies.token;

  jwt.verify(token, process.env.JWT_SECRET, (err, _decoded) => {
    if (err) {

      return res.send(false);
    }

    res.send(true);
  });
});

router.post('/api/token', (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !username.trim()) {
    return next(boom.create(400, 'Username is incorrect'));
  }

  if (!password || password.length < 8) {
    return next(boom.create(400, 'Password is incorrect'));
  }
  let user;

  knex('users')
    .where('username', username)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(400, 'Bad username or password');
      }

      user = camelizeKeys(row);

      return bcrypt.compare(password, user.hashedPassword);
    })
    .then(() => {
      delete user.hashedPassword;

      const expiry = new Date(Date.now() + 1000 * 60 * 60 * 3); // 3 hours
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '3h'
      });

      user.token = token;
      res.send(user);
    })
    .catch(bcrypt.MISMATCH_ERROR, () => {
      throw boom.create(400, 'Bad username or password');
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.delete('/api/token', (req, res) => {
  res.clearCookie('token');
  res.send(true);
});

module.exports = router;
