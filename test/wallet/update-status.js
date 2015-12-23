'use strict';

var expect = require('chai').expect;
var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('update', function () {
  this.timeout(2000000);

  it('update a wallet status', function (done) {
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
      return lemonway.Wallet.updateStatus(wallet.id, {
        walletIp: chance.ip(),
        newStatus: Lemonway.constants.WALLET_STATUS.CLOSED
      });
    }).then(function (updated) {
        expect(updated.id).to.equal(id);
        return done();
      })
      .catch(done);
  });

  it('update a wallet', function (done) {
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
      return wallet.updateStatus({
        walletIp: chance.ip(),
        newStatus: Lemonway.constants.WALLET_STATUS.CLOSED
      });
    }).then(function (updated) {
        expect(updated.id).to.equal(id);
        return done();
      })
      .catch(done);
  });
});