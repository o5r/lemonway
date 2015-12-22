'use strict';
var _ = require('lodash');

var Model = require('./model');

function IDealInit (client, data) {
  Model.call(this, client);

  this.id = data.ID;
  this.actionUrl = data.actionUrl;
}

IDealInit.prototype = _.create(Model.prototype, {
  'constructor': IDealInit
});

module.exports = IDealInit;