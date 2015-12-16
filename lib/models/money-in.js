'use strict';
var _ = require('lodash');

var Model = require('./model');

function MoneyIn (client, data) {
  Model.call(this, client);

  this.O3DCode = data.O3D_CODE;
}

MoneyIn.prototype = _.create(Model.prototype, {
  'constructor': MoneyIn
});

module.exports = MoneyIn;