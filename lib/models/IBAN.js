'use strict';

var _ = require('lodash');

var Model = require('./model');

function IBAN (client, data) {
  Model.call(this, client);

  this.id = data.ID;
  this.status = data.S;
  this.iban = data.DATA;
  this.swift = data.SWIFT;
  this.holder = data.HOLDER;
}

IBAN.prototype = _.create(Model.prototype, {
  'constructor': IBAN
});

module.exports = IBAN;