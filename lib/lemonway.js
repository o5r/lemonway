'use strict';

var _ = require('lodash');

var Client = require('./client');
var WalletFactory = require('./models/wallet-factory');
var Transaction = require('./models/transaction');
var constants = require('./constants');

function Lemonway (login, pass, endpoint, _opts) {
  this._client = new Client(login, pass, endpoint, _opts);
  this.Wallet = new WalletFactory(this._client);
  this.Transaction = {
    Payment: {
      get: function (id, _opts) {
        return this._client.getPaymentDetails(_.assign({}, _opts, {
          transactionId: id
        }));
      }.bind(this)
    },
    MoneyIn: {
      get: function (id, _opts) {
        return this._client.getMoneyInTransDetails(_.assign({}, _opts, {
          transactionId: id
        }));
      }.bind(this)
    },
    MoneyOut: {
      get: function () {
        return this._client.getMoneyOutTransDetails(_.assign({}, _opts, {
          transactionId: id
        }));
      }.bind(this)
    }
  };
}

Lemonway.constants = constants;

Lemonway.prototype.fastPay = function (_opts) {
  return this._client.fastPay(_opts);
};

Lemonway.prototype.getWizypayAds = function (_opts) {
  return this._client.getWizypayAds(_opts);
};

Lemonway.prototype.moneyInValidate = function (transaction, _opts) {
  var opts = _.assign({}, _opts, {
    transactionId: transaction.id ? transaction.id : transaction
  });

  return this._client.moneyInValidate(opts);
};

Lemonway.prototype.getKycStatus = function (_opts) {
  return this._client.getKycStatus(_opts);
};

Lemonway.prototype.getMoneyInIBANDetails = function (_opts) {
  return this._client.getMoneyInIBANDetails(_opts);
};

module.exports = Lemonway;