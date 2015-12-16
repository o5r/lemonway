'use strict';

var expect = require('chai').expect;
var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('get details', function () {
  this.timeout(2000000);

  it('get a wallet details', function (done) {
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
      return lemonway.Wallet.getDetails({
        id: wallet.id,
        walletIp: chance.ip()
      });
    }).then(function (detailed) {
      console.log(detailed);
      expect(detailed.id).to.equal(id);
      return done();
    }).catch(done);
  });

  it('get a wallet details', function (done) {
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
      return wallet.getDetails({ walletIp: chance.ip() });
    }).then(function (detailed) {
      console.log(detailed);
      expect(detailed.id).to.equal(id);
      return done();
    })
      .catch(done);
  });
});