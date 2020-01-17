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

  this.Wallet = function Wallet (data) {
    this.id = _.get(data, 'ID');
    this.lemonWayId = _.get(data, 'LWID');
    this.balance = parseFloat(_.get(data, 'BAL', 0));
    this.name = _.get(data, 'NAME');
    this.email = _.get(data, 'EMAIL');
    this.status = _.get(data, 'STATUS') || _.get(data, 'S');
    this.blocked = _.get(data, 'BLOCKED');
    this.method = _.get(data, 'METHOD');
    if (_.get(data, 'DOCS')) {
      this.documents = _.map(_.get(data, 'DOCS.DOC', _.get(data, 'DOCS')), function (doc) {
          return new Document(doc.DOC ? doc.DOC : doc);
      });
    }
    if (_.get(data, 'IBANS')) {
      this.ibans = _.map(_.get(data, 'IBANS.IBAN', _.get(data, 'IBANS')), function (iban) {
        return new IBAN(iban);
      });
    }
    if (_.get(data, 'SDDMANDATES')) {
      this.sddMandates = _.map(_.get(data, 'SDDMANDATES.SDDMANDATE'), function (sddMandate) {
        return new SDDMandate(sddMandate);
      });
    }
  };

  this.create =
  this.register =
  this.registerWallet = function (ip, opts) {
    opts = opts || {};
    return lemonway._client.registerWallet(ip, opts)
      .bind(this)
      .then(function (data) {
        return new this.Wallet(data);
      });
  };

  this.list =
  this.getBalances = function (ip, opts) {
    opts = opts || {};
    return lemonway._client.getBalances(ip, opts)
      .bind(this)
      .map(function (data) {
        return new this.Wallet(data);
      });
  };

  this.get =
  this.getWalletDetails = function (ip, wallet, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: _.get(wallet, 'id'),
      email: _.get(wallet, 'email')
    });

    if (!opts.wallet && !opts.email) {
      opts.wallet = wallet;
    }

    return lemonway._client.getWalletDetails(ip, opts)
      .bind(this)
      .then(function (data) {
        return {
          wallet: new this.Wallet(data),
          documents: _.map(_.get(data, 'DOCS', []), function (data) { return new Document(data) }),
          creditCards: _.map(_.get(data, 'CARDS.CARD', []), function (data) { return new Card(data) })
        };
      });
  };

  this.listKyc =
  this.getKycStatus = function (ip, opts) {
    return lemonway._client.getKycStatus(ip, opts)
      .bind(this)
      .get('WALLET')
      .map(function (data) {
        return {
          wallet: new this.Wallet(data),
          documents: _.map(_.get(data, 'DOCS', []), function (data) { return new Document(data) }),
          ibans: _.map(_.get(data, 'IBANS', []), function (data) { return new IBAN(data) }),
        };
      });
  };

  this.update = function (ip, wallet, _opts) {
    var opts = _.assign({}, _opts, {
      ip: _opts.ip || lemonway._ip,
      id: wallet.id ? wallet.id : wallet
    });

    return lemonway._client.UpdateWalletDetails(ip, opts)
      .bind(this)
      .then(function (data) {
        return new this.Wallet(data);
      });
  };

  this.moneyIn = function (ip, wallet, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet
    });

    return lemonway._client.moneyIn(ip, opts)
      .bind(this)
      .then(function (data) {
        return new lemonway.Transaction.Transaction(data);
      });
  };

  this.moneyInWebInit = function (ip, wallet, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet
    });

    return lemonway._client.moneyInWebInit(ip, opts)
      .bind(this)
      .then(function (data) {
        return new lemonway.MoneyInWeb.MoneyInWeb(data);
      });
  };

  this.moneyIn3DInit = function (ip, wallet, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet
    });

    return lemonway._client.moneyIn3DInit(ip, opts)
      .bind(this)
      .then(function (data) {
        return {
          acs: new Acs(data.acs),
          transaction: new lemonway.Transaction.Transaction(data.transaction)
        }
      });
  };

  this.moneyInIDealInit = function (ip, wallet, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet
    });

    return lemonway._client.moneyInIDealInit(ip, opts)
      .bind(this)
      .then(function (data) {
        return new lemonway.MoneyInIDeal.MoneyInIDeal(data);
      });
  };

  this.moneyInIDealConfirm = function (ip, wallet, transactionId) {
    var opts = _.assign({}, {
      wallet: wallet.id ? wallet.id : wallet,
      transactionId
    });

    return lemonway._client.moneyInIDealConfirm(ip, opts)
      .bind(this)
      .then(function (data) {
        return new lemonway.Transaction.Transaction(data)
      });
  };

  this.registerCard = function(ip, wallet, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet
    });

    return lemonway._client.registerCard(ip, opts)
      .then(function (data) {
        return new Card(data);
      });
  };

  this.unregisterCard = function(ip, wallet, card, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet,
      cardId: card.id ? card.id : card
    });

    return lemonway._client.unregisterCard(ip, opts)
      .then(function (data) {
        return new Card(data);
      });
  };

  this.moneyInWithCard = function(ip, wallet, card, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet,
      cardId: card.id ? card.id : card
    });

    return lemonway._client.moneyInWithCardId(ip, opts)
      .bind(this)
      .then(function (data) {
        return new lemonway.Transaction.Transaction(data);
      });
  };

  this.registerSDDMandate = function(ip, wallet, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet
    });

    return lemonway._client.registerSDDMandate(ip, opts)
      .bind(this)
      .then(function (data) {
        return new lemonway.SDDMandate.SDDMandate(data);
      });
  };

  this.unregisterSDDMandate = function(ip, wallet, mandate, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet,
      sddMandateId: _.get(mandate, 'id', mandate)
    });

    return lemonway._client.unregisterSDDMandate(ip, opts)
      .then(function (data) {
        return new SDDMandate(data);
      });
  };

  this.updateWalletStatus = function(ip, wallet, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: wallet.id ? wallet.id : wallet
    });

    return lemonway._client.updateWalletStatus(ip, opts)
      .bind(this)
      .then(function (data) {
        return new this.Wallet(data);
      });
  };

  this.moneyInSDDInit = function (ip, wallet, mandate, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: _.get(wallet, 'id', wallet),
      sddMandateId: _.get(mandate, 'id', mandate)
    });

    return lemonway._client.moneyInSDDInit(ip, opts)
      .bind(this)
      .then(function (data) {
        return new lemonway.Transaction.Transaction(data);
      });
  };

  this.moneyInChequeInit = function (ip, wallet, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: _.get(wallet, 'id', wallet)
    });

    return lemonway._client.moneyInChequeInit(ip, opts)
      .bind(this)
      .then(function (data) {
        return new lemonway.Transaction.Transaction(data);
      });
  };

  this.registerIBAN = function (ip, wallet, _opts) {
    var opts = _.assign({
      wallet: _.get(wallet, 'id', wallet)
    }, _opts);

    return lemonway._client.registerIBAN(ip, opts)
      .bind(this)
      .then(function (data) {
        return new IBAN(data);
      });
  };

  this.createIBAN = function (ip, wallet,  opts) {
    return lemonway._client.createIBAN(ip, opts)
      .bind(this)
      .then(function (data) {
        return new IBAN(data);
      });
  };

  this.moneyOut = function (ip, wallet, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: _.get(wallet, 'id', wallet),
      ibanId: _.get(_opts, 'iban.id', _.get(_opts, 'iban'))
    });

    return lemonway._client.moneyOut(ip, opts)
      .bind(this)
      .then(function (data) {
        return new lemonway.Transaction.Transaction(data);
      });
  };

  this.transfer =
    this.sendPayment = function (ip, fromWallet, toWallet, _opts) {
      var opts = _.assign({}, _opts, {
        debitWallet: _.get(fromWallet, 'id', fromWallet),
        creditWallet: _.get(toWallet, 'id', toWallet)
      });

      return lemonway._client.sendPayment(ip, opts)
        .bind(this)
        .then(function (data) {
          return new lemonway.Transaction.Transaction(data);
        });
    };

  this.createVCC = function (ip, wallet, _opts) {
    var opts = _.assign({}, _opts, {
      debitWallet: _.get(wallet, 'id', wallet)
    });

    return lemonway._client.createVCC(ip, opts)
      .bind(this)
      .then(function (data) {
        return {
          transaction: new lemonway.Transaction.Transaction(data),
          virtualCreditCard: new VirtualCreditCard(_.get(data, 'VCC'))
        };
      });
  };

  this.uploadFile = function (ip, wallet, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: _.get(wallet, 'id', wallet)
    });

    return lemonway._client.uploadFile(ip, opts)
      .bind(this)
      .then(function (data) {
        return new Document(data);
      });
  };

  this.getWalletTransHistory = function (ip, wallet, _opts) {
    var opts = _.assign({}, _opts, {
      wallet: _.get(wallet, 'id', wallet)
    });

    return lemonway._client.getWalletTransHistory(ip, opts)
      .bind(this)
      .map(function (data) {
        return new lemonway.Transaction.Transaction(data);
      });
  };


  var instanceMethods = {
    'update': ['update'],
    'moneyIn': ['moneyIn'],
    'moneyInWebInit': ['moneyInWebInit'],
    'moneyInIDealInit': ['moneyInIDealInit'],
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
    'createIBAN': ['createIBAN'],
    'moneyOut': ['moneyOut'],
    'sendPayment': ['sendPayment', 'transfer'],
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

module.exports = WalletFactory;
