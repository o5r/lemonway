const { expect } = require('chai');
const Chance = require('chance');
const moment = require('moment');

const Lemonway = require('../../');

const chance = new Chance();

describe('createVirtualIban', function () {
  this.timeout(2000000);

  let lemonway;
  let walletOptions;
  let wallet;

  beforeEach(async() => {
    lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT);
    walletOptions = {
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

    wallet = await lemonway.Wallet.create(chance.ip(), walletOptions);
  });

  it('should create a virtual iban', async() => {
    const lemonwayIban = await wallet.createVirtualIBAN(chance.ip(), {
      wallet: wallet.id,
      country: 'FR'
    });

    expect(lemonwayIban).to.have.keys(['id', 'iban', 'bic', 'holder', 'domiciliation', 'status', 'maxAvailableIbanPerWalletLeft', 'maxAvailableIbanInTotalLeft']);

    const updatedWallet = await lemonway.Wallet.getWalletDetails(chance.ip(), wallet);
    expect(updatedWallet.wallet.ibans.length).to.eql(1);
    expect(updatedWallet.wallet.ibans[0].iban).to.eql(lemonwayIban.iban);
  });

  it('should fail if wallet id is less than 1 char', async() => {
    await expect(wallet.createVirtualIBAN(chance.ip(), {
      wallet: '',
      country: 'FR',
    })).to.eventually.be.rejectedWith('child "wallet" fails because ["wallet" is not allowed to be empty, "wallet" length must be at least 1 characters long]');
  });

  it('should fail if wallet id is more than 100 char', async() => {
    await expect(wallet.createVirtualIBAN(chance.ip(), {
      wallet: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam eget est at metus dignissim consectetur. Proin eu felis ut justo malesuada facilisis. Quisque ac metus ut ex bibendum pharetra.',
      country: 'FR',
    })).to.eventually.be.rejectedWith('child "wallet" fails because ["wallet" length must be less than or equal to 100 characters long]');
  });

  it('should fail if wallet id not pass', async() => {
    await expect(lemonway.Wallet.createVirtualIBAN(chance.ip(), {
      country: 'FR',
    })).to.eventually.be.rejectedWith('child "wallet" fails because ["wallet" must be a string]');
  });

  it('should fail if country is less than 1 char', async() => {
    await expect(wallet.createVirtualIBAN(chance.ip(), {
      wallet: wallet.id,
      country: '',
    })).to.eventually.be.rejectedWith('child "country" fails because ["country" is not allowed to be empty, "country" length must be at least 1 characters long]');
  });

  it('should fail if country is more than 2 char', async() => {
    await expect(wallet.createVirtualIBAN(chance.ip(), {
      wallet: wallet.id,
      country: 'FRE',
    })).to.eventually.be.rejectedWith('child "country" fails because ["country" length must be less than or equal to 2 characters long]');
  });

  it('should fail if country id not pass', async() => {
    await expect(wallet.createVirtualIBAN(chance.ip(), {
      wallet: wallet.id,
    })).to.eventually.be.rejectedWith('child "country" fails because ["country" is required]');
  });
});
