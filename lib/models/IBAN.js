'use strict';

var _ = require('lodash');

function IBAN (data) {
  this.id = _.get(data, 'ID');
  this.status = _.get(data, 'S');
  this.iban = _.get(data, 'DATA');
  this.swift = _.get(data, 'SWIFT');
  this.holder = _.get(data, 'HOLDER');
}

module.exports = IBAN;