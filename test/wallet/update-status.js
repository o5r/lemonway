'use strict';

var expect = require('chai').expect;
var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('update wallet status', function () {
  this.timeout(2000000);

  it('update a wallet status', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
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
      });
    }).then(function (wallet) {
      expect(wallet.id).to.equal(id);
      return done();
    }).catch(done);
  });
});