'use strict';

var Promise = require('bluebird');
var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('send payment', function () {
  this.timeout(2000000);

  it('send payment', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    Promise.all([
      lemonway.setUserIp(chance.ip()).Wallet.create({
        id: chance.word(),
        email: chance.email(),
        firstName: chance.first(),
        lastName: chance.last(),
        birthDate: new Date()
      }),
      lemonway.setUserIp(chance.ip()).Wallet.create({
        id: chance.word(),
        email: chance.email(),
        firstName: chance.first(),
        lastName: chance.last(),
        birthDate: new Date()
      })
    ])
    .spread(function (debitedWallet, creditedWallet) {
      return debitedWallet.moneyIn({
        amount: 200.00,
        cardNumber: '5017670000006700',
        cardCrypto: '666',
        cardDate: '10/2016',
        autoCommission: true
      }).return([debitedWallet, creditedWallet]);
    }).spread(function (debitedWallet, creditedWallet) {
      return debitedWallet.sendPayment(creditedWallet, {
        amount: 100.00
      })
    }).then(function (transaction) {
      console.log(transaction);
      return done();
    }).catch(done);

  });

});