'use strict';

var expect = require('chai').expect;
var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('register', function () {
  this.timeout(2000000);

  it('create a wallet', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    const id = chance.word();
    lemonway.clone().setUserIp(chance.ip()).Wallet.create({
      id: id,
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    }).then(function (wallet) {
      return wallet.registerSddMandate({
        holder: chance.first() + ' ' + chance.last(),
        bic: 'ABCDEFGHIJK',
        iban: 'FR1420041010050500013M02606',
        isRecurring: false
      }).then(function (mandate) {
        return wallet.unregisterSddMandate(mandate);
      })
    }).then(function (mandate) {
      console.log(mandate);
      return done();
    }).catch(done);
  });
});