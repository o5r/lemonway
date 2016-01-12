'use strict';
var _ = require('lodash');

function SDDMandate (data) {
  this.id = data.ID;
  this.status = data.S;
  this.iban = data.DATA;
  this.swift = data.SWIFT;
}

module.exports = SDDMandate;