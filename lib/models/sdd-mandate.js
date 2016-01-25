'use strict';
var _ = require('lodash');

function SDDMandate (data) {
  this.id = _.get(data, 'ID');
  this.status = _.get(data, 'S');
  this.iban = _.get(data, 'DATA');
  this.swift = _.get(data, 'SWIFT');
}

module.exports = SDDMandate;