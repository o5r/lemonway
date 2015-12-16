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
  return typeof val === 'number' ? val.toFixed(fixed ? fixed : 2) : val
}

function dateToUnix (val) {
  return val instanceof Date ? moment(val).unix() : val
}

module.exports = {
  remap: remap,
  numberToFixed: numberToFixed,
  dateToUnix: dateToUnix
};