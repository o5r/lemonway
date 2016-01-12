'use strict';

var _ = require('lodash');

var utils = require('../utils');
var Acs = require('../models/acs');
var Card = require('../models/card');
var SDDMandate = require('../models/sdd-mandate');

function WalletFactory (lemonway) {
  var factory = this;
  this._lemonway = lemonway;

  this.Wallet = function Wallet (data) {
    this._factory = factory;
    this._lemonway = lemonway;

    this.id = data.ID;
    this.lemonWayId = data.LWID;
    this.balance = parseFloat(data.BAL);
    this.name = data.NAME;
    this.email = data.EMAIL;
    this.status = data.STATUS;
    this.blocked = data.BLOCKED;
    this.method = data.METHOD;
    if (data.DOCS) {
      this.documents = _.map(data.DOCS, function (doc) {
        return new Document(client, doc.DOC);
      });
    }
    if (data.IBAN) {
      this.ibans = _.map(data.IBANS, function (iban) {
        return new IBAN(client, iban.IBAN);
      });
    }
    if (data.SDDMANDATES) {
      this.sddMandates = _.map(data.SDDMANDATES, function (sddMandate) {
        return new SDDMandate(client, sddMandate.SDDMANDATE);
      });
    }
  };

  this.Wallet.extendWalletPromise = utils.extendPromise([
    'update', 'moneyIn', 'moneyInWebInit', 'moneyIn3DInit',
    'registerCard', 'unregisterCard', 'registerSddMandate',
    'unregisterSddMandate', 'updateWalletStatus'
  ]);

  this.Wallet.prototype.update = function (_opts) {
    var opts = _.assign({}, _opts, { id: this.id });
    return this._factory.update(this, opts);
  };

  this.Wallet.prototype.moneyIn = function (_opts) {
    var opts = _.assign({}, _opts, { wallet: this.id });
    return this._factory.moneyIn(this, opts);
  };

  this.Wallet.prototype.moneyInWebInit = function (_opts) {
    var opts = _.assign({}, _opts, { wallet: this.id });
    return this._factory.moneyInWebInit(this, opts)
  };

  this.Wallet.prototype.moneyIn3DInit = function (_opts) {
    var opts = _.assign({}, _opts);
    return this._factory.moneyIn3DInit(this, opts)
  };

  this.Wallet.prototype.registerCard = function (_opts) {
    var opts = _.assign({}, _opts);
    return this._factory.registerCard(this, opts)
  };

  this.Wallet.prototype.unregisterCard = function (card, _opts) {
    var opts = _.assign({}, _opts);
    return this._factory.unregisterCard(this, card, opts)
  };

  this.Wallet.prototype.moneyInWithCard = function (card, _opts) {
    var opts = _.assign({}, _opts);
    return this._factory.moneyInWithCard(this, card, opts)
  };

  this.Wallet.prototype.registerSddMandate = function (_opts) {
    var opts = _.assign({}, _opts);
    return this._factory.registerSddMandate(this, opts)
  };

  this.Wallet.prototype.unregisterSddMandate = function (mandate, _opts) {
    var opts = _.assign({}, _opts);
    return this._factory.unregisterSddMandate(this, mandate, opts)
  };
  
  this.Wallet.prototype.updateWalletStatus = function (_opts) {
    return this._factory.updateWalletStatus(this, _opts);
  };

}

WalletFactory.prototype.create = function (opts) {
  var walletPromise = this._lemonway._client.registerWallet(opts)
    .bind(this)
    .then(function (data) {
      return new this.Wallet(data);
    });

  return this.Wallet.extendWalletPromise(walletPromise);
};

WalletFactory.prototype.update = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    clientIp: _opts.ip || this._lemonway._ip,
    id: wallet.id ? wallet.id : wallet
  });

  var walletPromise = this._lemonway._client.updateWallet(opts)
    .bind(this)
    .then(function (data) {
      return new this.Wallet(data);
    });

  return this.Wallet.extendWalletPromise(walletPromise);
};

WalletFactory.prototype.moneyIn = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  var transactionPromise = this._lemonway._client.moneyIn(opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });

  return this._lemonway.Transaction.Transaction.extendTransactionPromise(transactionPromise);
};

WalletFactory.prototype.moneyInWebInit = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._lemonway._client.moneyInWebInit(opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.MoneyInWeb.MoneyInWeb(data);
    });
};

WalletFactory.prototype.moneyIn3DInit = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._lemonway._client.moneyIn3DInit(opts)
    .bind(this)
    .then(function (data) {
      return {
        acs: new Acs(data.acs),
        transaction: new this._lemonway.Transaction.Transaction(data.transaction)
      }
    });
};

WalletFactory.prototype.registerCard = function(wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._lemonway._client.registerCard(opts)
    .then(function (data) {
      return new Card(data);
    });
};

WalletFactory.prototype.unregisterCard = function(wallet, card, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet,
    cardId: card.id ? card.id : card
  });

  return this._lemonway._client.unregisterCard(opts)
    .then(function (data) {
      return new Card(data);
    });
};

WalletFactory.prototype.moneyInWithCard = function(wallet, card, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet,
    cardId: card.id ? card.id : card
  });

  var transactionPromise = this._lemonway._client.moneyInWithCardId(opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });

  return this._lemonway.Transaction.Transaction.extendTransactionPromise(transactionPromise);
};

WalletFactory.prototype.registerSddMandate = function(wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  var sddMandatePromise = this._lemonway._client.registerSddMandate(opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.SDDMandate.SDDMandate(data);
    });

  return this._lemonway.SDDMandate.SDDMandate.extendSDDMandatePromise(sddMandatePromise);
};

WalletFactory.prototype.unregisterSddMandate = function(wallet, mandate, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet,
    sddMandateId: _.get(mandate, 'id', mandate)
  });

  return this._lemonway._client.unregisterSddMandate(opts)
    .then(function (data) {
      return new SDDMandate(data);
    });
};

WalletFactory.prototype.updateWalletStatus = function(wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  var walletPromise = this._lemonway._client.updateWalletStatus(opts)
    .bind(this)
    .then(function (data) {
      return new this.Wallet(data);
    });

  return this.Wallet.extendWalletPromise(walletPromise);
};

module.exports = WalletFactory;