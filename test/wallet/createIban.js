const expect = require('chai').expect;
const Chance = require('chance');
const moment = require('moment');

const Lemonway = require('../../');

const chance = new Chance();

describe.only('register iban', function () {
  this.timeout(2000000);

  it('should create an iban',async() => {
    var lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    const walletOpts = {
      id: chance.word({ syllables: 5 }),
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      country: 'FRA',
      birthdate: moment().format('DD/MM/YYYY'),
      isCompany: false,
      nationality: 'FRA',
      payerOrBeneficiary: true,
    };

    const createdWallet = await lemonway.Wallet.create(chance.ip(), walletOpts);

    const lemonwayIban = await createdWallet.createIBAN(chance.ip(), {
      wallet: createdWallet.id,
      country: 'FR'
    });

    expect(lemonwayIban.id).to.not.be.undefined;

    const infos = await lemonway.Wallet.getWalletDetails(chance.ip(), createdWallet);
    console.log(infos.wallet.ibans);
    expect(infos.wallet.ibans[0].holder).to.equal('LEMON WAY');
  });

});
