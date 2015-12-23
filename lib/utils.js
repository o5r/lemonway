'use strict';

var _ = require('lodash');
var moment = require('moment');

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

module.exports = {
  remap: remap,
  numberToFixed: numberToFixed,
  dateToUnix: dateToUnix,
  boolToString: boolToString
};