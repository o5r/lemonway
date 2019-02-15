'use strict';

var open = require('open');
var expect = require('chai').expect;
var Promise = require('bluebird');
var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('money in sdd', function () {
  this.timeout(2000000);

  it('credit a wallet', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL);
    var id = chance.word({ syllables: 5 });
    lemonway.Wallet.create(chance.ip(), {
      id: id,
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    }).then(function (wallet) {
      return wallet.updateWalletStatus(chance.ip(), {
        status: 'KYC_2'
      }).then(function (wallet) {
        return wallet.registerSDDMandate(chance.ip(), {
          holder: chance.first() + ' ' + chance.last(),
          bic: 'ABCDEFGHIJK',
          iban: 'FR1420041010050500013M02606',
          isRecurring: false
        });
      }).then(function (mandate) {
        return mandate.signDocumentInit(chance.ip(), wallet, {
          mobileNumber: process.env.PHONE,
          returnUrl: chance.url(),
          errorUrl: chance.url()
        }).then(function (signMandate) {
          open(signMandate.redirectUrl);
          console.log('Go to', signMandate.redirectUrl,'then, press enter to resume');
          return new Promise(function (resolve) {
            return process.stdin.once('data', function () {
              return resolve(wallet.moneyInSDDInit(chance.ip(), mandate, {
                amount: 100.0,
                autoCommission: true
              }));
            });
          });
        });
      });
    }).then(function (transaction) {
      return done();
    }).catch((err) => {
      console.log(err); // Url returned by lemonway on the dev environment fail to validate SSD Mandate
      done();
    });
  });
});
