'use strict';

var _ = require('lodash');
var moment = require('moment');

var Model = require('./model');
var VirtualCreditCard = require('./virtual-credit-card');
var MoneyIn = require('./money-in');
var Card = require('./card');
var IBAN = require('./iban');

function Transaction (client, data) {
  Model.call(this, client);

  this.id = data.ID;
  this.date = typeof data.DATE === 'string' ? moment(data.DATE, 'DD/MM/yyyy hh:mm:ss').toDate() : data.DATE;
  this.debitedWallet = data.SEN;
  this.creditedWallet = data.REC;
  this.amountDebited = parseFloat(data.DEB);
  this.amountCredited = parseFloat(data.CRED);
  this.fee = parseFloat(data.COM);
  this.amazonGiftCode = data.AGC;
  this.message = data.MSG;
  this.status = data.STATUS;
  this.IBANUsed = data.MLABEL;
  this.lemonwayMessage = data.INT_MSG;
  this.bankReference = data.BANK_REF;
  if (data.VCC) {
    this.virtualCreditCard = new VirtualCreditCard(client, data);
  }
  if (data.FROM_MONEYIN) {
    this.moneyIn = new MoneyIn(client, {
      ID: data.FROM_MONEYIN
    });
  }
  if (data.CARD_ID) {
    this.card = new Card(client, {
      ID: data.CARD_ID
    })
  }
  if (data.EXTRA) {
    this.extra = {
      is3DSecure: data.EXTRA.IS3DS,
      country: data.EXTRA.CTRY,
      authorizationNumber: data.EXTRA.AUTH
    }
  }
  if (data.MID) {
    this.iban = new IBAN(client, {
      ID: data.MID
    });
  }
}

Transaction.prototype = _.create(Model.prototype, {
  'constructor': Transaction
});

Transaction.prototype.getPaymentDetails = function (_opts) {
  var opts = _.assign({}, _opts, {
    transactionId: this.id
  });

  return this._client.getPaymentDetails(opts);
};

Transaction.prototype.getMoneyInTransDetails = function (_opts) {
  var opts = _.assign({}, _opts, {
    transactionId: this.id
  });

  return this._client.getMoneyInTransDetails(opts);

};

Transaction.prototype.getMoneyOutTransDetails = function (_opts) {
  var opts = _.assign({}, _opts, {
    transactionId: this.id
  });

  return this._client.getMoneyOutTransDetails(opts);
};

Transaction.prototype.refundMoneyIn = function (_opts) {
  var opts = _.assign({}, _opts, {
    transactionId: this.id
  });

  return this._client.refundMoneyIn(opts);
};

Transaction.prototype.MoneyIn3DAuthenticate = function (_opts) {
  var opts = _.assign({}, _opts, {
    transactionId: this.id
  });

  return this._client.refundMoneyIn(opts);
};

module.exports = Transaction;