'use strict';

var _ = require('lodash');
var moment = require('moment');
var creditCardType = require('credit-card-type');
var constants = require('./constants');

function remap (object, map) {
  return _.reduce(object, function (result, n, key) {
    result[map[key] ? map[key] : key] = n;
    return result
  }, {});
}

function numberToFixed (val, fixed) {
  return typeof val !== 'number' ? val : val.toFixed(fixed ? fixed : 2);
}

function dateToUnix (val) {
  return val instanceof Date ? moment(val).unix() : val;
}

function dateToDayString (val) {
  return val instanceof Date ? moment(val).format('DD/MM/YYYY') : val;
}

function boolToString (val) {
  return typeof val !== 'boolean' ? val : val ? '1' : '0';
}

function stringToInteger (val) {
  return typeof val === 'string' ? parseInt(val, 10) : val;
}

function cardNumberToType (cardNumber) {
  var cardType = creditCardType(cardNumber);
  if (cardType.type && cardType.type[0] === 'visa') {
    return constants.CARD_TYPE.VISA;
  }
  if (cardType.type && cardType.type[0] === 'master-card') {
    return constants.CARD_TYPE.MASTERCARD;
  }
  return constants.CARD_TYPE.CB;
}

function getIp (req) {
  return _.get(req, 'ip', req);
}

module.exports = {
  remap: remap,
  numberToFixed: numberToFixed,
  dateToUnix: dateToUnix,
  dateToDayString: dateToDayString,
  boolToString: boolToString,
  stringToInteger: stringToInteger,
  cardNumberToType: cardNumberToType,
  getIp: getIp
};
