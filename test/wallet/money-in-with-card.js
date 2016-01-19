'use strict';

var expect = require('chai').expect;
var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('money in with card', function () {
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
      return wallet.registerCard({
        cardNumber: '5017670000001800',
        cardCrypto: '666',
        cardDate: '09/2016'
      }).then(function (card) {
        return wallet.moneyInWithCard(card, {
          amount: 10.0,
          autoCommission: true
        });
      });
    }).then(function (transaction) {
      console.log(transaction);
      return done();
    }).catch(done);

  });

});