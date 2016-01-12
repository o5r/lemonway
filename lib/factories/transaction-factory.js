'use strict';

var _ = require('lodash');
var utils = require('../utils');
var MoneyIn = require('../models/money-in');

function TransactionFactory (lemonway) {
  var factory = this;
  this._lemonway = lemonway;

  this.Transaction = function Transaction (data) {
    this._factory = factory;
    this._lemonway = lemonway;

    this.id = data.ID;
    this.cardAlias = data.MLABEL;
    this.date = new Date(data.DATE);
    this.creditedWalletId = data.REC;
    this.amount = data.CRED;
    this.commission = data.COM;
    this.comment = data.MSG;
    this.status = data.STATUS;
    this.is3DS = !!_.get(data, 'EXTRA.IS3DS');
    this.cardCountry = _.get(data, 'EXTRA.CTRY');
    this.authorizationNumber = _.get(data, 'EXTRA.AUTH');
  };

  this.Transaction.extendTransactionPromise = utils.extendPromise([
    'moneyIn3DConfirm', 'moneyIn3DAuthenticate', 'moneyInValidate'
  ]);

  this.Transaction.prototype.moneyIn3DConfirm = function (_opts) {
    var opts = _.assign({}, _opts);
    return this._factory.moneyIn3DConfirm(this, opts);
  };

  this.Transaction.prototype.moneyIn3DAuthenticate = function (_opts) {
    var opts = _.assign({}, _opts);
    return this._factory.moneyIn3DAuthenticate(this, opts);
  };

  this.Transaction.prototype.moneyInValidate = function (_opts) {
    var opts = _.assign({}, _opts);
    return this._factory.moneyInValidate(this, opts);
  };
}

TransactionFactory.prototype.moneyIn3DConfirm = function (transaction, _opts) {
  var opts = _.assign({}, {
    transactionId: transaction.id ? transaction.id : transaction
  }, _opts);

  var transactionPromise = this._lemonway._client.moneyIn3DConfirm(opts)
    .bind(this)
    .then(function (data) {
      return new this.Transaction(data);
    });

  return this.Transaction.extendTransactionPromise(transactionPromise);
};

TransactionFactory.prototype.moneyIn3DAuthenticate = function (transaction, _opts) {
  var opts = _.assign({}, {
    transactionId: transaction.id ? transaction.id : transaction
  }, _opts);

  return this._lemonway._client.moneyIn3DAuthenticate(opts)
    .then(function (data) {
      return new MoneyIn(data);
    });
};

TransactionFactory.prototype.moneyInValidate = function (transaction, _opts) {
  var opts = _.assign({}, {
    transactionId: transaction.id ? transaction.id : transaction
  }, _opts);

  var transactionPromise = this._lemonway._client.moneyInValidate(opts)
    .bind(this)
    .then(function (data) {
      return new this.Transaction(data);
    });

  return this.Transaction.extendTransactionPromise(transactionPromise);
};

TransactionFactory.prototype.GetMoneyInIBANDetails = function (_opts) {
  var opts = _.assign({
    from: _opts.from || 0
  }, _opts);

  return this._lemonway._client.GetMoneyInIBANDetails(opts)
    .then(function (data) {
      return _.get(data, 'HPAY', []);
    }).map(function (data) {
      return new this.Transaction(data);
    });
};

module.exports = TransactionFactory;