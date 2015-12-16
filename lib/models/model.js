'use strict';

function Model (client) {
  Object.defineProperty(this, '_client', { value: client });
}

module.exports = Model;