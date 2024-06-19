'use strict';

function validate (value, schema) {
  return schema.validateAsync(value, {
    abortEarly: false,
    stripUnknown: true
  });
}

module.exports = validate;
