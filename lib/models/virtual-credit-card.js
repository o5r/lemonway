'use strict';
var _ = require('lodash');

var Model = require('./model');

function VirtualCreditCard (client, data) {
  Model.call(this, client);

  this.id = data.ID;
  this.number = data.NUM;
  this.expirationDate = data.EDATE;
  this.cvx = data.CVX;
}

VirtualCreditCard.prototype = _.create(Model.prototype, {
  'constructor': VirtualCreditCard
});

module.exports = VirtualCreditCard;