'use strict';
var _ = require('lodash');

var Model = require('./model');

function WizypayAd (client, data) {
  Model.call(this, client);

  this.id = data.ID;
  this.kind = data.KIND;
  this.text = data.TEXT;
  this.redirectLink = data.PPC;
  this.pictureLink = data.PPV;
  this.htmlTag = data.HTML;
  if (data.MER) {
    this.affiliationMerchant = {
      id: data.MER.ID,
      name: data.MER.NAME
    }
  }
}

WizypayAd.prototype = _.create(Model.prototype, {
  'constructor': WizypayAd
});

module.exports = WizypayAd;