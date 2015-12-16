'use strict';

var expect = require('chai').expect;
var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('money in', function () {
  this.timeout(2000000);

  it('credit a wallet', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    var id = chance.word();
    lemonway.Wallet.register({
      walletIp: chance.ip(),
      wallet: id,
      clientMail: chance.email(),
      clientFirstName: chance.first(),
      clientLastName: chance.last(),
      birthdate: new Date()
    }).then(function (wallet) {
      return lemonway.Wallet.moneyIn(wallet.id, {
        walletIp: chance.ip(),
        amountTot: 10.00,
        cardType: Lemonway.constants.CARD_TYPE.CB,
        cardNumber: '5017670000006700',
        cardCrypto: '666',
        cardDate: '10/2016',
        autoCommission: Lemonway.constants.AUTO_COMMISSION.ENABLED
      });
    }).then(function (hPay) {
      console.log(hPay);
      expect(hPay.com + hPay.cred).to.equal(10.00);
      return done();
    })
    .catch(done);
  });

});