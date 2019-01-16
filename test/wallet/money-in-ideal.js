const expect = require('chai').expect;
const Chance = require('chance');
const open = require('open');
const Promise = require('bluebird');

const Lemonway = require('../../');

const chance = new Chance();

describe('money in ideal', function() {
  this.timeout(2000000);

  it('Credit a wallet', async() => {
    const lemonway = new Lemonway(process.env.LOGIN, process.env.PASS, process.env.ENDPOINT, process.env.WK_URL);
    const wallet = await lemonway.Wallet.create(chance.ip(), {
      id: chance.word({ syllables: 5 }),
      email: chance.email(),
      firstName: chance.first(),
      lastName: chance.last(),
      birthDate: new Date()
    });

    const moneyInIdeal = await wallet.moneyInIDealInit(chance.ip(), {
      amount: 10.00,
      autoCommission: false,
      issuerId: "121",
      returnUrl: chance.url()
    });

    expect(moneyInIdeal.id).to.exist;
    const redirectUrl = moneyInIdeal.getWebKitRedirectUrl();
    expect(redirectUrl).to.be.a('string');

    process.stdin.resume();
    process.stdin.setEncoding('utf8');

    open(redirectUrl);
    console.log(`Go to ${redirectUrl}, validate the transaction then, press enter to resume`);

    await new Promise((resolve, reject) => process.stdin.once('data', () => {
      return lemonway.Wallet.moneyInIDealConfirm(chance.ip(), wallet, moneyInIdeal.id)
        .then((transaction) => {
          expect(transaction.status).to.be.eql(lemonway.constants.TRANSACTION_STATUS.SUCCESS);
          expect(transaction.amount).to.be.eql(10.00);
          expect(transaction.creditedWalletId).to.be.eql(wallet.id);

          resolve();
        })
        .catch(reject);
    }));
  });
});
