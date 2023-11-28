'use strict';

var expect = require('chai').expect;
var Chance = require('chance');
var Promise = require('bluebird');
var open = require('open');

var Lemonway = require('../../');

var chance = new Chance();

describe('money in 3D', function () {
  this.timeout(2000000);

  it('credit a wallet', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL);
    lemonway.Wallet.create(chance.ip(), {
      id: chance.word({ syllables: 5 }),
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthdate: chance.string(),
      country: 'FRA',
      nationality: 'FRA',
      payerOrBeneficiary: true,
      isCompany: false,
    }).then(function (wallet) {
      return wallet.moneyIn3DInit(chance.ip(), {
        amount: 10.00,
        autoCommission: true,
        cardNumber: '5017670000001800',
        cardCrypto: '666',
        cardDate: '10/2020',
        token: chance.word({ syllables: 5 }),
        returnUrl: 'http://localhost:9999' //chance.url()
      });
    }).then(function (objs) {
      process.stdin.resume();
      process.stdin.setEncoding('utf8');
      return new Promise(function (resolve) {
        open(objs.acs.getRedirectUrl());
        console.log('Go to', objs.acs.getRedirectUrl(),'then, press enter to resume');
        return process.stdin.once('data', function () {
          return resolve(objs.transaction.moneyIn3DConfirm(chance.ip()));
        });
      });
    }).then(function (transaction) {
      return done();
    }).catch(done);

  });

});
