'use strict';

var _ = require('lodash');
var utils = require('../utils');
var MoneyIn = require('../models/money-in');
var errors = require('../errors');
var moment = require('moment');

function TransactionFactory (lemonway) {
  var factory = this;
  this._lemonway = lemonway;

  this.Transaction = function Transaction (data) {
    this._factory = factory;
    this._lemonway = lemonway;

    this.id = data.ID;
    this.cardAlias = this.iban = data.MLABEL;
    this.date = data.DATE ? moment(data.DATE, 'DD/MM/YYYY hh:mm:ss').toDate() : undefined;
    this.debitedWalletId = data.SEN;
    this.creditedWalletId = data.REC;
    this.debited = parseFloat(data.DEB);
    this.credited = parseFloat(data.CRED);
    this.amount = this.debited || this.credited;
    this.commission = parseFloat(data.COM);
    this.comment = data.MSG;
    this.status = data.STATUS;
    this.is3DS = _.get(data, 'EXTRA.IS3DS') == '1';
    this.cardCountry = _.get(data, 'EXTRA.CTRY');
    this.authorizationNumber = _.get(data, 'EXTRA.AUTH');
    this.scheduledDate = data.SCHEDULED_DATE ? moment(data.SCHEDULED_DATE, 'YYYY/MM/DD').toDate() : undefined;
    this.privateData = data.PRIVATE_DATA ? data.PRIVATE_DATA.split(';') : undefined;
    this.ibanId = data.MID;
  };

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
  
  this.Transaction.prototype.refundMoneyIn = function (_opts) {
    return this._factory.refundMoneyIn(this, _opts);
  }
}

TransactionFactory.prototype.moneyIn3DConfirm = function (transaction, _opts) {
  var opts = _.assign({}, {
    transactionId: transaction.id ? transaction.id : transaction
  }, _opts);

  return this._lemonway._client.moneyIn3DConfirm(opts)
    .bind(this)
    .then(function (data) {
      return new this.Transaction(data);
    });
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

  return this._lemonway._client.moneyInValidate(opts)
    .bind(this)
    .then(function (data) {
      return new this.Transaction(data);
    });
};

TransactionFactory.prototype.refundMoneyIn = function (transaction, _opts) {
  var opts = _.assign({}, {
    transactionId: transaction.id ? transaction.id : transaction
  }, _opts);

  return this._lemonway._client.refundMoneyIn(opts)
    .bind(this)
    .then(function (data) {
      return new this.Transaction(data);
    });
};

TransactionFactory.prototype.getMoneyInIBANDetails = function (_opts) {
  var opts = _.assign({
    after: _opts.after || 0
  }, _opts);

  return this._lemonway._client.getMoneyInIBANDetails(opts)
    .bind(this)
    .catch(errors.InvalidTransaction, function () {
      return [];
    })
    .map(function (data) {
      return new this.Transaction(data);
    });
};

TransactionFactory.prototype.getMoneyInSDD = function (_opts) {
  var opts = _.assign({
    after: _opts.after || 0
  }, _opts);

  return this._lemonway._client.getMoneyInSDD(opts)
    .bind(this)
    .catch(errors.InvalidTransaction, function () {
      return [];
    })
    .map(function (data) {
      return new this.Transaction(data);
    });
};

TransactionFactory.prototype.getMoneyInChequeDetails = function (_opts) {
  var opts = _.assign({
    after: _opts.after || 0
  }, _opts);

  return this._lemonway._client.getMoneyInChequeDetails(opts)
    .bind(this)
    .catch(errors.InvalidTransaction, function () {
      return [];
    })
    .map(function (data) {
      return new this.Transaction(data);
    });
};

TransactionFactory.prototype.getMoneyInTransDetails =
TransactionFactory.prototype.list =
TransactionFactory.prototype.listMoneyIn = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._lemonway._client.getMoneyInTransDetails(opts)
    .bind(this)
    .catch(errors.InvalidTransaction, function () {
      return [];
    })
    .map(function (data) {
      return new this.Transaction(data);
    });
};

TransactionFactory.prototype.getMoneyOutTransDetails =
TransactionFactory.prototype.listMoneyOut = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._lemonway._client.getMoneyOutTransDetails(opts)
    .bind(this)
    .catch(errors.InvalidTransaction, function () {
      return [];
    })
    .map(function (data) {
      return new this.Transaction(data);
    });
};

TransactionFactory.prototype.getPaymentDetails =
TransactionFactory.prototype.listTransfer = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._lemonway._client.getPaymentDetails(opts)
    .bind(this)
    .catch(errors.InvalidTransaction, function () {
      return [];
    })
    .map(function (data) {
      return new this.Transaction(data);
    });
};

TransactionFactory.prototype.getChargebacks = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._lemonway._client.getChargebacks(opts)
    .bind(this)
    .catch(errors.InvalidTransaction, function () {
      return [];
    })
    .map(function (data) {
      return new this.Transaction(data);
    });
};

TransactionFactory.prototype.get =
TransactionFactory.prototype.getMoneyIn = function (transaction) {
  var opts = {
    transactionId: _.get(transaction, 'id', transaction)
  };

  if (!opts.transactionId) return this.list();

  return this._lemonway._client.getMoneyInTransDetails(opts)
    .bind(this)
    .then(function (data) {
      return _.get(data, '[0]');
    })
    .then(function (data) {
      if (!data) return data;
      return new this.Transaction(data);
    });
};

TransactionFactory.prototype.getMoneyOut = function (transaction) {
  var opts = {
    transactionId: _.get(transaction, 'id', transaction)
  };

  return this._lemonway._client.getMoneyOutTransDetails(opts)
    .bind(this)
    .then(function (data) {
      return _.get(data, '[0]');
    })
    .then(function (data) {
      if (!data) return data;
      return new this.Transaction(data);
    });
};

TransactionFactory.prototype.getTransfer = function (transaction) {
  var opts = {
    transactionId: _.get(transaction, 'id', transaction)
  };

  return this._lemonway._client.getPaymentDetails(opts)
    .bind(this)
    .then(function (data) {
      return _.get(data, '[0]');
    })
    .then(function (data) {
      if (!data) return data;
      return new this.Transaction(data);
    });
};

module.exports = TransactionFactory;