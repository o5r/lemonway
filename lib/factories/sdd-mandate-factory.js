'use strict';

var _ = require('lodash');
var querystring = require('querystring');

var utils = require('../utils');

function SDDMandateFactory (lemonway) {
  var factory = this;

  this.SDDMandate = function SDDMandate (data) {
    this.id = _.get(data, 'ID');
    this.status = _.get(data, 'S');
    this.iban = _.get(data, 'DATA');
    this.swift = _.get(data, 'SWIFT');
  };

  this.SDDMandate.prototype.signDocumentInit = function (ip, wallet, _opts) {
    return factory.signDocumentInit(ip, this, wallet, _opts);
  };

  this.signDocumentInit = function (ip, document, wallet, _opts) {
    var opts = _.assign({}, {
      walletIp: ip,
      wallet: _.get(wallet, 'id', wallet),
      documentId: _.get(document, 'id', document),
      documentType: 21
    }, _opts);

    return lemonway._client.signDocumentInit(ip, opts)
      .bind(this)
      .then(function (data) {
        var query = querystring.stringify({
          signingToken: _.get(data, 'TOKEN')
        });

        return {
          token: _.get(data, 'TOKEN'),
          redirectUrl: lemonway._webKitUrl + '?' + query
        };
      });
  };

}

module.exports = SDDMandateFactory;