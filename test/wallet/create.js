'use strict';

var Lemonway = require('../../');

describe('create', function () {
  this.timeout(2000000);

  it('create a wallet', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    console.log(lemonway);
    lemonway._client._request('RegisterWallet').then(done).catch(done);
  });
});