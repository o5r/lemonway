'use strict';

var util = require('util');
var HttpClient = require('soap/lib/http');

function ProxyHttpClient(wsdl, proxy) {
  var urlExtract = /(https?:\/\/[\w\.]+)/;

  this.constructor.super_.apply(this);
  this.wsdl = wsdl;
  this.proxyUri = proxy;

  var extracted = this.wsdl.match(urlExtract);

  if (!extracted) {
    throw new Error('WSDL url bad format');
  }
  this.replaceHost = extracted[0].replace(/\./g, '\\.').replace(/\//g, '\\/');
}

util.inherits(ProxyHttpClient, HttpClient);

ProxyHttpClient.prototype.request = function(rurl, data, callback, exheaders, exoptions) {
  var _this = this;
  var options = _this.buildRequest(rurl, data, exheaders, exoptions);
  var headers = options.headers;

  var req = _this._request(options, function(err, res, body) {
    if (err) {
      return callback(err);
    }
    body = _this.handleResponse(req, res, body);

    return callback(null, res, _this.rewrite(body));
  });

  if (headers.Connection !== 'keep-alive') {
    req.end(data);
  }
  return req;
}

ProxyHttpClient.prototype.rewrite = function(body) {
  var soapAddress = new RegExp('(<soap(12)?:address location=\")' + this.replaceHost, 'gi');

  return body.replace(soapAddress, '$1' + this.proxyUri);
}

module.exports = ProxyHttpClient;
