'use strict';

var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('wizypay', function () {
  this.timeout(2000000);

  it('get wizypay', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    lemonway.getWizypayAds({
      walletIp: chance.ip()
    }).spread(function (offers, ads) {
      console.log(offers);
      console.log(ads);
    }).catch(done);
  });
});