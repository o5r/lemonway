'use strict';

var _ = require('lodash');
var moment = require('moment');

function Document (data) {
  this.id = data.ID;
  this.status = data.S;
  this.type = data.TYPE;
  this.comment = data.C;
  if (data.VD) {
    this.validityDate = moment(data.VD, 'dd/mm/yyyy').toDate();
  }
}

module.exports = Document;