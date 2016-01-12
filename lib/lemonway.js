'use strict';

var _ = require('lodash');

var Client = require('./client');
var WalletFactory = require('./factories/wallet-factory');
var TransactionFactory = require('./factories/transaction-factory');
var MoneyInWebFactory = require('./factories/money-in-web-factory');
var SDDMandateFactory = require('./factories/sdd-mandate-factory');

var constants = require('./constants');

function Lemonway (login, pass, endpoint, webKitUrl) {
  this._login = login;
  this._pass = pass;
  this._endpoint = endpoint;
  this._webKitUrl = webKitUrl;

  this._client = new Client(login, pass, endpoint);

  this.Wallet = new WalletFactory(this);
  this.Transaction = new TransactionFactory(this);
  this.MoneyInWeb = new MoneyInWebFactory(this);
  this.SDDMandate = new SDDMandateFactory(this);
}

Lemonway.prototype.clone = function () {
  return new Lemonway(this._login, this._pass, this._endpoint, this._webKitUrl);
};

Lemonway.prototype.setUserIp = function (req) {
  this._client.setWalletIp(
    _.get(req, 'req.headers.x-forwarded-for') ||
    _.get(req, 'connection.remoteAddress') ||
    _.get(req, 'socket.remoteAddress') ||
    _.get(req, 'connection.socket.remoteAddress') ||
    req
  );

  return this;
};

Lemonway.prototype.setUserAgent = function (req) {
  this._client.setWalletUserAgent(
    _.get(req, 'req.headers.user-agent') ||
    req
  );

  return this;
};

Lemonway.constants = constants;

module.exports = Lemonway;