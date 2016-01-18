'use strict';

var Chance = require('chance');
var moment = require('moment');
var Lemonway = require('../../');

var chance = new Chance();

describe('get money in', function () {
  this.timeout(2000000);

  it('list transactions', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    lemonway.clone().setUserIp(chance.ip()).Transaction.getMoneyInTransDetails({
        after: 0
      })
      .then(function (transactions) {
        console.log(transactions);
        return done();
      }).catch(done);
  });

  it('list transactions', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    lemonway.clone().setUserIp(chance.ip()).Transaction.list({
      //after: moment().subtract(1, 'day').toDate(),
      //before: moment().toDate()
    })
      .then(function (transactions) {
        console.log(transactions);
        return done();
      }).catch(done);
  });

});
