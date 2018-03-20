'use strict';

var expect = require('chai').expect;
var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('money out', function () {
  this.timeout(2000000);

  it('money out', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    lemonway.Wallet.create(chance.ip(), {
      id: chance.word({ syllables: 5 }),
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    }).then(function (wallet) {
      return wallet.moneyIn(chance.ip(), {
        amount: 200.00,
        cardNumber: '5017670000006700',
        cardCrypto: '666',
        cardDate: '10/2020',
        autoCommission: true
      }).return(wallet);
    }).then(function (wallet) {
      return wallet.registerIBAN(chance.ip(), {
        holder: chance.first() + " " + chance.last(),
        iban: 'FR1420041010050500013M02606'
      }).then(function (iban) {
        return wallet.moneyOut(chance.ip(), {
          amount: 100.0,
          iban: iban,
          autoCommission: true
        });
      });
    }).then(function (iban) {
      return done();
    }).catch(done);

  });

});
