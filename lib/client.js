'use strict';

var assert = require('assert');

var _ = require('lodash');
var Promise = require('bluebird');
var soap = require('soap');

var config = require('./config');

var _createSoapClient = Promise.promisify(soap.createClient, { context: soap });

function Client (login, pass, endpoint, _opts) {
  var opts = _.assign({}, _opts);
  assert(login, 'Lemonway login not set');
  assert(pass, 'Lemonway pass not set');
  assert(endpoint, 'Lemonway endpoint not set');

  this._login = login;
  this._pass = pass;
  this._endpoint = endpoint;
}

Client.prototype._request = function (method, args) {
  var _arguments = arguments;

  if (!this._client) {
    return _createSoapClient(this._endpoint)
      .bind(this)
      .then(function (client) {
        this._client = client;
      }).then(function () {
        return this._request.apply(this, _arguments);
      });
  }
  console.log(this._client.describe());
  assert(this._client.Service_mb[config.APIVersion][method], 'Lemonway API has no method ' +  method);
  return this._client.Service_mb[config.APIVersion][method](_.assign({
    wlLogin: this._login,
    wlPass: this._pass
  }, args))
};

Client.prototype.registerWallet = function (args) {
  
};

module.exports = Client;