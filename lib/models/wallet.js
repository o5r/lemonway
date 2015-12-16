'use strict';

var _ = require('lodash');

var Model = require('./model');
var constants = require('../constants');

function Wallet (client, data) {
  Model.call(this, client);

  this.id = data.ID;
  this.bal = data.BAL;
  this.name = data.NAME;
  this.email = data.EMAIL;
  this.status = data.STATUS;
}

Wallet.prototype = _.create(Model.prototype, {
  'constructor': Wallet
});

Wallet.prototype.update = function (_opts) {
  var opts = _.assign({}, _opts, { wallet: this.id });
  return this._client.updateWallet(opts);
};

Wallet.prototype.updateStatus = function (_opts) {
  var opts = _.assign({}, _opts, { wallet: this.id });
  return this._client.updateWalletStatus(opts);
};

Wallet.prototype.close = function (_opts) {
  var opts = _.assign({}, _opts, { newStatus: constants.WALLET_STATUS.CLOSED });
  return this.updateStatus(opts);
};

Wallet.prototype.reload = Wallet.prototype.getDetails = function (_opts) {
  var opts = _.assign({}, _opts, { wallet: this.id });
  return this._client.getWalletDetails(opts);
};

Wallet.prototype.moneyIn = function (_opts) {
  var opts = _.assign({}, _opts, { wallet: this.id });
  return this._client.moneyIn(opts);
};

Wallet.prototype.moneyIn3DInit = function (_opts) {
  var opts = _.assign({}, _opts, { wallet: this.id });
  return this._client.moneyIn3DInit(opts);
};

Wallet.prototype.registerCard = function (_opts) {
  var opts = _.assign({}, _opts, { wallet: this.id });
  return this._client.registerCard(opts);
};

Wallet.prototype.unregisterCard = function (_opts) {
  var opts = _.assign({}, _opts, { wallet: this.id });
  return this._client.unregisterCard(opts);
};

module.exports = Wallet;