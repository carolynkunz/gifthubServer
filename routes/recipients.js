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

router.post('/recipients', (req, res, next) => {
  let {}

});

module.exports = router;
