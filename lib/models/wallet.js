'use strict';

var _ = require('lodash');

var Model = require('./model');
var constants = require('../constants');

var Document = require('./document');
var IBAN = require('./iban');
var SDDMandate = require('./sdd-mandate');

function Wallet (client, data) {
  Model.call(this, client);

  this.id = data.ID;
  this.lemonWayId = data.LWID;
  this.balance = parseFloat(data.BAL);
  this.name = data.NAME;
  this.email = data.EMAIL;
  this.status = data.STATUS;
  this.blocked = data.BLOCKED;
  this.method = data.METHOD;
  if (data.DOCS) {
    this.documents = _.map(data.DOCS, function (doc) {
      return new Document(client, doc.DOC);
    });
  }
  if (data.IBAN) {
    this.ibans = _.map(data.IBANS, function (iban) {
      return new IBAN(client, iban.IBAN);
    });
  }
  if (data.SDDMANDATES) {
    this.sddMandates = _.map(data.SDDMANDATES, function (sddMandate) {
      return new SDDMandate(client, sddMandate.SDDMANDATE);
    });
  }

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

Wallet.prototype.moneyInWithCardId = function (card, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: this.id,
    cardId: card.id ? card.id : card
  });

  return this._client.moneyInWithCardId(opts);
};

Wallet.prototype.registerIBAN = function (_opts) {
  var opts = _.assign({}, _opts, {
    wallet: this.id
  });

  return this._client.registerIBAN(opts);
};

Wallet.prototype.moneyOut = function (_opts) {
  var opts = _.assign({}, _opts, {
    wallet: this.id
  });

  return this._client.moneyOut(opts);
};

Wallet.prototype.uploadFile = function (_opts) {
  var opts = _.assign({}, _opts, {
    wallet: this.id
  });

  this._client.uploadFile(opts);
};

Wallet.prototype.createGiftCardAmazon = function (_opts) {
  var opts = _.assign({}, _opts, {
    debitWallet: this.id
  });

  this._client.createGiftCardAmazon(opts);
};

module.exports = Wallet;