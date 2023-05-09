'use strict';

var expect = require('chai').expect;
var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe.only('register iban', function () {
  this.timeout(2000000);

  it('registers an iban with authorized chars in holder field', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    lemonway.Wallet.get(chance.ip(), {
      id: '106',
      email: 'jean.dupont106@mail.com',
    }).then(function (response) {
      return response.wallet.registerIBAN(chance.ip(), {
        holder: 'alphanumeric 123 and - only',
        iban: 'FR1420041010050500013M02606'
      });
    }).then(function (iban) {
      return done();
    }).catch(done);
  });

  it('registers an iban with unauthorized chars in holder changed in spaces', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    lemonway.Wallet.get(chance.ip(), {
      id: '106',
      email: 'jean.dupont106@mail.com',
    }).then(function (response) {
      return response.wallet.registerIBAN(chance.ip(), {
        holder: 'unauthorized chars like _ and &.',
        iban: 'FR1420041010050500013M02606'
      });
    }).then(function (iban) {
      return done();
    }).catch(done);
  });
});
