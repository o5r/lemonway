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

  this.SDDMandate.extendSDDMandatePromise = utils.extendPromise([
    'signDocumentInit'
  ]);

  this.SDDMandate.prototype.signDocumentInit = function (wallet, _opts) {
    var opts = _.assign({}, _opts);
    return this._factory.signDocumentInit(this, wallet, opts);
  };

}

SDDMandateFactory.prototype.signDocumentInit = function (document, wallet, _opts) {
  var opts = _.assign({}, {
    wallet: _.get(wallet, 'id', wallet),
    documentId: _.get(document, 'id', document),
    documentType: 21
  }, _opts);

  return this._lemonway._client.signDocumentInit(opts)
    .bind(this)
    .then(function (data) {
      const query = querystring.stringify({
        signingToken: _.get(data, 'TOKEN')
      });

      return {
        token: _.get(data, 'TOKEN'),
        redirectUrl: this._lemonway._webKitUrl + '?' + query
      };
    });
};

module.exports = SDDMandateFactory;