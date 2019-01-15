'use strict';

var expect = require('chai').expect;
var Chance = require('chance');
var open = require('open');

var Lemonway = require('../../');

var chance = new Chance();

describe('money in ideal', function () {
  this.timeout(2000000);

  it('Credit a wallet', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL);

    lemonway.Wallet.create(chance.ip(), {
      id: chance.word({ syllables: 5 }),
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    }).then(function (wallet) {

      return wallet.moneyInIDealInit(chance.ip(), {
        amount: 10.00,
        autoCommission: false,
        issuerId: "121",
        returnUrl: chance.url()
      })
        .then(function (moneyInIdeal) {
          expect(moneyInIdeal.id).to.exist;
          const redirectUrl = moneyInIdeal.getWebKitRedirectUrl();
          expect(redirectUrl).to.be.a('string');

          process.stdin.resume();
          process.stdin.setEncoding('utf8');

          open(redirectUrl);
          console.log('Go to', redirectUrl, ' validate the transaction then, press enter to resume');
          return process.stdin.once('data', function () {
            return lemonway.Wallet.moneyInIDealConfirm(chance.ip(), wallet, moneyInIdeal.id)
            .then((transaction) => {
              expect(transaction.status).to.be.eql(lemonway.constants.TRANSACTION_STATUS.SUCCESS);
              expect(transaction.amount).to.be.eql(10.00);
              expect(transaction.creditedWalletId).to.be.eql(wallet.id);

              return done();
            });
          });
        }).catch(done);
    });
  });
});
