'use strict';

var util = require('util');
var HttpClient = require('soap/lib/http');

function ProxyHttpClient(sourceUri, proxyUri) {
  this.constructor.super_.apply(this);

  this.proxyUri = proxyUri;
  var sourceUri = sourceUri.replace(/\./g, '\\.').replace(/\//g, '\\/');
  this.sourceUriOccurrences = new RegExp('(<soap(12)?:address location=\")' + sourceUri, 'gi');
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
  return body.replace(this.sourceUriOccurrences, '$1' + this.proxyUri);
}

module.exports = ProxyHttpClient;
