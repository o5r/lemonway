'use strict';

var Chance = require('chance');
var moment = require('moment');
var Lemonway = require('../../');

var chance = new Chance();

describe('get money in', function () {
  this.timeout(2000000);

  it('list transactions', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    lemonway.Transaction.getMoneyInTransDetails(chance.ip(), {
        after: 0
      })
      .then(function (transactions) {
        return done();
      }).catch(done);
  });

  it('list transactions', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    lemonway.Transaction.list(chance.ip())
      .then(function (transactions) {
        return done();
      }).catch(done);
  });

});
