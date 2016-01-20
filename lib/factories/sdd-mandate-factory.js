'use strict';

var _ = require('lodash');
var querystring = require('querystring');

var utils = require('../utils');

function SDDMandateFactory (lemonway) {
  var factory = this;
  this._lemonway = lemonway;

  this.SDDMandate = function SDDMandate (data) {
    this._factory = factory;

    this.id = data.ID;
    this.status = data.S;
    this.iban = data.DATA;
    this.swift = data.SWIFT;
  };

  this.SDDMandate.prototype.signDocumentInit = function (ip, wallet, _opts) {
    return this._factory.signDocumentInit(ip, this, wallet, _opts);
  };

}

SDDMandateFactory.prototype.signDocumentInit = function (ip, document, wallet, _opts) {
  var opts = _.assign({}, {
    walletIp: ip,
    wallet: _.get(wallet, 'id', wallet),
    documentId: _.get(document, 'id', document),
    documentType: 21
  }, _opts);

  return this._lemonway._client.signDocumentInit(ip, opts)
    .bind(this)
    .then(function (data) {
      var query = querystring.stringify({
        signingToken: _.get(data, 'TOKEN')
      });

      return {
        token: _.get(data, 'TOKEN'),
        redirectUrl: this._lemonway._webKitUrl + '?' + query
      };
    });
};

module.exports = SDDMandateFactory;