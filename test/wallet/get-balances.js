'use strict';

var Promise = require('bluebird');
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
    }).then(function (wallets) {
      return Promise.all([
        wallets,
        Promise.reduce(wallets, function (acc, wallet) {
          return !acc || acc.balance < wallet.balance ? wallet : acc;
        })
      ]);
    }).spread(function (wallets, greatest) {
      console.log('greatest', greatest);
      return Promise.map(wallets, function (wallet) {
        if (wallet.balance > 0 && wallet.id !== greatest.id) {
          console.log('from', wallet.id, 'to', greatest.id);
          return lemonway.Wallet.sendPayment(wallet, greatest, {
            walletIp: chance.ip(),
            amount: wallet.balance
          }).return(wallet);
        }
        return wallet;
      }).map(function (wallet) {
        if (wallet.status !== Lemonway.constants.WALLET_STATUS.CLOSED) {
          console.log(wallet);
          return wallet.close({
            walletIp: chance.ip()
          });
        }
      })
    }).then(function () {
      return done();
    }).catch(done);
  });

});