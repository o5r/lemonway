'use strict';

var assert = require('assert');

var util = require('util');
var _ = require('lodash');
var Promise = require('bluebird');
var soap = require('soap');
var fs = require('fs');
var url = require('url');

var utils = require('./utils');
var validator = require('./validator');
var validationSchemas = require('./validation-schemas');
var errors = require('./errors');
var constants = require('./constants');
var ProxyHttpClient = require('./proxyHttpClient');

var config = require('./config');

var _createSoapClient = Promise.promisify(soap.createClient, { context: soap });

function Client (login, pass, endpoint, options) {
  assert(login, 'Lemonway login not set');
  assert(pass, 'Lemonway pass not set');
  assert(endpoint, 'Lemonway endpoint not set');

  this._login = login;
  this._pass = pass;
  this.options = options || {};

  // A proxy URL can be provided to support the IP security
  if (this.options.proxy) {
    var sourceEndpointUri = url.parse(endpoint);
    var sourceEndpointHost = sourceEndpointUri.protocol + '//' + sourceEndpointUri.host;

    this._endpoint = endpoint.replace(sourceEndpointHost, this.options.proxy);
    this.options.httpClient = new ProxyHttpClient(sourceEndpointHost, this.options.proxy);
  } else {
    this._endpoint = endpoint;
  }
}

Client.prototype._handleError = function(code, message) {
  var errorClass = _.find(errors, function(error) {
    return _.includes(error.codes, code);
  });

  if (errorClass) {
    throw new errorClass(code);
  }

  throw new errors.LemonwayError(code, message);
};

Client.prototype.setWalletIp = function (ip) {
  this._ip = ip;
};

Client.prototype.setWalletUserAgent = function (ua) {
  this._userAgent = ua;
};

var methods = {};

Client.prototype._request = function (method, ip, args, resultName) {
  var _arguments = arguments;

  if (!this._client) {
    return _createSoapClient(this._endpoint, this.options)
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
      var promise = _.get(methods, config.APIVersion + '.' + method);
      if (!promise) {
        promise = Promise.promisify(this._client.Service_mb_json[config.APIVersion][method], { context: this._client.Service_mb_json[config.APIVersion] });
        _.set(methods, config.APIVersion + '.' + method, promise);
      }
      return promise(_.omit(_.assign({
        wlLogin: this._login,
        wlPass: this._pass,
        walletIp: utils.getIp(ip)
      }, _args), _.isUndefined));
    })
    .get(resultName ? resultName : method + 'Result')
    .then(function (result) {
      if (result.E) {
        return this._handleError(_.get(result, 'E.Code'), _.get(result, 'E.Msg'))
      }
      return result;
    });
};

Client.prototype.fastPay = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    amount: typeof _opts === 'string' ? _opts : utils.numberToFixed(_opts.amount),
    version: '1.2'
  });

  return this._request('FastPay', ip, opts).get('TRANS').get('HPAY')
};

Client.prototype.registerWallet = function (ip, _opts) {
  var opts = _.merge({
    version: '1.1'
  }, {
    wallet: _opts.id,
    clientMail: _opts.email,
    clientTitle: _opts.clientTitle,
    clientFirstName: _opts.firstName,
    clientLastName: _opts.lastName,
    street: _opts.street,
    postCode: _opts.postCode,
    city: _opts.city,
    ctry: _opts.country,
    phoneNumber: _opts.phoneNumber,
    mobileNumber: _opts.mobileNumber,
    birthdate: _opts.birthdate,
    isCompany: utils.boolToString(_opts.isCompany),
    companyName: _opts.companyName,
    companyWebsite: _opts.companyWebsite,
    companyDescription: _opts.companyDescription,
    companyIdentificationNumber: _opts.companyIdentificationNumber,
    isDebtor: utils.boolToString(_opts.isDebtor),
    nationality: _opts.nationality,
    birthcity: _opts.birthCity,
    birthcountry: _opts.birthCountry,
    payerOrBeneficiary: utils.boolToString(_opts.payerOrBeneficiary),
    isOneTimeCustomer: utils.boolToString(_opts.isOneTimeCustomer)
  });

  return this._request('RegisterWallet', ip, opts).get('WALLET');
};

Client.prototype.UpdateWalletDetails = function (ip, _opts) {
  var opts = _.merge({}, {
    wallet: _opts.id,
    newEmail: _opts.email,
    newTitle: _opts.title,
    newFirstName: _opts.firstName,
    newLastName: _opts.lastName,
    newStreet: _opts.street,
    newPostCode: _opts.postCode,
    newCity: _opts.city,
    newCtry: _opts.country,
    newIp: _opts.ip,
    newPhoneNumber: _opts.phoneNumber,
    newMobileNumber: _opts.mobileNumber,
    newBirthDate: _opts.birthdate,
    newIsCompany: utils.boolToString(_opts.isCompany),
    newCompanyName: _opts.companyName,
    newCompanyWebsite: _opts.companyWebsite,
    newCompanyDescription: _opts.companyDescription,
    newCompanyIdentificationNumber: _opts.companyIdentificationNumber,
    newIsDebtor: utils.boolToString(_opts.isDebtor),
    newNationality: _opts.nationality,
    newBirthcity: _opts.birthCity,
    newBirthcountry: _opts.birthCountry,
    newPayerOrBeneficiary: _opts.payerOrBeneficiary
  });

  return this._request('UpdateWalletDetails', ip, opts).get('WALLET');
};

Client.prototype.updateWalletStatus = function (ip, _opts) {
  var opts = {
    wallet: _opts.wallet,
    newStatus: _.get(constants.WALLET_STATUS, _opts.status)
  };

  return this._request('UpdateWalletStatus', ip, opts).get('WALLET');
};

Client.prototype.getWalletDetails = function (ip, _opts) {
  var opts = _.merge({
    version: '1.8'
  }, {
    email: _opts.email,
    wallet: _opts.wallet
  });

  return this._request('GetWalletDetails', ip, opts).get('WALLET');
};

Client.prototype.moneyIn = function (ip, _opts) {
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

  return this._request('MoneyIn', ip, opts).get('TRANS').get('HPAY');
};

Client.prototype.moneyIn3DInit = function (ip, _opts) {
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

  return this._request('MoneyIn3DInit', ip, opts)
    .get('MONEYIN3DINIT')
    .then(function (data) {
      return {
        acs: _.get(data, 'ACS'),
        transaction: _.get(data, 'TRANS.HPAY')
      };
    });
};

Client.prototype.moneyIn3DConfirm = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    version: '1.1',
    cardCode: _opts.cardCrypto,
    isPreAuth: utils.boolToString(_opts.isPreAuth)
  });

  return this._request('MoneyIn3DConfirm', ip, opts).get('MONEYIN3DCONFIRM').get('HPAY');
};

Client.prototype.moneyInWebInit = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    version: '1.3',
    amountTot: utils.numberToFixed(_opts.amount),
    amountCom: utils.numberToFixed(_opts.commission),
    useRegisteredCard: utils.boolToString(_opts.useRegisteredCard),
    autoCommission: utils.boolToString(_opts.autoCommission),
    registerCard: utils.boolToString(_opts.registerCard),
    wkToken: _opts.token
  });

  return this._request('MoneyInWebInit', ip, opts).get('MONEYINWEB');
};

Client.prototype.registerCard = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    version: '1.2',
    cardCode: _opts.cardCrypto
  });

  if (opts.cardNumber) {
    opts.cardType = utils.cardNumberToType(opts.cardNumber);
  }

  return this._request('RegisterCard', ip, opts).get('CARD');
};

Client.prototype.unregisterCard = function (ip, _opts) {
  var opts = _.assign({}, _opts);

  return this._request('UnregisterCard', ip, opts).get('CARD');
};

Client.prototype.moneyInWithCardId = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    version: '1.1',
    amountTot: utils.numberToFixed(_opts.amount),
    amountCom: utils.numberToFixed(_opts.commission),
    autoCommission: utils.boolToString(_opts.autoCommission),
    isPreAuth: utils.boolToString(_opts.isPreAuth),
    wkToken: _opts.token
  });

  return this._request('MoneyInWithCardId', ip, opts, 'MoneyInResult').get('TRANS').get('HPAY');
};

Client.prototype.moneyInValidate = function (ip, _opts) {
  var opts = _.assign({}, _opts);

  return this._request('MoneyInValidate', ip, opts).get('MONEYIN').get('HPAY');
};

Client.prototype.sendPayment = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    amount: utils.numberToFixed(_opts.amount)
  });

  return this._request('SendPayment', ip, opts).get('TRANS').get('HPAY');
};

Client.prototype.registerIBAN = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    version: '1.1'
  });

  return this._request('RegisterIBAN', ip, opts).get('IBAN');
};

Client.prototype.createIBAN = function(ip, _opts) {
  const opts = {..._opts, version: '1,0'};

  return this._request('CreateIBAN', ip, opts);
};

Client.prototype.moneyOut = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    version: '1.3',
    amountTot: utils.numberToFixed(_opts.amount),
    amountCom: utils.numberToFixed(_opts.commission),
    autoCommission: utils.boolToString(_opts.autoCommission)
  });

  return this._request('MoneyOut', ip, opts).get('TRANS').get('HPAY');
};

Client.prototype.getPaymentDetails = function (ip, _opts) {
  var opts = _.assign({}, _opts);

  return this._request('GetPaymentDetails', ip, opts).get('TRANS').get('HPAY');
};

Client.prototype.getMoneyInTransDetails = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    version: '1.3',
    startDate: utils.dateToUnix(_opts.from) || 0,
    endDate: utils.dateToUnix(_opts.to)
  });

  return this._request('GetMoneyInTransDetails', ip, opts).get('TRANS').get('HPAY');
};

Client.prototype.getMoneyOutTransDetails = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    version: '1.4'
  });

  return this._request('GetMoneyOutTransDetails', ip, opts).get('TRANS').get('HPAY');
};

Client.prototype.uploadFile = function (ip, _opts) {
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
    return (buffer instanceof Buffer) ? buffer.toString('base64') : buffer;
  })
  .bind(this)
  .then(function (buffer) {
    var opts = _.merge({
      version: '1.1'
    }, {
      wallet: _opts.wallet,
      fileName: _opts.fileName,
      type: _.get(constants.DOCUMENT_TYPE, _.get(_opts, 'type')),
      buffer: buffer,
      sddMandateId: _opts.sddMandateId
    });
    return this._request('UploadFile', ip, opts).get('UPLOAD');
  });
};

Client.prototype.getKycStatus = function (ip, _opts) {
  var opts = _.merge({
    version: '1.5'
  }, {
    updateDate: utils.dateToUnix(_opts.from)
  });

  return this._request('GetKycStatus', ip, opts).get('WALLETS');
};

Client.prototype.getMoneyInIBANDetails = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    version: '1.4',
    updateDate: utils.dateToUnix(_opts.from) || 0
  });

  return this._request('GetMoneyInIBANDetails', ip, opts).get('TRANS').get('HPAY');
};

Client.prototype.refundMoneyIn = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    amountToRefund: utils.numberToFixed(_opts.amount),
    version: '1.2'
  });

  return this._request('RefundMoneyIn', ip, opts).get('TRANS').get('HPAY');
};

Client.prototype.getBalances = function (ip, _opts) {
  var opts = _.merge({}, {
    updateDate: utils.dateToUnix(_opts.from),
    walletIdStart: String(_opts.fromWalletId),
    walletIdEnd: String(_opts.toWalletId),
    version: '1.1'
  });

  return this._request('GetBalances', ip, opts).then(results => {
    if (_.get(results, 'WALLETS.WALLET')) {
      return _.get(results, 'WALLETS.WALLET');
    }

    return [];
  });
};

Client.prototype.moneyIn3DAuthenticate = function (ip, _opts) {
  var opts = _.assign({}, _opts);

  return this._request('MoneyIn3DAuthenticate', ip, opts).get('MONEYIN');
};

Client.prototype.createGiftCodeAmazon = function (ip, _opts) {
  var opts = _.assign({}, _opts);

  return this._request('CreateGiftCodeAmazon', ip, opts).get('CreateGiftCodeAmazonConfirm').get('HPAY');
};

Client.prototype.moneyInIDealInit = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    version: '1.0',
    amountTot: utils.numberToFixed(_opts.amount),
    amountCom: utils.numberToFixed(_opts.commission),
    autoCommission: utils.boolToString(_opts.autoCommission),
    returnUrl: _opts.returnUrl
  });

  return this._request('MoneyInIDealInit', ip, opts).get('IDEALINIT');
};

Client.prototype.moneyInIDealConfirm = function (ip, _opts) {
  var opts = _.assign({}, _opts);

  return this._request('MoneyInIDealConfirm', ip, opts).get('IDEAL').get('HPAY');
};

Client.prototype.registerSDDMandate = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    isRecurring: utils.boolToString(_opts.isRecurring)
  });

  return this._request('RegisterSddMandate', ip, opts).get('SDDMANDATE');
};

Client.prototype.unregisterSDDMandate = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    sddMandateId: utils.stringToInteger(_opts.sddMandateId)
  });

  return this._request('UnregisterSddMandate', ip, opts, 'UnRegisterSddMandateResult').get('SDDMANDATE');
};

Client.prototype.moneyInSDDInit = function (ip, _opts) {
  var opts = _.assign({
    amountTot: utils.numberToFixed(_opts.amount),
    amountCom: utils.numberToFixed(_opts.commission)
  }, _opts, {
    autoCommission: utils.boolToString(_opts.autoCommission),
    sddMandateId: utils.stringToInteger(_opts.sddMandateId),
    collectionDate: utils.dateToDayString(_opts.collectionDate)
  });

  return this._request('MoneyInSddInit', ip, opts).get('TRANS').get('HPAY');
};

Client.prototype.getMoneyInSDD  = function (ip, _opts) {
  var opts = _.assign({
    updateDate: utils.dateToUnix(_opts.from) || 0
  }, _opts);

  return this._request('GetMoneyInSdd', ip, opts).then(function (val) {
    var ret = _.get(val, 'TRANS', []);
    return _.isArray(ret) ? ret : [];
  }).map(function (val) {
    return _.get(val, 'HPAY');
  });
};

Client.prototype.getMoneyInChequeDetails  = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    version: '1.9',
    updateDate: utils.dateToUnix(_opts.from) || 0
  });

  return this._request('GetMoneyInChequeDetails', ip, opts).get('TRANS').get('HPAY');
};

Client.prototype.getWalletTransHistory  = function (ip, _opts) {
  var opts = {
    version: '2.0',
    wallet: _opts.wallet
  };

  if (_opts.from) {
    opts.startDate = utils.dateToUnix(_opts.from)
  }

  if (_opts.to) {
    opts.endDate = utils.dateToUnix(_opts.to)
  }

  return this._request('GetWalletTransHistory', ip, opts).get('TRANS').then(results => {
     if (_.get(results, 'HPAY')) {
       return _.get(results, 'HPAY')
     }

    return [];
  });
};

Client.prototype.getChargebacks  = function (ip, _opts) {
  var opts = _.assign({}, _opts, {
    version: '1.8',
    updateDate: utils.dateToUnix(_opts.from) || 0
  });

  return this._request('GetChargebacks', ip, opts).get('TRANS').get('HPAY');
};

Client.prototype.moneyInChequeInit  = function (ip, _opts) {
  var opts = _.assign({
    amountTot: utils.numberToFixed(_opts.amount),
    amountCom: utils.numberToFixed(_opts.commission)
  }, _opts, {
    autoCommission: utils.boolToString(_opts.autoCommission)
  });

  return this._request('MoneyInChequeInit', ip, opts).get('TRANS').get('HPAY');
};

Client.prototype.createVCC = function (ip, _opts) {
  var opts = _.assign({
    amount: utils.numberToFixed(_opts.amountVCC)
  }, _opts);

  return this._request('CreateVCC', ip, opts).get('TRANS').get('HPAY');
};

Client.prototype.moneyInNeosurf  = function (ip, _opts) {
  var opts = _.assign({}, _opts);

  return this._request('MoneyInNeosurf', ip, opts).get('TRANS').get('HPAY');
};

Client.prototype.signDocumentInit = function (ip, _opts) {
  var opts = _.assign({}, _opts);

  return this._request('SignDocumentInit', ip, opts).get('SIGNDOCUMENT');
};

Client.prototype.getWizypayAds  = function (ip, _opts) {
  var opts = _.assign({}, _opts);

  return this._request('GetWizypayAds', ip, opts)
    .then(function (data) {
      return Promise.all([
        Promise.get(data, 'OFFERS').get('OFFER'),
        Promise.get(data, 'ADS').get('AD')
      ]);
    });
};

module.exports = Client;
