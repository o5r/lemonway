'use strict';

var _ = require('lodash');
var utils = require('../utils');
var MoneyIn = require('../models/money-in');
var errors = require('../errors');
var moment = require('moment');

function TransactionFactory (lemonway) {
  var factory = this;

  this.Transaction = function Transaction (data) {
    this.id = _.get(data, 'ID');
    this.cardAlias = this.iban = _.get(data, 'MLABEL');
    this.date = _.get(data, 'DATE') ? moment(_.get(data, 'DATE'), 'DD/MM/YYYY hh:mm:ss').toDate() : undefined;
    this.debitedWalletId = _.get(data, 'SEN');
    this.creditedWalletId = _.get(data, 'REC');
    this.debited = parseFloat(_.get(data, 'DEB'));
    this.credited = parseFloat(_.get(data, 'CRED'));
    this.amount = this.debited || this.credited;
    this.commission = parseFloat(_.get(data, 'COM'));
    this.comment = _.get(data, 'MSG');
    this.status = _.get(data, 'STATUS');
    this.isCard = !!_.get(data, 'EXTRA');
    this.is3DS = _.get(data, 'EXTRA.IS3DS') == '1';
    this.cardCountry = _.get(data, 'EXTRA.CTRY');
    this.authorizationNumber = _.get(data, 'EXTRA.AUTH');
    this.scheduledDate = _.get(data, 'SCHEDULED_DATE') ? moment(_.get(data, 'SCHEDULED_DATE'), 'YYYY/MM/DD').toDate() : undefined;
    this.privateData = _.get(data, 'PRIVATE_DATA') ? _.get(data, 'PRIVATE_DATA').split(';') : undefined;
    this.ibanId = _.get(data, 'MID');
    this.method = _.get(data, 'METHOD');
    this.type = _.get(data, 'TYPE');
  };

  var instanceMethods = {
    'moneyIn3DConfirm': ['moneyIn3DConfirm'],
    'moneyIn3DAuthenticate': ['moneyIn3DAuthenticate'],
    'moneyInValidate': ['moneyInValidate'],
    'refundMoneyIn': ['refundMoneyIn']
  };

  _.each(instanceMethods, function (aliases, method) {
    _.each(aliases, function (alias) {
      factory.Transaction.prototype[alias] = function (ip) {
        var _arguments = _.toArray(arguments).splice(1);
        return factory[method].apply(factory, [ip, this].concat(_arguments));
      };
    });
  });

  this.moneyIn3DConfirm = function (ip, transaction, _opts) {
    var opts = _.assign({}, {
      transactionId: transaction.id ? transaction.id : transaction
    }, _opts);

    return lemonway._client.moneyIn3DConfirm(ip, opts)
      .bind(this)
      .then(function (data) {
        return new this.Transaction(data);
      });
  };

  this.moneyIn3DAuthenticate = function (ip, transaction, _opts) {
    var opts = _.assign({}, {
      transactionId: transaction.id ? transaction.id : transaction
    }, _opts);

    return lemonway._client.moneyIn3DAuthenticate(ip, opts)
      .then(function (data) {
        return new MoneyIn(data);
      });
  };

  this.moneyInValidate = function (ip, transaction, _opts) {
    var opts = _.assign({}, {
      transactionId: transaction.id ? transaction.id : transaction
    }, _opts);

    return lemonway._client.moneyInValidate(ip, opts)
      .bind(this)
      .then(function (data) {
        return new this.Transaction(data);
      });
  };

  this.refundMoneyIn = function (ip, transaction, _opts) {
    var opts = _.assign({}, {
      transactionId: transaction.id ? transaction.id : transaction
    }, _opts);

    return lemonway._client.refundMoneyIn(ip, opts)
      .bind(this)
      .then(function (data) {
        return new this.Transaction(data);
      });
  };

  this.getMoneyInIBANDetails = function (ip, _opts) {
    var opts = _.assign({
      after: _opts.after || 0
    }, _opts);

    return lemonway._client.getMoneyInIBANDetails(ip, opts)
      .bind(this)
      .catch(errors.TransactionNotFound, function () {
        return [];
      })
      .map(function (data) {
        return new this.Transaction(data);
      });
  };

  this.getMoneyInSDD = function (ip, _opts) {
    var opts = _.assign({
      after: _opts.after || 0
    }, _opts);

    return lemonway._client.getMoneyInSDD(ip, opts)
      .bind(this)
      .catch(errors.TransactionNotFound, function () {
        return [];
      })
      .map(function (data) {
        return new this.Transaction(data);
      });
  };

  this.getMoneyInChequeDetails = function (ip, _opts) {
    var opts = _.assign({
      after: _opts.after || 0
    }, _opts);

    return lemonway._client.getMoneyInChequeDetails(ip, opts)
      .bind(this)
      .catch(errors.TransactionNotFound, function () {
        return [];
      })
      .map(function (data) {
        return new this.Transaction(data);
      });
  };

  this.getMoneyInTransDetails =
    this.list =
      this.listMoneyIn = function (ip, _opts) {
        var opts = _.assign({}, _opts);

        return lemonway._client.getMoneyInTransDetails(ip, opts)
          .bind(this)
          .catch(errors.TransactionNotFound, function () {
            return [];
          })
          .map(function (data) {
            return new this.Transaction(data);
          });
      };

  this.getMoneyOutTransDetails =
  this.listMoneyOut = function (ip, _opts) {
    var opts = _.assign({}, _opts);

    return lemonway._client.getMoneyOutTransDetails(ip, opts)
      .bind(this)
      .catch(errors.TransactionNotFound, function () {
        return [];
      })
      .map(function (data) {
        return new this.Transaction(data);
      });
  };

  this.getPaymentDetails =
  this.listTransfer = function (ip, _opts) {
    var opts = _.assign({}, _opts);

    return lemonway._client.getPaymentDetails(ip, opts)
      .bind(this)
      .catch(errors.TransactionNotFound, function () {
        return [];
      })
      .map(function (data) {
        return new this.Transaction(data);
      });
  };

  this.getChargebacks = function (ip, _opts) {
    var opts = _.assign({}, _opts);

    return lemonway._client.getChargebacks(ip, opts)
      .bind(this)
      .catch(errors.TransactionNotFound, function () {
        return [];
      })
      .map(function (data) {
        return new this.Transaction(data);
      });
  };

  this.get =
  this.getMoneyIn = function (ip, transaction) {
    var opts = {
      transactionId: _.get(transaction, 'id', transaction)
    };

    if (!opts.transactionId) return this.list();

    return lemonway._client.getMoneyInTransDetails(ip, opts)
      .bind(this)
      .then(_.head)
      .then(function (data) {
        if (!data) return data;
        return new this.Transaction(data);
      });
  };

  this.getMoneyOut = function (ip, transaction) {
    var opts = {
      transactionId: _.get(transaction, 'id', transaction)
    };

    return lemonway._client.getMoneyOutTransDetails(ip, opts)
      .bind(this)
      .then(function (data) {
        return _.get(data, '[0]');
      })
      .then(function (data) {
        if (!data) return data;
        return new this.Transaction(data);
      });
  };

  this.getTransfer = function (ip, transaction) {
    var opts = {
      transactionId: _.get(transaction, 'id', transaction)
    };

    return lemonway._client.getPaymentDetails(ip, opts)
      .bind(this)
      .then(function (data) {
        return _.get(data, '[0]');
      })
      .then(function (data) {
        if (!data) return data;
        return new this.Transaction(data);
      });
  };

}


module.exports = TransactionFactory;
