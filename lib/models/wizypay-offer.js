'use strict';
var _ = require('lodash');

var Model = require('./model');

function WizypayOffer (client, data) {
  Model.call(this, client);

  this.id = data.ID;
  this.name = data.NAME;
  this.description = data.DESCRIPTION;
  this.startDate = data.START;
  this.endDate = data.END;
  this.badge = data.BADGE;
  this.code = data.CODE;
  this.redirectLink = data.PPC;
  this.pictureLink = data.PPV;
  if (data.MER) {
    this.affiliationMerchant = {
      id: this.MER.ID,
      name: this.MER.NAME
    };
  }
}

WizypayOffer.prototype = _.create(Model.prototype, {
  'constructor': WizypayOffer
});

module.exports = WizypayOffer;