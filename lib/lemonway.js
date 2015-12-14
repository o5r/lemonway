'use strict';

var Client = require('./client');

function Lemonway (login, pass, endpoint, _opts) {
  this._client = new Client(login, pass, endpoint, _opts);
}

module.exports = Lemonway;