'use strict';

var lodash = require('lodash');
var utils = require('util');
var Bluebird = require('bluebird');

function Transaction (id) {
  this.id = id;
}

Transaction.extendPromise = function (promise) {
  return promise;
};

function Wallet (id) {
  this.id = id;
}

Wallet.extendPromise = function (promise) {
  promise.withdraw = function (amount) {
    return promise.then(function (wallet) {
      var transaction = withdrawWallet(wallet.id, amount);
      return Transaction.extendPromise(transaction);
    });
  };
  return promise;
};

function getPic (param) {
  return new Bluebird(function (resolve) {
    return resolve(new Wallet(param));
  });
}

function withdrawWallet (id, amount) {
  return new Bluebird(function (resolve) {
    return resolve(new Transaction(2));
  });
}

function WalletFactory () {}

WalletFactory.prototype.withdraw = function (amount) {
  return Transaction.extendPromise(withdrawWallet(this.id, amount));
};

WalletFactory.prototype.get = function (param) {
  return Wallet.extendPromise(getPic(param));
};

var wallet = new WalletFactory();

wallet.get(42).withdraw(42).then(function (transaction) {
  console.log(transaction);
});

wallet.get(42).then(function (wallet) {
  console.log(wallet);
});