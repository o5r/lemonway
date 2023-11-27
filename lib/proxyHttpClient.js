'use strict';

var HttpClient = require('soap/lib/http').HttpClient;

class ProxyHttpClient extends HttpClient {

  constructor(sourceUri, proxyUri) {
    this.constructor.super_.apply(this);

    this.proxyUri = proxyUri;
    var sourceUri = sourceUri.replace(/\./g, '\\.').replace(/\//g, '\\/');
    this.sourceUriOccurrences = new RegExp('(<soap(12)?:address location=\")' + sourceUri, 'gi');
  }

  request(rurl, data, callback, exheaders, exoptions) {
    var _this = this;
    var options = _this.buildRequest(rurl, data, exheaders, exoptions);

    var req = _this._request(options, function (err, res, body) {
      if (err) {
        return callback(err);
      }
      body = _this.handleResponse(req, res, body);

      return callback(null, res, _this.rewrite(body));
    });

    return req;
  }

  rewrite(body) {
    return body.replace(this.sourceUriOccurrences, '$1' + this.proxyUri);
  }
}

module.exports = ProxyHttpClient;
