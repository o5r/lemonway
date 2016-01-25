'use strict';

var expect = require('chai').expect;
var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('money in web', function () {
  this.timeout(2000000);

  it('credit a wallet', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL);
    lemonway.Wallet.create(chance.ip(), {
      id: chance.word({ syllables: 5 }),
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    }).then(function (wallet) {
      return wallet.moneyInWebInit(chance.ip(), {
        amount: 10.00,
        autoCommission: true,
        token: chance.word({ syllables: 5 }),
        registerCard: true,
        returnUrl: chance.url(),
        errorUrl: chance.url(),
        cancelUrl: chance.url()
      });
    }).then(function (moneyInWeb) {
      console.log(moneyInWeb);
      console.log(moneyInWeb.getWebKitRedirectUrl());
      return done();
    }).catch(done);

  });

});