'use strict';

var Client = require('../client');

function Model (client) {
  if (client instanceof Client) {
    Object.defineProperty(this, '_client', { value: client });
  }
}

module.exports = Model;