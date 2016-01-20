'use strict';

var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('Get money in cheque', function () {
  this.timeout(2000000);

  it('create a wallet', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    lemonway.Transaction.getMoneyInChequeDetails(chance.ip(), {
      after: new Date('2011-04-11')
    }).then(function (transactions) {
      return done();
    }).catch(done);
  });
});
