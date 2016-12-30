'use strict';

/* eslint-disable new-cap, no-console, prefer-const, max-len*/

const bcrypt = require('bcrypt-as-promised');
const boom = require('boom');
const ev = require('express-validation');
const express = require('express');
const jwt = require('jsonwebtoken');
const knex = require('../knex');
const validations = require('../validations/recipients');
const { camelizeKeys, decamelizeKeys } = require('humps');


const router = express.Router();

const authorize = function(req, res, next) {
  const token = req.cookies.token;
  console.log('recipient token: ', token);

  jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
    if (err) {
      return next(boom.create(401, 'Unauthorized'));
    }

    req.token = decoded;

    next();
  });
};

router.get('/api/recipients', authorize, (req, res, next) => {
  const userId = req.token.userId;
  console.log(userid);

  knex('recipients')
    .select('id')
    // .where('id', req.params.id)
    .where('user_id', userId)
    .then((recipients) => {
      const idArray = [];

      for (const id of recipientIds) {
        idArray.push(id);
      }

      return knex('recipients').select('first_name', 'last_name', 'id').whereIn('id', idArray);
    })
    .then((recipientsList) => {
      res.send(recipientsList);
    })
    .catch((err) => {
      console.log(err);
      next(err);
    });
});

// router.get('/recipients', (_req, res, next) => {
//   knex('recipients')
//     .orderBy('user_id')
//     .then((rows) => {
//       const recipient = camelizeKeys(rows);
//
//       res.send(recipient);
//     })
//     .catch((err) => {
//       console.log(err);
//       next(err);
//     });
// });

router.post('/recipients', ev(validations.post), (req, res, next) => {
  const {userId, firstName, lastName, addressLineOne, addressLineTwo, addressCity, addressState, addressZip, birthday, note} = req.body;
  const insertRecipient = {userId, firstName, lastName, addressLineOne, addressLineTwo, addressCity, addressState, addressZip, birthday, note};

  knex('recipients')
    .insert(decamelizeKeys(insertRecipient), '*')
    .then((rows) => {
      const recipient = camelizeKeys(rows[0]);

      res.send(recipient);
    })
    .catch((err) => {
      next(err);
    });
});

router.patch('/recipients/:id', (req, res, next) => {
  knex('recipients')
    .where('id', req.params.id)
    .first()
    .then((recipient) => {
      if (!recipient) {
        throw boom.create(404, 'Not Found');
      }

      const {userId, firstName, lastName, addressLineOne, addressLineTwo, addressCity, addressState, addressZip, birthday, note} = req.body;
      const updateRecipient = {};

      if (userId) {
        updateRecipient.userId = userId;
      }

      if (firstName) {
        updateRecipient.firstName = firstName;
      }

      if (lastName) {
        updateRecipient.lastName = lastName;
      }

      if (addressLineOne) {
        updateRecipient.addressLineOne = addressLineOne;
      }

      if (addressLineTwo) {
        updateRecipient.addressLineTwo = addressLineTwo;
      }

      if (addressCity) {
        updateRecipient.addressCity = addressCity;
      }

      if (addressState) {
        updateRecipient.addressState = addressState;
      }

      if (addressZip) {
        updateRecipient.addressZip = addressZip;
      }

      if (birthday) {
        updateRecipient.birthday = birthday;
      }

      if (note) {
        updateRecipient.note = note;
      }

      return knex('recipients')
        .update(decamelizeKeys(updateRecipient), '*')
        .where('id', req.params.id);
    })
    .then((rows) => {
      const recipient = camelizeKeys(rows[0]);

      res.send(recipient);
    })
    .catch((err) => {
      next(err);
    });
});

router.delete('/recipients/:id', (req, res, next) => {
  let recipient;

  knex('recipients')
    .where('id', req.params.id)
    .first()
    .then((row) => {
      if (!row) {
        throw boom.create(404, 'Not Found');
      }

      recipient = camelizeKeys(row);

      return knex('recipients')
        .del()
        .where('id', req.params.id);
    })
    .then(() => {
      delete recipient.id;

      res.send(recipient);
    })
    .catch((err) => {
      next(err);
    });
});

module.exports = router;
