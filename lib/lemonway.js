'use strict';

var Client = require('./client');
var WalletFactory = require('./models/wallet-factory');
var constants = require('./constants');

function Lemonway (login, pass, endpoint, _opts) {
  this._client = new Client(login, pass, endpoint, _opts);
  this.Wallet = new WalletFactory(this._client);
}

Lemonway.constants = constants;

Lemonway.prototype.fastPay = function (_opts) {
  return this._client.fastPay(_opts);
};

module.exports = Lemonway;