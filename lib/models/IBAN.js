'use strict';

var _ = require('lodash');

function IBAN (data) {
  this.id = data.ID;
  this.status = data.S;
  this.iban = data.DATA;
  this.swift = data.SWIFT;
  this.holder = data.HOLDER;
}

module.exports = IBAN;