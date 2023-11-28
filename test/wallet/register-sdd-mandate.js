'use strict';

var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('register sdd mandate', function () {
  this.timeout(2000000);

  it('sign a mandate', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
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
      return wallet.registerSDDMandate(chance.ip(), {
        holder: chance.first() + ' ' + chance.last(),
        bic: 'ABCDEFGHIJK',
        iban: 'FR1420041010050500013M02606',
        isRecurring: false
      });
    }).then(function (mandate) {
      return done();
    }).catch(done);
  });
});
