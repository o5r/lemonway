'use strict';
var _ = require('lodash');

function MoneyIn (data) {
  this.O3DCode = _.get(data, 'O3D_CODE');
}

module.exports = MoneyIn;