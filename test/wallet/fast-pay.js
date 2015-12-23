'use strict';

var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('register', function () {
  this.timeout(2000000);

  it('use fastpay', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    var id = chance.word();
    lemonway.Wallet.register({
      walletIp: chance.ip(),
      wallet: id,
      clientMail: chance.email(),
      clientFirstName: chance.first(),
      clientLastName: chance.last()
    }).then(function (wallet) {
      return lemonway.fastPay({
        walletIp: chance.ip(),
        clientMail: chance.email(),
        clientFirstName: chance.first(),
        clientLastName: chance.last(),
        cardType: Lemonway.constants.CARD_TYPE.CB,
        cardNumber: '5017670000006700',
        cardCrypto: '666',
        cardDate: '10/2016',
        amount: 1.00,
        creditWallet: wallet.id,
        autoCommission: Lemonway.constants.AUTO_COMMISSION.ENABLED,
        registerCard: Lemonway.constants.REGISTER_CARD.ENABLED
      }).then(function (res) {
        return done();
      })
    }).catch(done);
  });
});