'use strict';

var assert = require('assert');

var _ = require('lodash');
var Promise = require('bluebird');
var soap = require('soap');

var utils = require('./utils');
var models = require('./models');
var validator = require('./validator');
var validationSchemas = require('./validation-schemas');
var errors = require('./errors');

var config = require('./config');

var _createSoapClient = Promise.promisify(soap.createClient, { context: soap });

function Client (login, pass, endpoint) {
  assert(login, 'Lemonway login not set');
  assert(pass, 'Lemonway pass not set');
  assert(endpoint, 'Lemonway endpoint not set');

  this._login = login;
  this._pass = pass;
  this._endpoint = endpoint;
}

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
      return promise(_.assign({
        wlLogin: this._login,
        wlPass: this._pass
      }, _args));
    })
    .tap(console.log)
    .get(resultName ? resultName : method + 'Result')
    .then(function (result) {
      if (result.E) {
        throw new errors.LemonwayError(_.get(result, 'E.Msg'), _.get(result, 'E.Code'));
      }
      return result;
    });
};

Client.prototype.fastPay = function (_opts) {
  var opts = _.assign({}, _opts, {
    amount: typeof _opts === 'string' ? _opts : utils.numberToFixed(_opts.amount)
  });
  return this._request('FastPay', opts)
    .bind(this)
    .then(function (data) {
      return new models.Transaction(this, _.get(data, 'TRANS.HPAY'));
    });
};

Client.prototype.registerWallet = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('RegisterWallet', opts)
    .bind(this)
    .then(function (data) {
      return new models.Wallet(this, _.get(data, 'WALLET'));
    });
};

Client.prototype.updateWallet = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('UpdateWalletDetails', opts, 'UpdateWalletStatusResult')
    .bind(this)
    .then(function (data) {
      return new models.Wallet(this, _.get(data, 'WALLET'));
    });
};

Client.prototype.updateWalletStatus = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('UpdateWalletStatus', opts)
    .bind(this)
    .then(function (data) {
      return new models.Wallet(this, _.get(data, 'WALLET'));
    });
};

Client.prototype.getWalletDetails = function (_opts) {
  var opts = _opts.wallet ? { wallet: _opts.wallet } : { email: _opts.email };
  opts.walletIp = _opts.walletIp;

  return this._request('GetWalletDetails', opts)
    .bind(this)
    .then(function (data) {
      return new models.Wallet(this, _.get(data, 'WALLET'));
    });
};

Client.prototype.moneyIn = function (_opts) {
  var opts = _.assign({}, _opts, {
    amountTot: utils.numberToFixed(_opts.amountTot),
    amountCom: utils.numberToFixed(_opts.amountCom)
  });

  return this._request('MoneyIn', opts)
    .bind(this)
    .get('TRANS').get('HPAY')
    .then(function (data) {
      return new models.Transaction(this, data);
    });
};

Client.prototype.moneyIn3DInit = function (_opts) {
  var opts = _.assign({}, _opts, {
    amountTot: utils.numberToFixed(_opts.amountTot),
    amountCom: utils.numberToFixed(_opts.amountCom)
  });

  return this._request('MoneyIn3DInit', opts)
    .bind(this)
    .get('MONEYIN3DINIT')
    .then(function (data) {
      return [
        new models.Acs(this, _.get(data, 'ACS')),
        new models.Transaction(this, _.get(data, 'TRANS.HPAY'))
      ];
    });
};

Client.prototype.moneyIn3DConfirm = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('MoneyIn3DConfirm', opts)
    .bind(this)
    .get('MONEYIN').get('HPAY')
    .then(function (data) {
      return new models.Transaction(this, data)
    });
};

Client.prototype.moneyInWebInit = function (_opts) {
  var opts = _.assign({}, _opts, {
    amountTot: utils.numberToFixed(_opts.amountTot),
    amountCom: utils.numberToFixed(_opts.amountCom)
  });

  return this._request('MoneyInWebInit', opts)
    .bind(this)
    .get('MONEYINWEB')
    .then(function (data) {
      return new models.MoneyInWeb(this, data);
    });
};

Client.prototype.registerCard = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('RegisterCard', opts)
    .bind(this)
    .get('CARD')
    .then(function (data) {
      return new models.Card(this, data);
    });
};

Client.prototype.unregisterCard = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('UnregisterCard', opts)
    .bind(this)
    .get('CARD')
    .then(function (data) {
      return new models.Card(this, data);
    });
};

Client.prototype.moneyInWithCardId = function (_opts) {
  var opts = _.assign({}, _opts, {
    amountTot: utils.numberToFixed(_opts.amountTot),
    amountCom: utils.numberToFixed(_opts.amountCom)
  });

  return this._request('MoneyInWithCardId', opts)
    .bind(this)
    .get('TRANS').get('HPAY')
    .then(function (data) {
      return new models.Transaction(this, data);
    })
};

Client.prototype.moneyInValidate = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('MoneyInValidate', opts)
    .bind(this)
    .get('TRANS').get('HPAY')
    .then(function (data) {
      return new models.Transaction(this, data);
    })
};

Client.prototype.sendPayment = function (_opts) {
  var opts = _.assign({}, _opts, {
    amount: utils.numberToFixed(_opts.amountTot)
  });

  return this._request('SendPayment', opts)
    .bind(this)
    .get('TRANS').get('HPAY')
    .then(function (data) {
      return new models.Transaction(this, data);
    })
};

Client.prototype.registerIBAN = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('RegisterIBAN', opts)
    .bind(this)
    .get('IBAN')
    .then(function (data) {
      return new models.IBAN(this, data);
    })
};

Client.prototype.moneyOut = function (_opts) {
  var opts = _.assign({}, _opts, {
    amountTot: utils.numberToFixed(_opts.amountTot),
    amountCom: utils.numberToFixed(_opts.amountCom)
  });

  return this._request('MoneyOut', opts)
    .bind(this)
    .get('TRANS').get('HPAY')
    .then(function (data) {
      return new models.Transaction(this, data);
    })
};

Client.prototype.getPaymentDetails = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('GetPaymentDetails', opts)
    .bind(this)
    .get('TRANS').get('HPAY')
    .map(function (data) {
      return new models.Transaction(this, data);
    });
};

Client.prototype.getMoneyInTransDetails = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('GetMoneyInTransDetails', opts)
    .bind(this)
    .get('TRANS').get('HPAY')
    .map(function (data) {
      return new models.Transaction(this, data);
    });
};

Client.prototype.getMoneyOutTransDetails = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('GetMoneyOutTransDetails', opts)
    .bind(this)
    .get('TRANS').get('HPAY')
    .map(function (data) {
      return new models.Transaction(this, data);
    });
};

Client.prototype.uploadFile = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('UploadFile', opts)
    .bind(this)
    .get('UPLOAD')
    .map(function (data) {
      return new models.Upload(this, data);
    });
};

Client.prototype.getKycStatus = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('GetKycStatus', opts)
    .bind(this)
    .get('WALLETS').get('WALLET')
    .map(function (data) {
      return new models.Wallet(this, data);
    });
};

Client.prototype.getMoneyInIBANDetails = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('GetMoneyInIBANDetails', opts)
    .bind(this)
    .get('TRANS').get('HPAY')
    .map(function (data) {
      return new models.Transaction(this, data);
    });
};

Client.prototype.refundMoneyIn = function (_opts) {
  var opts = _.assign({}, _opts, {
    amountToRefund: utils.numberToFixed(_opts.amountToRefund)
  });

  return this._request('RefundMoneyIn', opts)
    .bind(this)
    .get('TRANS').get('HPAY')
    .map(function (data) {
      return new models.Transaction(this, data);
    });
};

Client.prototype.getBalances = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('GetBalances', opts)
    .bind(this)
    .get('WALLETS').get('WALLET')
    .map(function (data) {
      return new models.Wallet(this, data);
    });
};

Client.prototype.moneyIn3DAuthenticate = function (_opts) {
  var opts = _.assign({}, _opts);

  return this._request('MoneyIn3DAuthenticate', opts)
    .bind(this)
    .get('WALLETS').get('WALLET')
    .map(function (data) {
      return new models.MoneyIn(this, data);
    });
};

module.exports = Client;