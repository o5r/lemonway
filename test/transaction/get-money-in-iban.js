'use strict';

var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('Get money in IBAN', function () {
  this.timeout(2000000);

  it('create a wallet', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    lemonway.Transaction.getMoneyInIBANDetails(chance.ip(), {
      after: 0
    }).then(function (transactions) {
      return done();
    }).catch(done);
  });
});
