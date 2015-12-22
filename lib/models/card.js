'use strict';

var _ = require('lodash');

var Model = require('./model');

function Card (client, data) {
  Model.call(this, client);

  this.id = data.ID;
  if (data.EXTRA) {
    this.is3DSecure = data.EXTRA.IS3DS;
    this.country = data.EXTRA.CTRY;
    this.authorizationNumber = data.EXTRA.AUHT;
    this.cardNumber = data.EXTRA.NUM;
    this.expirationDate = data.EXTRA.EXP
  }
}

Card.prototype = _.create(Model.prototype, {
  'constructor': Card
});

module.exports = Card;