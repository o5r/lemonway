'use strict';

const expect = require('chai').expect;
const Chance = require('chance');
const _ = require('lodash');

const Lemonway = require('../../');

const chance = new Chance();

describe('getWalletDetailsBatch', function () {
  this.timeout(2000000);

  it('should get a batch of wallet details', function (done) {
    const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL, { proxy: 'https://proxy.october.eu/lemonway/staging', namespaceArrayElements: false});
    const walletIds = _.range(5).map(() => ({
      wallet: `${chance.integer({min: 200, max: 2000 })}`,
      email: chance.email(),
    }));
    const ip = chance.ip();
    const walletCreationPromises = walletIds.map(function(walletId) {
      return lemonway.Wallet.create(ip, {
        id: walletId.wallet,
        email: walletId.email,
        firstName: chance.first(),
        lastName: chance.last(),
        nationality: 'FRA',
        street: chance.street(),
        postCode: chance.postal(),
        city: chance.city(),
        country: 'FRA',
        birthdate: '01/01/2000',
        payerOrBeneficiary: '1',
        isCompany: false,
      });
    });
    Promise.all([...walletCreationPromises])
      .then(function () {
        return lemonway.Wallet.getBatch(ip, walletIds);
      })
      .then(function (wallets) {
        expect(wallets.length).to.equal(5);
        wallets.forEach((wallet, index) => {
          expect(wallet.id).to.equal(walletIds[index].wallet);
          expect(wallet.email).to.equal(walletIds[index].email);
          expect(wallet.balance).to.equal(0);
        });
        return done();
      }).catch(done);
  });
});
