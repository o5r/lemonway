'use strict';

var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('get balances', function () {
  this.timeout(2000000);

  it('get wallets balances', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    lemonway.Wallet.getBalances({
      walletIp: chance.ip(),
      updateDate: 0
    }).map(function (wallet) {
      return wallet.reload({
        walletIp: chance.ip()
      });
    }).map(function (wallet) {
      if (wallet.status !== Lemonway.constants.WALLET_STATUS.CLOSED && wallet.bal === 0.00) {
        return wallet.close({
          walletIp: chance.ip()
        });
      }
    }).then(function () {
      return done();
    }).catch(done);
  });

});