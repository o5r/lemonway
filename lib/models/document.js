'use strict';

var _ = require('lodash');
var moment = require('moment');

var Model = require('./model');

function Document (client, data) {
  Model.call(this, client);

  this.id = data.ID;
  this.status = data.S;
  this.type = data.TYPE;
  if (data.VD) {
    this.validityDate = moment(data.VD, 'dd/mm/yyyy').toDate();
  }
}

Document.prototype = _.create(Model.prototype, {
  'constructor': Document
});

module.exports = Document;