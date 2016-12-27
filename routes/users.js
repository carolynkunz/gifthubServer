'use strict';

/* eslint-disable new-cap, no-console, prefer-const, max-len*/

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const { camelizeKeys, decamelizeKeys } = require('humps');

// eslint-disable-next-line new-cap
const router = express.Router();

router.post('/api/users', (req, res, next) => {
  let { firstName, lastName, email, username, password } = req.body;

  console.log(req.body);

  if (!firstName || !firstName.trim()) {
    return next(boom.create(400, 'First Name must not be blank'));
  }

  if (!lastName || !lastName.trim()) {
    return next(boom.create(400, 'First Name must not be blank'));
  }

  if (!email || !email.trim()) {
    return next(boom.create(400, 'Email must not be blank'));
  }

  if (!username || !username.trim()) {
    return next(boom.create(400, 'Username must not be blank'));
  }

  if (!password || password.length < 8) {
    return next(boom.create(
      400,
      'Password must be at least 8 characters long'
    ));
  }

  knex('users')
    .where('username', username)
    .first()
    .then((exists) => {
      if (exists) {
        throw boom.create(400, 'Username already exists');
      }
      console.log(username, password);
      return bcrypt.hash(password, 12);
    })
    .then((hashedPassword) => {
      firstName = firstName.toLowerCase();
      lastName = lastName.toLowerCase();
      email = email.toLowerCase();
      username = username.toLowerCase();
      const insertUser = { firstName, lastName, email, hashedPassword, username };

      return knex('users')
        .insert(decamelizeKeys(insertUser), '*');
    })
    .then((rows) => {
      const user = camelizeKeys(rows[0]);

      delete user.hashedPassword;

      const expiry = new Date(Date.now() + 1000 * 60 * 60 * 3); // 3 hours
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
        expiresIn: '3h'
      });

      res.cookie('token', token, {
        httpOnly: true,
        expires: expiry,
        secure: router.get('env') === 'production'
      });

      res.send(user);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

router.get('/api/users', (_req, res, next) => {
  knex('users')
    .orderBy('id')
    .then((rows) => {
      const users = camelizeKeys(rows);

     res.send(users);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

// router.get('/api/users/:id', (req, res, next) => {
//   const id = Number.parseInt(req.params.id);
//
//   if (Number.isNaN(id)) {
//     return next();
//   }
//
//   knex('users')
//   .where('id', req.params.id)
//   .first()
//   .then((row) => {
//     if (!row) {
//       throw boom.create(404, 'Not Found');
//     }
//
//     const user = camelizeKeys(row);
//
//     res.send(user);
//   })
//   .catch((err) => {
//     next(err);
//   });
// });

router.get('/api/users/:username', (req, res, next) => {
  console.log(req.params.username);
    knex('users')
    .where('username', req.params.username)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Not Found');
      }
      const user = camelizeKeys(row);

      res.send(user);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
