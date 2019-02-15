'use strict';

var Client = require('./client');
var WalletFactory = require('./factories/wallet-factory');
var TransactionFactory = require('./factories/transaction-factory');
var MoneyInWebFactory = require('./factories/money-in-web-factory');
var MoneyInIDealFactory = require('./factories/money-in-iDeal-factory');
var SDDMandateFactory = require('./factories/sdd-mandate-factory');

function Lemonway (login, pass, endpoint, webKitUrl, options) {
  this._login = login;
  this._pass = pass;
  this._endpoint = endpoint;
  this._webKitUrl = webKitUrl;
  this._client = new Client(login, pass, endpoint, options);

  this.errors = Lemonway.errors;
  this.constants = Lemonway.constants;

  this.Wallet = new WalletFactory(this);
  this.Transaction = new TransactionFactory(this);
  this.MoneyInWeb = new MoneyInWebFactory(this);
  this.MoneyInIDeal = new MoneyInIDealFactory(this);
  this.SDDMandate = new SDDMandateFactory(this);
}

Lemonway.constants = require('./constants');
Lemonway.errors = require('./errors');

module.exports = Lemonway;
