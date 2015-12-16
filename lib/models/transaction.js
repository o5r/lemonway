'use strict';

var _ = require('lodash');
var moment = require('moment');

var Model = require('./model');

function Transaction (client, data) {
  Model.call(this, client);

  this.id = data.ID;
  this.date = typeof data.DATE === 'string' ? moment(data.DATE, 'DD/MM/yyyy hh:mm:ss').toDate() : data.DATE;
  this.sen = data.SEN;
  this.rec = data.REC;
  this.deb = parseFloat(data.DEB);
  this.cred = parseFloat(data.CRED);
  this.com = parseFloat(data.COM);
  this.msg = data.MSG;
  this.status = data.STATUS;
}

Transaction.prototype = _.create(Model.prototype, {
  'constructor': Transaction
});

module.exports = Transaction;