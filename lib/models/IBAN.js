'use strict';

var _ = require('lodash');

var Model = require('./model');

function IBAN (client, data) {
  Model.call(this, client);

  this.id = data.ID;
  this.status = data.S
}

IBAN.prototype = _.create(Model.prototype, {
  'constructor': IBAN
});

module.exports = IBAN;