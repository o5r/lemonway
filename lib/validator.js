'use strict';

var Promise = require('bluebird');
var Joi = require('joi');

var _validate = Promise.promisify(Joi.validate, { context: Joi });

function validate (value, schema) {
  return _validate(value, schema, {
    abortEarly: false,
    stripUnknown: true
  });
}

module.exports = validate;