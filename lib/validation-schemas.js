'use strict';

var Joi = require('joi');

Joi.lemonwayBase = function () {
  return Joi.object({
    walletIp: Joi.string().ip().required(),
    walletUa: Joi.string()
  });
};

Joi.registerWallet = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(1).max(100).required(),
    clientMail: Joi.string().mail().min(6).max(256).required(),
    clientTitle: Joi.string.valid(['M', 'F', 'J', 'U']),
    clientFirstName: Joi.string().min(2).max(256).required(),
    clientLastName: Joi.string().min(2).max(256).required(),
    street: Joi.string().max(256),
    postCode: Joi.string().max(10),
    city: Joi.string().max(140),
    ctry: Joi.string().length(3),
    phoneNumber: Joi.string().min(6).max(30),
    mobileNumber: Joi.string().min(6).max(30),
    birthdate: Joi.date().format('dd/MM/yyyy'),
    isCompany: Joi.string().valid(['0', '1']),
    companyName: Joi.string().min(1).max(256),
    companyWebsite: Joi.string().min(1).max(256),
    companyDescription: Joi.string().min(1).max(256),
    companyIdentificationNumber: Joi.string().min(1).max(256),
    isDebitor: Joi.string().valid(['0', '1']),
    nationality: Joi.string().max(19),
    birthcity: Joi.string().max(140),
    birthcountry: Joi.string().length(3),
    payerOrBeneficiary: Joi.string().valid(['0', '1', '2']),
    isOneTimeCustomer: Joi.string().valid(['0', '1'])
  }));
};

Joi.updateWalletDetails = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(1).max(100).required(),
    newEmail: Joi.string().email().min(6).max(256),
    newTitle: Joi.string.valid(['M', 'F', 'J', 'U']),
    newFirstName: Joi.string().min(2).max(256),
    newLastName: Joi.string().min(2).max(256),
    newStreet: Joi.string().max(256),
    newPostCode: Joi.string().max(10),
    newCity: Joi.string().max(140),
    newCtry: Joi.string().length(3),
    newIp: Joi.string().ip(),
    newPhoneNumber: Joi.string().min(6).max(30),
    newMobileNumber: Joi.string().min(6).max(30),
    newBirthdate: Joi.date().format('dd/MM/yyyy'),
    newIsCompany: Joi.string().valid(['0', '1']),
    newCompanyName: Joi.string().min(1).max(256),
    newCompanyWebsite: Joi.string().min(1).max(256),
    newCompanyDescription: Joi.string().min(1).max(256),
    newCompanyIdentificationNumber: Joi.string().min(1).max(256),
    newIsDebtor: Joi.string().valid(['0', '1']),
    newNationality: Joi.string().max(19),
    newBirthcity: Joi.string().max(140),
    newBirthcountry: Joi.string().length(3)
  }));
};

Joi.updateWalletSatus = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(1).max(256),
    newStatus: Joi.string().allow(['5', '6', '12'])
  }));
};

Joi.getWalletDetails = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(0).max(256),
    email: Joi.string().email().max(256)
  }).or('wallet', 'email'));
};

Joi.moneyIn = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().min(0).max(256).required(),
    cardType: Joi.string().allow(['0', '1', '2']).required(),
    cardNumber: Joi.string().creditCard().required(),
    cardCrypto: Joi.string().length(3).required(),
    cardDate: Joi.date().format('MM/yyyy').required(),
    amountTot: Joi.number().precision(2).required(),
    amountCom: Joi.number().precision(2),
    comment: Joi.string().max(140),
    autoCommission: Joi.string().allow(['0', '1']),
    isPreAuth: Joi.string().allow(['0', '1']),
    delayedDays: Joi.number.min(1).max(99),
    wkToken: Joi.string().max(50),
    specialConfig: Joi.string()
  }));
};

Joi.moneyIn3DInit = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().max(256).required(),
    cardNumber: Joi.string().creditCard().required(),
    cardCode: Joi.string().length(3).required(),
    cardDate: Joi.date().format('MM/yyyy').required(),
    amountTot: Joi.number().precision(2).required(),
    returnUrl: Joi.string().required(),
    amountCom: Joi.number().precision(2),
    comment: Joi.string().max(140),
    autoCommission: Joi.string().allow(['0', '1']),
    wkToken: Joi.string().max(50),
    specialConfig: Joi.string()
  }));
};

Joi.moneyIn3DConfirm = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    transactionId: Joi.number().required(),
    MD: Joi.string(),
    PaRes: Joi.string(),
    cardType: Joi.string().allow(['0', '1', '2']),
    cardNumber: Joi.string().creditCard(),
    cardCode: Joi.string().length(3),
    cardDate: Joi.date().format('MM/yyyy'),
    isPreAuth: Joi.string().allow(['0', '1']),
    specialConfig: Joi.string()
  }));
};

Joi.moneyInWebInit = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().max(256).required(),
    amountTot: Joi.number().precision(2).required(),
    amountCom: Joi.number().precision(2),
    comment: Joi.string().max(140),
    useRegisteredCard: Joi.string().allow(['0', '1']),
    wkToken: Joi.string().max(50).required(),
    returnUrl: Joi.string().min(1).required(),
    errorUrl: Joi.string().min(1).required(),
    cancelUrl: Joi.string().min(1).required(),
    autoCommission: Joi.string().allow(['0', '1']).required(),
    registerCard: Joi.string().allow(['0', '1'])
  }));
};

Joi.registerCard = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().max(256).required(),
    cardType: Joi.string().allow(['0', '1', '2']).required(),
    cardNumber: Joi.string().creditCard().required(),
    cardCode: Joi.string().length(3).required(),
    cardDate: Joi.date().format('MM/yyyy').required(),
    specialConfig: Joi.string()
  }));
};

Joi.unregisterCard = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().max(256).required(),
    cardId: Joi.string().min(1).max(12).required()
  }));
};

Joi.moneyInWithCardId = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().max(256).required(),
    cardId: Joi.string().max(256).required(),
    amountTot: Joi.number().precision(2).required(),
    amountCom: Joi.number().precision(2),
    comment: Joi.string().max(140),
    autoCommission: Joi.string().allow(['0', '1']).required(),
    isPreAuth: Joi.string().allow(['0', '1']),
    delayedDays: Joi.number().min(1).max(99),
    specialConfig: Joi.string()
  }));
};

Joi.moneyInValidate = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    transactionId: Joi.number().required(),
    specialConfig: Joi.string()
  }));
};

Joi.sendPayment = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    debitWallet: Joi.string().max(256).required(),
    creditWallet: Joi.string().max(256).required(),
    amount: Joi.number().min(0).precision(2).required(),
    message: Joi.string().max(140),
    scheduledDate: Joi.date().format('yyyy/MM/dd'),
    privateData: Joi.string().max(5139)
  }));
};

Joi.registerIBAN = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().max(256).required(),
    holder: Joi.string().min(1).max(100).required(),
    bic: Joi.string().min(8).max(11),
    iban: Joi.string().min(15).max(34),
    dom1: Joi.string().min(1).max(26),
    dom2: Joi.string().min(1).max(26),
    comment: Joi.string().min(1).max(512)
  }));
};

Joi.moneyOut = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().max(256).required(),
    amountTot: Joi.number().precision(2).required(),
    amountCom: Joi.number().precision(2),
    message: Joi.string().max(140),
    ibanId: Joi.string().max(10),
    autoCommission: Joi.string().allow(['0', '1']).required()
  }));
};

Joi.getPaymentDetails = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    transactionId: Joi.number(),
    transactionComment: Joi.string().max(140),
    privateData: Joi.string().max(5139)
  }));
};

Joi.getMoneyInTransDetails = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    transactionId: Joi.number(),
    transactionComment: Joi.string().max(140),
    transactionMerchantToken: Joi.string().max(50),
    startDate: Joi.number(),
    endDate: Joi.number()
  }));
};

Joi.getMoneyOutTransDetails = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    transactionId: Joi.number(),
    transactionComment: Joi.string().max(140)
  }));
};

Joi.uploadFile = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    wallet: Joi.string().required(),
    fileName: Joi.string().required(),
    type: Joi.number().min(0).max(20).required(),
    buffer: Joi.binary().required(),
    sddMandateId: Joi.number()
  }));
};

Joi.getKycStatus = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    updateDate: Joi.number().required()
  }));
};

Joi.getMoneyInIBANDetails = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    updateDate: Joi.number().required()
  }));
};

Joi.refundMoneyIn = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    transactionId: Joi.string().max(10).required(),
    comment: Joi.string().max(140),
    amountToRefund: Joi.number().precision(2)
  }));
};

Joi.getBalances = function () {
  return Joi.lemonwayBase().concat(Joi.object({
    updateDate: Joi.number().required()
  }));
};

module.exports = Joi;