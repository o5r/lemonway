'use strict';
var _ = require('lodash');

function VirtualCreditCard (data) {
  this.id = _.get(data, 'ID');
  this.number = _.get(data, 'NUM');
  this.expirationDate = _.get(data, 'EDATE');
  this.cvx = _.get(data, 'CVX');
}

module.exports = VirtualCreditCard;