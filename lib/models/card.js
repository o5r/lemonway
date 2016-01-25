'use strict';

var _ = require('lodash');

function Card (data) {
  if (data) {
    this.id = data.ID;
    if (_.get(data, 'EXTRA')) {
      this.is3DSecure = _.get(data, 'EXTRA.IS3DS');
      this.country = _.get(data, 'EXTRA.CTRY');
      this.authorizationNumber = _.get(data, 'EXTRA.AUTH');
      this.cardAlias = _.get(data, 'EXTRA.NUM');
      this.expirationDate = _.get(data, 'EXTRA.EXP');
    }
  }
}

module.exports = Card;