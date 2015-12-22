'use strict';

var Client = require('../client');

function Model (client) {
  Object.defineProperty(this, '_client', { value: client });
}

module.exports = Model;