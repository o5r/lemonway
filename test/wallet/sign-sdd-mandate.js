'use strict';

var expect = require('chai').expect;
var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('sign sdd mandate', function () {
  this.timeout(2000000);

  it('sign a sdd mandate', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL);
    var id = chance.word({ syllables: 5 });
    lemonway.Wallet.create(chance.ip(), {
      id: id,
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthdate: chance.string(),
      country: 'FRA',
      nationality: 'FRA',
      payerOrBeneficiary: true,
      isCompany: false,
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
          mobileNumber: '33770482948',
          returnUrl: chance.url(),
          errorUrl: chance.url()
        });
      });
    }).then(function (mandate) {
      return done();
    }).catch(done);
  });
});
