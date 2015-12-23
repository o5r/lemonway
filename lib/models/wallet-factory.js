'use strict';

var _ = require('lodash');
var utils = require('../utils');

function WalletFactory (client) {
  this._client = client;
}

WalletFactory.prototype.register = function (opts) {
  return this._client.registerWallet(opts);
};

WalletFactory.prototype.update = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._client.updateWallet(opts);
};

WalletFactory.prototype.updateStatus = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._client.updateWalletStatus(opts);
};

WalletFactory.prototype.get = WalletFactory.prototype.getDetails = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._client.getWalletDetails(opts);
};

WalletFactory.prototype.list = WalletFactory.prototype.getBalances = function (_opts) {
  var opts = _.assign({}, _opts, {
    updateDate: utils.dateToUnix(_opts.updateDate)
  });

  return this._client.getBalances(opts);
};

WalletFactory.prototype.moneyIn = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._client.moneyIn(opts);
};

WalletFactory.prototype.moneyIn3DInit = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._client.moneyIn3DInit(opts);
};

WalletFactory.prototype.moneyIn3DConfirm = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._client.moneyIn3DConfirm(opts);
};

WalletFactory.prototype.moneyInWebInit = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._client.moneyInWebInit(opts);
};

WalletFactory.prototype.registerCard = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._client.registerCard(opts);
};

WalletFactory.prototype.unregisterCard = function (wallet, card, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet,
    cardId: card.id ? card.id : card
  });

  return this._client.registerCard(opts);
};

WalletFactory.prototype.sendPayment = function (debitedWallet, creditedWallet, _opts) {
  var opts = _.assign({}, _opts, {
    debitWallet: debitedWallet.id ? debitedWallet.id : debitedWallet,
    creditWallet: creditedWallet.id ? creditedWallet.id : creditedWallet
  });

  console.log('send payment', opts);

  return this._client.sendPayment(opts);
};

module.exports = WalletFactory;