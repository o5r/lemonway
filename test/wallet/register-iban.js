'use strict';

const expect = require('chai').expect;
const Chance = require('chance');

const Lemonway = require('../../');

const chance = new Chance();

describe('register iban', function () {
  this.timeout(2000000);

  const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL);
  const ip = chance.ip();
  let newWallet;

  before(async function() {
    newWallet = await lemonway.Wallet.create(ip, {
      id: chance.word({ syllables: 5 }),
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthdate: '25/05/1980',
      payerOrBeneficiary: '1',
      country: 'FRA',
      isCompany: false,
      nationality: 'FRA',
    });
  });

  it('registers an iban with authorized chars in holder field', async function() {
    const wallet = await lemonway.Wallet.get(ip, {
      id: newWallet.id,
    });

    await wallet.wallet.registerIBAN(ip, {
      holder: 'alphanumeric 123 and - only',
      iban: 'FR1420041010050500013M02606'
    });
  });

  it("registers an iban with unauthorized chars in 'holder' field replaced by spaces", async function() {
    const wallet = await lemonway.Wallet.get(ip, {
      id: newWallet.id,
    });

    await wallet.wallet.registerIBAN(ip, {
      holder: 'unauthorized chars like _ and &. for example',
      iban: 'FR1420041010050500013M02606'
    });

    const walletWithIban = await lemonway.Wallet.get(ip, {
      id: newWallet.id,
    });

    expect(walletWithIban.wallet.ibans.at(-1).holder).to.eql('unauthorized chars like   and    for example');
  });
});
