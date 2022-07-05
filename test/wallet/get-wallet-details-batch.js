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
    const prefix = chance.integer({ min: 10, max: 99 });
    const walletIds = _.range(5).map(() => ({
      wallet: `${prefix}${chance.integer({min: 100, max: 999 })}`,
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
      .then(function (results) {
        expect(results.wallets.length).to.equal(5);
        results.wallets.forEach((wallet, index) => {
          expect(wallet.id).to.equal(walletIds[index].wallet);
          expect(wallet.email).to.equal(walletIds[index].email);
          expect(wallet.balance).to.equal(0);
        });
        return done();
      }).catch(done);
  });

  it('should get a batch of wallet not found errors', function (done) {
    const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL, { proxy: 'https://proxy.october.eu/lemonway/staging', namespaceArrayElements: false});
    const prefix = chance.integer({ min: 10, max: 99 });
    const unknownWalletIds = _.range(5).map(() => ({
      wallet: `${prefix}${chance.integer({min: 100, max: 999 })}`,
      email: chance.email(),
    }));
    const ip = chance.ip();
    lemonway.Wallet.getBatch(ip, unknownWalletIds)
      .then(function (results) {
        expect(results.errors.length).to.equal(5);
        results.errors.forEach((error) => {
          expect(error.code).to.equal('147');
          expect(error.message).to.equal('Wallet not found');
        })
        return done();
      }).catch(done);
  });

  it('should get a batch of wallet details and wallet not found errors', function (done) {
    const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL, { proxy: 'https://proxy.october.eu/lemonway/staging', namespaceArrayElements: false});
    const prefix = chance.integer({ min: 10, max: 99 });
    const walletIds = _.range(2).map(() => ({
      wallet: `${prefix}${chance.integer({min: 100, max: 999 })}`,
      email: chance.email(),
    }));
    const unknownWalletIds = _.range(2).map(() => ({
      wallet: `${prefix}${chance.integer({min: 100, max: 999 })}`,
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
        return lemonway.Wallet.getBatch(ip, [...walletIds, ...unknownWalletIds]);
      })
      .then(function (results) {
        expect(results.wallets.length).to.equal(2);
        results.wallets.forEach((wallet, index) => {
          expect(wallet.id).to.equal(walletIds[index].wallet);
          expect(wallet.email).to.equal(walletIds[index].email);
          expect(wallet.balance).to.equal(0);
        });

        expect(results.errors.length).to.equal(2);
        results.errors.forEach((error) => {
          expect(error.code).to.equal('147');
          expect(error.message).to.equal('Wallet not found');
        })
        return done();
      }).catch(done);
  });
});
