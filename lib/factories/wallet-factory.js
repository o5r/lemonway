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
    return this._factory.moneyInWebInit(this, opts);
  };

  this.Wallet.prototype.moneyIn3DInit = function (opts) {
    return this._factory.moneyIn3DInit(this, opts);
  };

  this.Wallet.prototype.registerCard = function (opts) {
    return this._factory.registerCard(this, opts);
  };

  this.Wallet.prototype.unregisterCard = function (card, opts) {
    return this._factory.unregisterCard(this, card, opts);
  };

  this.Wallet.prototype.moneyInWithCard = function (card, opts) {
    return this._factory.moneyInWithCard(this, card, opts);
  };

  this.Wallet.prototype.registerSDDMandate = function (opts) {
    return this._factory.registerSDDMandate(this, opts);
  };

  this.Wallet.prototype.unregisterSDDMandate = function (mandate, opts) {
    return this._factory.unregisterSDDMandate(this, mandate, opts);
  };

  this.Wallet.prototype.updateWalletStatus = function (_opts) {
    return this._factory.updateWalletStatus(this, _opts);
  };

  this.Wallet.prototype.moneyInSDDInit = function (mandate, _opts) {
    return this._factory.moneyInSDDInit(this, mandate, _opts);
  };

  this.Wallet.prototype.moneyInChequeInit = function (_opts) {
    return this._factory.moneyInChequeInit(this, _opts);
  };
  
  this.Wallet.prototype.registerIBAN = function (_opts) {
    return this._factory.registerIBAN(this, _opts);
  };
  
  this.Wallet.prototype.moneyOut = function (_opts) {
    return this._factory.moneyOut(this, _opts);
  };

  this.Wallet.prototype.sendPayment = function (toWallet, _opts) {
    return this._factory.sendPayment(this, toWallet, _opts);
  };

  this.Wallet.prototype.createVCC = function (_opts) {
    return this._factory.createVCC(this, _opts);
  };

  this.Wallet.prototype.uploadFile = function (_opts) {
    return this._factory.uploadFile(this, _opts);
  };

  this.Wallet.prototype.transactions =
  this.Wallet.prototype.listTransactions =
  this.Wallet.prototype.getWalletTransHistory = function (_opts) {
    return this._factory.getWalletTransHistory(this, _opts);
  };

}

WalletFactory.prototype.create =
WalletFactory.prototype.registerWallet = function (opts) {
  return this._lemonway._client.registerWallet(opts)
    .bind(this)
    .then(function (data) {
      return new this.Wallet(data);
    });
};

WalletFactory.prototype.list =
WalletFactory.prototype.getBalances = function (opts) {
  return this._lemonway._client.getBalances(opts)
    .bind(this)
    .map(function (data) {
      return new this.Wallet(data);
    });
};

WalletFactory.prototype.get =
WalletFactory.prototype.getWalletDetails = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: _.get(wallet, 'id', wallet)
  });

  return this._lemonway._client.getWalletDetails(opts)
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
WalletFactory.prototype.getKycStatus = function (opts) {
  return this._lemonway._client.getKycStatus(opts)
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

WalletFactory.prototype.update = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    clientIp: _opts.ip || this._lemonway._ip,
    id: wallet.id ? wallet.id : wallet
  });

  return this._lemonway._client.updateWallet(opts)
    .bind(this)
    .then(function (data) {
      return new this.Wallet(data);
    });
};

WalletFactory.prototype.moneyIn = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._lemonway._client.moneyIn(opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });
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

  return this._lemonway._client.moneyInWithCardId(opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });
};

WalletFactory.prototype.registerSDDMandate = function(wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._lemonway._client.registerSDDMandate(opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.SDDMandate.SDDMandate(data);
    });
};

WalletFactory.prototype.unregisterSDDMandate = function(wallet, mandate, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet,
    sddMandateId: _.get(mandate, 'id', mandate)
  });

  return this._lemonway._client.unregisterSDDMandate(opts)
    .then(function (data) {
      return new SDDMandate(data);
    });
};

WalletFactory.prototype.updateWalletStatus = function(wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: wallet.id ? wallet.id : wallet
  });

  return this._lemonway._client.updateWalletStatus(opts)
    .bind(this)
    .then(function (data) {
      return new this.Wallet(data);
    });
};

WalletFactory.prototype.moneyInSDDInit = function (wallet, mandate, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: _.get(wallet, 'id', wallet),
    sddMandateId: _.get(mandate, 'id', mandate)
  });

  return this._lemonway._client.moneyInSDDInit(opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });
};

WalletFactory.prototype.moneyInChequeInit = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: _.get(wallet, 'id', wallet)
  });

  return this._lemonway._client.moneyInChequeInit(opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });
};

WalletFactory.prototype.registerIBAN = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: _.get(wallet, 'id', wallet)
  });

  return this._lemonway._client.registerIBAN(opts)
    .bind(this)
    .then(function (data) {
      return new IBAN(data);
    });
};

WalletFactory.prototype.moneyOut = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: _.get(wallet, 'id', wallet),
    ibanId: _.get(_opts, 'iban.id', _.get(_opts, 'iban'))
  });

  return this._lemonway._client.moneyOut(opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });
};

WalletFactory.prototype.sendPayment = function (fromWallet, toWallet, _opts) {
  var opts = _.assign({}, _opts, {
    debitWallet: _.get(fromWallet, 'id', fromWallet),
    creditWallet: _.get(toWallet, 'id', toWallet)
  });

  return this._lemonway._client.sendPayment(opts)
    .bind(this)
    .then(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });
};

WalletFactory.prototype.createVCC = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    debitWallet: _.get(wallet, 'id', wallet)
  });

  return this._lemonway._client.createVCC(opts)
    .bind(this)
    .then(function (data) {
      return {
        transaction: new this._lemonway.Transaction.Transaction(data),
        virtualCreditCard: new VirtualCreditCard(_.get(data, 'VCC'))
      };
    });
};

WalletFactory.prototype.uploadFile = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: _.get(wallet, 'id', wallet)
  });

  return this._lemonway._client.uploadFile(opts)
    .bind(this)
    .then(function (data) {
      return new Document(data);
    });
};

WalletFactory.prototype.getWalletTransHistory = function (wallet, _opts) {
  var opts = _.assign({}, _opts, {
    wallet: _.get(wallet, 'id', wallet)
  });

  return this._lemonway._client.getWalletTransHistory(opts)
    .bind(this)
    .map(function (data) {
      return new this._lemonway.Transaction.Transaction(data);
    });
};

module.exports = WalletFactory;