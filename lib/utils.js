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
  return val instanceof Date ? moment(val).unix() : val
}

function boolToString (val) {
  return typeof val !== 'boolean' ? val : val ? '1' : '0';
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

function extendPromise (calls) {
  return function (promise) {
    calls.forEach(function (call) {
      promise[call] = function () {
        var _arguments = arguments;
        return promise.then(function (res) {
          return res[call].apply(res, _arguments);
        });
      };
    });
    return promise;
  };
}

module.exports = {
  remap: remap,
  numberToFixed: numberToFixed,
  dateToUnix: dateToUnix,
  boolToString: boolToString,
  cardNumberToType: cardNumberToType,
  extendPromise: extendPromise
};