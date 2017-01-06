'use strict';

const joi = require('Joi');

module.exports.post = {
  body: {
    firstName: joi.string()
      .label('First Name')
      .required()
      .trim(),
    lastName: joi.string()
      .label('Last Name')
      .required()
      .trim(),
    addressLineOne: joi.string()
      .label('Address Line One')
      .optional()
      .trim(),
    addressLineTwo: joi.string()
      .label('Address Line Two')
      .optional()
      .trim(),
    addressCity: joi.string()
      .label('City')
      .optional()
      .trim(),
    addressState: joi.string()
      .label('State')
      .optional()
      .trim(),
    addressZip: joi.string()
      .label('Zip')
      .optional()
      .trim(),
    birthday: joi.string()
      .label('Birthday')
      .optional()
      .trim(),
    note: joi.string()
      .label('Note')
      .optional()
      .trim()
  }
};
