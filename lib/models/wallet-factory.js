'use strict';

var _ = require('lodash');
var utils = require('../utils');

function WalletFactory (client) {
  this._client = client;
}

WalletFactory.prototype.register = function (opts) {
  return this._client.registerWallet(opts);
};

WalletFactory.prototype.update = function (id, _opts) {
  var opts = _.assign({}, _opts, { wallet: id });
  return this._client.updateWallet(opts);
};

WalletFactory.prototype.updateStatus = function (id, _opts) {
  var opts = _.assign({}, _opts, { wallet: id });
  return this._client.updateWalletStatus(opts);
};

WalletFactory.prototype.get = WalletFactory.prototype.getDetails = function (_opts) {
  return this._client.getWalletDetails({ wallet: _opts.id, email: _opts.email, walletIp: _opts.walletIp });
};

WalletFactory.prototype.list = WalletFactory.prototype.getBalances = function (_opts) {
  var opts = _.assign({}, _opts, {
    updateDate: utils.dateToUnix(_opts.updateDate)
  });

  return this._client.getBalances(opts);
};

WalletFactory.prototype.moneyIn = function (id, _opts) {
  var opts = _.assign({}, _opts, { wallet: id });
  return this._client.moneyIn(opts);
};

WalletFactory.prototype.moneyIn3DInit = function (id, _opts) {
  var opts = _.assign({}, _opts, { wallet: id });
  return this._client.moneyIn3DInit(opts);
};

WalletFactory.prototype.moneyIn3DConfirm = function (_opts) {
  var opts = _.assign({}, _opts);
  return this._client.moneyIn3DConfirm(opts);
};

WalletFactory.prototype.moneyInWebInit = function (_opts) {
  var opts = _.assign({}, _opts);
  return this._client.moneyInWebInit(opts);
};

module.exports = WalletFactory;