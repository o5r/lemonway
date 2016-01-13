'use strict';

var expect = require('chai').expect;
var Chance = require('chance');

var Lemonway = require('../../');

var chance = new Chance();

describe('upload file', function () {
  this.timeout(2000000);

  it('upload a file', function (done) {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    return lemonway.clone().setUserIp(chance.ip()).Wallet.create({
      id: chance.word(),
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    }).then(function (wallet) {
      return wallet.uploadFile({
        fileName: 'RIB.png',
        type: 'RIB',
        filePath: './test/wallet/RIB.png'
      });
    }).then(function (document) {
      console.log('hello', document);
      return done();
    }).catch(done);

  });

});