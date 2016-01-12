'use strict';

var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('register', function () {
  this.timeout(2000000);

  it('create a wallet', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    lemonway.clone().setUserIp(chance.ip()).Transaction.GetMoneyInIBANDetails({
      from: 0
    }).then(function (transactions) {
      console.log(transactions);
      return done();
    }).catch(done);
  });
});
