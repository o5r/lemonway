'use strict';
var _ = require('lodash');

var Model = require('./model');

function SDDMandate (client, data) {
  Model.call(this, client);

  this.id = data.ID;
  this.status = data.S;
  this.iban = data.DATA;
  this.swift = data.SWIFT;
}

SDDMandate.prototype = _.create(Model.prototype, {
  'constructor': SDDMandate
});

module.exports = SDDMandate;