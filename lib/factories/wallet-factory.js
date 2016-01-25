'use strict';

var _ = require('lodash');

var utils = require('../utils');
var Acs = require('../models/acs');
var Card = require('../models/card');
var SDDMandate = require('../models/sdd-mandate');
var IBAN = require('../models/IBAN');
var VirtualCreditCard = require('../models/virtual-credit-card');
var Document = require('../models/document');

function WalletFactory (lemonway) {
  var factory = this;
  this._lemonway = lemonway;

  this.Wallet = function Wallet (data) {
    this._factory = factory;
    this._lemonway = lemonway;

    this.id = _.get(data, 'ID');
    this.lemonWayId = _.get(data, 'LWID');
    this.balance = parseFloat(_.get(data, 'BAL'));
    this.name = _.get(data, 'NAME');
    this.email = _.get(data, 'EMAIL');
    this.status = _.get(data, 'STATUS');
    this.blocked = _.get(data, 'BLOCKED');
    this.method = _.get(data, 'METHOD');
    if (_.get(data, 'DOCS')) {
      this.documents = _.map(_.get(data, 'DOCS'), function (doc) {
          return new Document(doc.DOC ? doc.DOC : doc);
      });
    }
    if (_.get(data, 'IBAN')) {
      this.ibans = _.map(_.get(data, 'IBAN'), function (iban) {
        return new IBAN(iban);
      });
    }
    if (_.get(data, 'SDDMANDATES')) {
      this.sddMandates = _.map(_.get(data, 'SDDMANDATES'), function (sddMandate) {
        return new SDDMandate(sddMandate);
      });
    }
  };

  var instanceMethods = {
    'update': ['update'],
    'moneyIn': ['moneyIn'],
    'moneyInWebInit': ['moneyInWebInit'],
    'moneyIn3DInit': ['moneyIn3DInit'],
    'registerCard': ['registerCard'],
    'unregisterCard': ['unregisterCard'],
    'moneyInWithCard': ['moneyInWithCard'],
    'registerSDDMandate': ['registerSDDMandate'],
    'unregisterSDDMandate': ['unregisterSDDMandate'],
    'updateWalletStatus': ['updateWalletStatus', 'updateStatus'],
    'moneyInSDDInit': ['moneyInSDDInit'],
    'moneyInChequeInit': ['moneyInChequeInit'],
    'registerIBAN': ['registerIBAN'],
    'moneyOut': ['moneyOut'],
    'sendPayment': ['sendPayment'],
    'createVCC': ['createVCC', 'createVirtualCreditCard'],
    'uploadFile': ['uploadFile'],
    'getWalletTransHistory': ['getWalletTransHistory', 'getTransactions']
  };

  _.each(instanceMethods, function (aliases, method) {
    _.each(aliases, function (alias) {
      factory.Wallet.prototype[alias] = function (ip) {
        var _arguments = _.toArray(arguments).splice(1);
        return factory[method].apply(factory, [ip, this].concat(_arguments));
      };
    });
  });

}

WalletFactory.prototype.create =
WalletFactory.prototype.register =
WalletFactory.prototype.registerWallet = function (ip, opts) {
  return this._lemonway._client.registerWallet(ip, opts)
    .bind(this)
    .then(function (data) {
      return new this.Wallet(data);
    });
};

WalletFactory.prototype.list =
WalletFactory.prototype.getBalances = function (ip, opts) {
  opts = opts || {};
  return this._lemonway._client.getBalances(ip, opts)
    .bind(this)
    .map(function (data) {
      return new this.Wallet(data);
    });
};

WalletFactory.prototype.get =
WalletFactory.prototype.getWalletDetails = function (ip, wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: _.get(wallet, 'id'),
    email: _.get(wallet, 'email')
  });

  if (!opts.wallet && !opts.email) {
    opts.wallet = wallet;
  }

  return this._lemonway._client.getWalletDetails(ip, opts)
    .bind(this)
    .then(function (data) {
      return {
        wallet: new this.Wallet(data),
        documents: _.map(_.get(data, 'DOCS', []), function (data) { return new Document(data) }),
        ibans: _.map(_.get(data, 'IBANS', []), function (data) { return new IBAN(data) }),
        sddMandates: _.map(_.get(data, 'SDDMANDATES', []), function (data) { return new SDDMandate(data) }),
        creditCards: _.map(_.get(data, 'CARDS', []), function (data) { return new Card(data) })
      };
    });
};

WalletFactory.prototype.listKyc =
WalletFactory.prototype.getKycStatus = function (ip, opts) {
  return this._lemonway._client.getKycStatus(ip, opts)
    .bind(this)
    .map(function (data) {
      return {
        wallet: new this.Wallet(data),
        documents: _.map(_.get(data, 'DOCS', []), function (data) { return new Document(data) }),
        ibans: _.map(_.get(data, 'IBANS', []), function (data) { return new IBAN(data) }),
        sddMandates: _.map(_.get(data, 'SDDMANDATES', []), function (data) { return new SDDMandate(data) })
      };
    });
};

WalletFactory.prototype.update = function (ip, wallet, _opts) {
  var opts = _.assign({}, _opts, {
    clientIp: _opts.ip || this._lemonway._ip,
    id: wallet.id ? wallet.id : wallet
  });

  return this._lemonway._client.updateWallet(ip, opts)
    .bind(this)
    .then(function (data) {
      return new this.Wallet(data);
    });
};

WalletFactory.prototype.moneyIn = function (ip, wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._lemonway._client.moneyIn(ip, opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });
};

WalletFactory.prototype.moneyInWebInit = function (ip, wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._lemonway._client.moneyInWebInit(ip, opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.MoneyInWeb.MoneyInWeb(data);
    });
};

WalletFactory.prototype.moneyIn3DInit = function (ip, wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._lemonway._client.moneyIn3DInit(ip, opts)
    .bind(this)
    .then(function (data) {
      return {
        acs: new Acs(data.acs),
        transaction: new this._lemonway.Transaction.Transaction(data.transaction)
      }
    });
};

WalletFactory.prototype.registerCard = function(ip, wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._lemonway._client.registerCard(ip, opts)
    .then(function (data) {
      return new Card(data);
    });
};

WalletFactory.prototype.unregisterCard = function(ip, wallet, card, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet,
    cardId: card.id ? card.id : card
  });

  return this._lemonway._client.unregisterCard(ip, opts)
    .then(function (data) {
      return new Card(data);
    });
};

WalletFactory.prototype.moneyInWithCard = function(ip, wallet, card, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet,
    cardId: card.id ? card.id : card
  });

  return this._lemonway._client.moneyInWithCardId(ip, opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });
};

WalletFactory.prototype.registerSDDMandate = function(ip, wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._lemonway._client.registerSDDMandate(ip, opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.SDDMandate.SDDMandate(data);
    });
};

WalletFactory.prototype.unregisterSDDMandate = function(ip, wallet, mandate, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet,
    sddMandateId: _.get(mandate, 'id', mandate)
  });

  return this._lemonway._client.unregisterSDDMandate(ip, opts)
    .then(function (data) {
      return new SDDMandate(data);
    });
};

WalletFactory.prototype.updateWalletStatus = function(ip, wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._lemonway._client.updateWalletStatus(ip, opts)
    .bind(this)
    .then(function (data) {
      return new this.Wallet(data);
    });
};

WalletFactory.prototype.moneyInSDDInit = function (ip, wallet, mandate, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: _.get(wallet, 'id', wallet),
    sddMandateId: _.get(mandate, 'id', mandate)
  });

  return this._lemonway._client.moneyInSDDInit(ip, opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });
};

WalletFactory.prototype.moneyInChequeInit = function (ip, wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: _.get(wallet, 'id', wallet)
  });

  return this._lemonway._client.moneyInChequeInit(ip, opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });
};

WalletFactory.prototype.registerIBAN = function (ip, wallet, _opts) {
  var opts = _.assign({
    wallet: _.get(wallet, 'id', wallet)
  }, _opts);

  return this._lemonway._client.registerIBAN(ip, opts)
    .bind(this)
    .then(function (data) {
      return new IBAN(data);
    });
};

WalletFactory.prototype.moneyOut = function (ip, wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: _.get(wallet, 'id', wallet),
    ibanId: _.get(_opts, 'iban.id', _.get(_opts, 'iban'))
  });

  return this._lemonway._client.moneyOut(ip, opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });
};

WalletFactory.prototype.sendPayment = function (ip, fromWallet, toWallet, _opts) {
  var opts = _.assign({}, _opts, {
    debitWallet: _.get(fromWallet, 'id', fromWallet),
    creditWallet: _.get(toWallet, 'id', toWallet)
  });

  return this._lemonway._client.sendPayment(ip, opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });
};

WalletFactory.prototype.createVCC = function (ip, wallet, _opts) {
  var opts = _.assign({}, _opts, {
    debitWallet: _.get(wallet, 'id', wallet)
  });

  return this._lemonway._client.createVCC(ip, opts)
    .bind(this)
    .then(function (data) {
      return {
        transaction: new this._lemonway.Transaction.Transaction(data),
        virtualCreditCard: new VirtualCreditCard(_.get(data, 'VCC'))
      };
    });
};

WalletFactory.prototype.uploadFile = function (ip, wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: _.get(wallet, 'id', wallet)
  });

  return this._lemonway._client.uploadFile(ip, opts)
    .bind(this)
    .then(function (data) {
      return new Document(data);
    });
};

WalletFactory.prototype.getWalletTransHistory = function (ip, wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: _.get(wallet, 'id', wallet)
  });

  return this._lemonway._client.getWalletTransHistory(ip, opts)
    .bind(this)
    .map(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });
};

module.exports = WalletFactory;