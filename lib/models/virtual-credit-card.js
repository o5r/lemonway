'use strict';
var _ = require('lodash');

function VirtualCreditCard (data) {
  this.id = data.ID;
  this.number = data.NUM;
  this.expirationDate = data.EDATE;
  this.cvx = data.CVX;
}

module.exports = VirtualCreditCard;