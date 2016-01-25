'use strict';

var querystring = require('querystring');
var _ = require('lodash');

var sessionIdReg = /.*;jsessionid=(.*\..*)\??/;

function Acs (data) {
  if (data) {
    this.actionMethod = data.actionMethod;
    this.pareqFieldName = data.pareqFieldName;
    this.pareqFieldValue = data.pareqFieldValue;
    this.termurlFieldName = data.termurlFieldName;
    this.mdFieldName = data.mdFieldName;
    this.mdFieldValue = data.mdFieldValue;
    this.mpiResult = data.mpiResult;

    if (data.actionUrl) {
      this.actionUrl = decodeURIComponent(data.actionUrl);
      var actionUrlMatch = this.actionUrl.match(sessionIdReg);
      if (actionUrlMatch.length >= 2) {
        this.sessionId = actionUrlMatch[1];
      }
    }
  }
}

var template = _.template('<%= url %>?<%= query %>');

Acs.prototype.getRedirectUrl = function (redirectUrl) {
  var query = {};
  if (this.pareqFieldName) {
    query[this.pareqFieldName] = this.pareqFieldValue;
  }
  if (this.mdFieldName) {
    query[this.mdFieldName] = this.mdFieldValue;
  }
  if (this.termurlFieldName) {
    query[this.termurlFieldName] = redirectUrl;
  }

  return template({ url: this.actionUrl, query: querystring.stringify(query) });
};

module.exports = Acs;