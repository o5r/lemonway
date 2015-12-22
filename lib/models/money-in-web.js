'use strict';
var _ = require('lodash');

var Model = require('./model');
var Card = require('./card');

function MoneyInWeb (client, data) {
  Model.call(this, client);

  this.id = data.ID;
  this.token = data.TOKEN;
  if (data.CARD) {
    this.card = new Card(client, data.CARD);
  }
}

MoneyInWeb.prototype = _.create(Model.prototype, {
  'constructor': MoneyInWeb
});

module.exports = MoneyInWeb;