'use strict';

var _ = require('lodash');

var Model = require('./model');

function Card (client, data) {
  Model.call(this, client);

  this.id = data.ID;
}

Card.prototype = _.create(Model.prototype, {
  'constructor': Card
});

module.exports = Card;