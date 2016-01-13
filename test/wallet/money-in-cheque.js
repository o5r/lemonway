'use strict';

var expect = require('chai').expect;
var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('money in cheque', function () {
  this.timeout(2000000);

  it('credit a wallet', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL);
    lemonway.clone().setUserIp(chance.ip()).Wallet.create({
      id: chance.word(),
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    }).then(function (wallet) {
      return wallet.moneyInChequeInit({
        amount: 10.0,
        autoCommission: true
      });
    }).then(function (transaction) {
      console.log(transaction);
      return done();
    }).catch(done);

  });

});