'use strict';

var _ = require('lodash');

var Client = require('./client');
var WalletFactory = require('./factories/wallet-factory');
var Transaction = require('./models/transaction');
var constants = require('./constants');

function Lemonway (login, pass, endpoint) {
  this._client = new Client(login, pass, endpoint);
  this.Wallet = new WalletFactory(this);
}

Lemonway.prototype.setClient = function (req) {
  this.ip = req.headers['x-forwarded-for'] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress ||
    req
  ;
  return this;
};

Lemonway.constants = constants;

module.exports = Lemonway;