'use strict';
var _ = require('lodash');
var querystring = require('querystring');

function MoneyInWebFactory (lemonway) {
  this.MoneyInWeb = function MoneyInWeb (data) {
    this.id = data.ID;
    this.token = data.TOKEN;
    this.cardId = _.get(data, 'CARD.ID');
  };

  var template = _.template('<%= wkUrl %>?<%= query %>');
  this.MoneyInWeb.prototype.getWebKitRedirectUrl = function (opts) {
    return template({
      wkUrl: lemonway._webKitUrl,
      query: querystring.stringify({
        moneyInToken: this.token,
        p: _.get(opts, 'cssUrl'),
        lang: _.get(opts, 'lang')
      })
    });
  };

}


module.exports = MoneyInWebFactory;