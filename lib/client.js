'use strict';

var assert = require('assert');

var _ = require('lodash');
var Promise = require('bluebird');
var soap = require('soap');
var fs = require('fs');

var utils = require('./utils');
var validator = require('./validator');
var validationSchemas = require('./validation-schemas');
var errors = require('./errors');
var constants = require('./constants');

var config = require('./config');

var _createSoapClient = Promise.promisify(soap.createClient, { context: soap });

function Client (login, pass, endpoint) {
  assert(login, 'Lemonway login not set');
  assert(pass, 'Lemonway pass not set');
  assert(endpoint, 'Lemonway endpoint not set');

  this._login = login;
  this._pass = pass;
  this._endpoint = endpoint;

  this.errors = errors;
  this.constants = constants;
}

Client.prototype.setWalletIp = function (ip) {
  this._ip = ip;
};

Client.prototype.setWalletUserAgent = function (ua) {
  this._userAgent = ua;
};

Client.prototype._request = function (method, args, resultName) {
  var _arguments = arguments;

  if (!this._client) {
    return _createSoapClient(this._endpoint)
      .bind(this)
      .then(function (client) {
        this._client = client;
      }).then(function () {
        return this._request.apply(this, _arguments);
      });
  }
  assert(this._client.Service_mb_json[config.APIVersion][method], 'Lemonway API has no method ' +  method);
  return new Promise(function (resolve) {
    if (validationSchemas[method]) {
      return resolve(validator(args, validationSchemas[method]()));
    }
    return resolve(args);
  }).bind(this)
    .then(function (_args) {
      var promise = Promise.promisify(this._client.Service_mb_json[config.APIVersion][method], { context: this._client.Service_mb_json[config.APIVersion] });
      return promise(_.omit(_.assign({
        wlLogin: this._login,
        wlPass: this._pass,
        walletIp: this._ip,
        walletUa: this._userAgent
      }, _args), _.isUndefined));
    })
    .get(resultName ? resultName : method + 'Result')
    .then(function (result) {
      if (result.E) {
        if (errors[_.get(result, 'E.Code')]) {
          throw new errors[_.get(result, 'E.Code')]()
        }
        throw new errors.LemonwayError(_.get(result, 'E.Msg'), _.get(result, 'E.Code'));
      }
      return result;
    });
};

Client.prototype.fastPay = function (_opts) {
  var opts = _.assign({}, _opts, {
    amount: typeof _opts === 'string' ? _opts : utils.numberToFixed(_opts.amount),
    version: '1.2'
  });

  return this._request('FastPay', opts).get('TRANS').get('HPAY')
};

Client.prototype.registerWallet = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.1',
    wallet: _opts.id,
    clientMail: _opts.email,
    clientFirstName: _opts.firstName,
    clientLastName: _opts.lastName,
    isCompany: utils.boolToString(_opts.isCompany),
    ctry: _opts.country,
    birthdate: _opts.birthDate,
    isDebtor: utils.boolToString(_opts.isDebtor),
    birthcity: _opts.birthCity,
    birthcountry: _opts.birthCountry,
    payerOrBenificiary: utils.boolToString(_opts.payerOrBenificiary),
    isOneTimeCustomer: utils.boolToString(_opts.isOneTimeCustomer)
  });

  return this._request('RegisterWallet', opts).get('WALLET');
};

Client.prototype.updateWallet = function (_opts) {
  var opts = _.assign({}, _opts, {
    wallet: _opts.id,
    newEmail: _opts.email,
    newTitle: _opts.title,
    newFirstName: _opts.firstName,
    newLastName: _opts.lastName,
    newStreet: _opts.street,
    newPostCode: _opts.postCode,
    newCity: _opts.city,
    newCtry: _opts.country,
    newPhoneNumber: _opts.phoneNumber,
    newMobileNumber: _opts.mobileNumber,
    newBirthdate: _opts.birthDate,
    newIsCompany: utils.boolToString(_opts.isCompany),
    newCompanyName: _opts.companyName,
    newCompanyWebsite: _opts.companyWebsite,
    newCompanyDescription: _opts.companyDescription,
    newCompanyIdentificationNumber: _opts.companyIdentificationNumber,
    newIsDebtor: utils.boolToString(_opts.isDebtor),
    newNationality: _opts.nationality,
    newBirthcity: _opts.birthCity,
    newBirthcountry: _opts.birthCountry
  });

  return this._request('UpdateWalletDetails', opts, 'UpdateWalletStatusResult').get('WALLET');
};

Client.prototype.updateWalletStatus = function (_opts) {
  var opts = _.assign({}, _opts, {
    newStatus: _.get(constants.WALLET_STATUS, _.get(_opts, 'status'))
  });

  return this._request('UpdateWalletStatus', opts).get('WALLET');
};

Client.prototype.getWalletDetails = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.6'
  });

  return this._request('GetWalletDetails', opts).get('WALLET');
};

Client.prototype.moneyIn = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.1',
    amountTot: utils.numberToFixed(_opts.amount),
    autoCommission: utils.boolToString(_opts.autoCommission),
    isPreAuth: utils.boolToString(_opts.isPreAuth)
  });

  if (_opts.amountCom) {
    opts.amountCom = utils.numberToFixed(_opts.commission);
  }

  if (_opts.cardNumber) {
    opts.cardType = utils.cardNumberToType(_opts.cardNumber);
  }

  return this._request('MoneyIn', opts).get('TRANS').get('HPAY');
};

Client.prototype.moneyIn3DInit = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.1',
    cardCode: _opts.cardCrypto,
    amountTot: utils.numberToFixed(_opts.amount),
    amountCom: utils.numberToFixed(_opts.commission),
    autoCommission: utils.boolToString(_opts.autoCommission)
  });

  if (_opts.amountCom) {
    opts.amountCom = utils.numberToFixed(_opts.commission);
  }

  if (_opts.cardNumber) {
    opts.cardType = utils.cardNumberToType(_opts.cardNumber);
  }

  return this._request('MoneyIn3DInit', opts)
    .get('MONEYIN3DINIT')
    .then(function (data) {
      return {
        acs: _.get(data, 'ACS'),
        transaction: _.get(data, 'TRANS.HPAY')
      };
    });
};

Client.prototype.moneyIn3DConfirm = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.1',
    cardCode: _opts.cardCrypto,
    isPreAuth: utils.boolToString(_opts.isPreAuth)
  });

  return this._request('MoneyIn3DConfirm', opts).get('MONEYIN3DCONFIRM').get('HPAY');
};

Client.prototype.moneyInWebInit = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.3',
    amountTot: utils.numberToFixed(_opts.amount),
    amountCom: utils.numberToFixed(_opts.commission),
    useRegisteredCard: utils.boolToString(_opts.useRegisteredCard),
    autoCommission: utils.boolToString(_opts.autoCommission),
    registerCard: utils.boolToString(_opts.registerCard),
    wkToken: _opts.token
  });

  return this._request('MoneyInWebInit', opts).get('MONEYINWEB');
};

Client.prototype.registerCard = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.2',
    cardCode: _opts.cardCrypto
  });

  if (opts.cardNumber) {
    opts.cardType = utils.cardNumberToType(opts.cardNumber);
  }

  return this._request('RegisterCard', opts).get('CARD');
};

Client.prototype.unregisterCard = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('UnregisterCard', opts).get('CARD');
};

Client.prototype.moneyInWithCardId = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.1',
    amountTot: utils.numberToFixed(_opts.amount),
    amountCom: utils.numberToFixed(_opts.commission),
    autoCommission: utils.boolToString(_opts.autoCommission),
    isPreAuth: utils.boolToString(_opts.isPreAuth),
    wkToken: _opts.token
  });

  return this._request('MoneyInWithCardId', opts, 'MoneyInResult').get('TRANS').get('HPAY');
};

Client.prototype.moneyInValidate = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('MoneyInValidate', opts).get('MONEYIN').get('HPAY');
};

Client.prototype.sendPayment = function (_opts) {
  var opts = _.assign({}, _opts, {
    amount: utils.numberToFixed(_opts.amount)
  });

  return this._request('SendPayment', opts).get('TRANS').get('HPAY');
};

Client.prototype.registerIBAN = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.1'
  });

  return this._request('RegisterIBAN', opts).get('IBAN');
};

Client.prototype.moneyOut = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.3',
    amountTot: utils.numberToFixed(_opts.amount),
    amountCom: utils.numberToFixed(_opts.commission),
    autoCommission: utils.boolToString(_opts.autoCommission)
  });

  return this._request('MoneyOut', opts).get('TRANS').get('HPAY');
};

Client.prototype.getPaymentDetails = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('GetPaymentDetails', opts).get('TRANS').get('HPAY');
};

Client.prototype.getMoneyInTransDetails = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.3',
    startDate: utils.dateToUnix(_opts.from) || 0,
    endDate: utils.dateToUnix(_opts.to)
  });

  return this._request('GetMoneyInTransDetails', opts).get('TRANS').get('HPAY');
};

Client.prototype.getMoneyOutTransDetails = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.4'
  });

  return this._request('GetMoneyOutTransDetails', opts).get('TRANS').get('HPAY');
};

Client.prototype.uploadFile = function (_opts) {
  return new Promise(function (resolve, reject) {
    var filePath = _.get(_opts, 'filePath');
    if (filePath) {
      return fs.readFile(filePath, function (err, data) {
        if (err) return reject(err);
        return resolve(data);
      });
    }
    return resolve(_.get(_opts, 'file'));
  })
    .then(function (buffer) {
      if (buffer instanceof Buffer) {
        return buffer.toString('base64')
      }
      return buffer;
    })
    .bind(this)
    .then(function (buffer) {
    var opts = _.assign({}, _opts, {
      version: '1.1',
      type: _.get(constants.DOCUMENT_TYPE, _.get(_opts, 'type')),
      buffer: buffer
    });
    return this._request('UploadFile', opts).get('UPLOAD');
  });
};

Client.prototype.getKycStatus = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.5'
  });

  return this._request('GetKycStatus', opts).get('WALLETS');
};

Client.prototype.getMoneyInIBANDetails = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.4',
    updateDate: utils.dateToUnix(_opts.from) || 0
  });

  return this._request('GetMoneyInIBANDetails', opts).get('TRANS').get('HPAY');
};

Client.prototype.refundMoneyIn = function (_opts) {
  var opts = _.assign({}, _opts, {
    amountToRefund: utils.numberToFixed(_opts.amount),
    version: '1.2'
  });

  return this._request('RefundMoneyIn', opts).get('TRANS').get('HPAY');
};

Client.prototype.getBalances = function (_opts) {
  var opts = _.assign({
    updateDate: utils.dateToUnix(_opts.from) || 0
  }, _opts);

  return this._request('GetBalances', opts).get('WALLETS').get('WALLET');
};

Client.prototype.moneyIn3DAuthenticate = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('MoneyIn3DAuthenticate', opts).get('MONEYIN');
};

Client.prototype.createGiftCodeAmazon = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('CreateGiftCodeAmazon', opts).get('CreateGiftCodeAmazonConfirm').get('HPAY');
};

Client.prototype.moneyInIDealInit = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('MonetInIDealInit', opts).get('IDEALINIT');
};

Client.prototype.moneyInIDealConfirm = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('MoneyInIDealConfirm', opts).get('TRANS').get('HPAY');
};

Client.prototype.registerSDDMandate = function (_opts) {
  var opts = _.assign({}, _opts, {
    isRecurring: utils.boolToString(_opts.isRecurring)
  });

  return this._request('RegisterSddMandate', opts).get('SDDMANDATE');
};

Client.prototype.unregisterSDDMandate = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('UnregisterSddMandate', opts, 'UnRegisterSddMandateResult').get('SDDMANDATE');
};

Client.prototype.moneyInSDDInit = function (_opts) {
  var opts = _.assign({
    amountTot: utils.numberToFixed(_opts.amount),
    amountCom: utils.numberToFixed(_opts.commission)
  }, _opts, {
    autoCommission: utils.boolToString(_opts.autoCommission)
  });

  return this._request('MoneyInSddInit', opts).get('TRANS').get('HPAY');
};

Client.prototype.getMoneyInSDD  = function (_opts) {
  var opts = _.assign({
    updateDate: utils.dateToUnix(_opts.from) || 0
  }, _opts);

  return this._request('GetMoneyInSdd', opts).get('TRANS').get('HPAY');
};

Client.prototype.getMoneyInChequeDetails  = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.9',
    updateDate: utils.dateToUnix(_opts.from) || 0
  });

  return this._request('GetMoneyInChequeDetails', opts).get('TRANS').get('HPAY');
};

Client.prototype.getWalletTransHistory  = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '2.0',
    startDate: utils.dateToUnix(_opts.from) || 0,
    endDate: utils.dateToUnix(_opts.to)
  });

  return this._request('GetWalletTransHistory', opts).get('TRANS').get('HPAY');
};

Client.prototype.getChargebacks  = function (_opts) {
  var opts = _.assign({}, _opts, {
    version: '1.8',
    updateDate: utils.dateToUnix(_opts.from) || 0
  });

  return this._request('GetChargebacks', opts).get('TRANS').get('HPAY');
};

Client.prototype.moneyInChequeInit  = function (_opts) {
  var opts = _.assign({
    amountTot: utils.numberToFixed(_opts.amount),
    amountCom: utils.numberToFixed(_opts.commission)
  }, _opts, {
    autoCommission: utils.boolToString(_opts.autoCommission)
  });

  return this._request('MoneyInChequeInit', opts).get('TRANS').get('HPAY');
};

Client.prototype.createVCC = function (_opts) {
  var opts = _.assign({
    amount: utils.numberToFixed(_opts.amountVCC)
  }, _opts);

  return this._request('CreateVCC', opts).get('TRANS').get('HPAY');
};

Client.prototype.moneyInNeosurf  = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('MoneyInNeosurf', opts).get('TRANS').get('HPAY');
};

Client.prototype.signDocumentInit = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('SignDocumentInit', opts).get('SIGNDOCUMENT');
};

Client.prototype.getWizypayAds  = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('GetWizypayAds', opts)
    .then(function (data) {
      return Promise.all([
        Promise.get(data, 'OFFERS').get('OFFER'),
        Promise.get(data, 'ADS').get('AD')
      ]);
    });
};

module.exports = Client;