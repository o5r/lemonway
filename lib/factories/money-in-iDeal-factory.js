'use strict';
var _ = require('lodash');

function MoneyInIDealFactory(lemonway) {
  this.MoneyInIDeal = function MoneyInIDeal(data) {
    this.id = _.get(data, 'ID');
    this.redirectUrl = decodeURIComponent(_.get(data, 'actionUrl'));
  };

  this.MoneyInIDeal.prototype.getWebKitRedirectUrl = function (opts) {
    return this.redirectUrl;
  };
}

module.exports = MoneyInIDealFactory;
