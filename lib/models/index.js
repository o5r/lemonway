'use strict';

module.exports = {
  WalletFactory: require('./../factories/wallet-factory'),
  Wallet: require('./wallet'),
  Transaction: require('./transaction'),
  Acs: require('./acs'),
  MoneyInWeb: require('./money-in-web'),
  MoneyIn: require('./money-in'),
  Card: require('./card'),
  IBAN: require('./iban'),
  Upload: require('./upload'),
  IDealInit: require('./i-deal-init'),
  SDDMandate: require('./sdd-mandate'),
  VirtualCreditCard: require('./virtual-credit-card'),
  WizypayOffer: require('./wizypay-offer'),
  WizypayAd: require('./wizypay-ad')
};