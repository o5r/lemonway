'use strict';

var _ = require('lodash');

var Model = require('./model');

function Acs (client, data) {
  Model.call(this, client);

  this.actionUrl = data.actionUrl;
  this.actionMethod = data.actionMethod;
  this.pareqFieldName = data.pareqFieldName;
  this.pareqFieldValue = data.pareqFieldValue;
  this.termurlFieldName = data.termurlFieldName;
  this.mdFieldName = data.mdFieldName;
  this.mdFieldValue = data.mdFieldValue;
  this.mpiResult = data.mpiResult;
}

Acs.prototype = _.create(Model.prototype, {
  'constructor': Acs
});

module.exports = Acs;