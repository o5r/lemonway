'use strict';

var _ = require('lodash');

function LemonwayError (message, code) {
  Error.call(this);
  this.message = message;
  this.code = code;
}

LemonwayError.prototype = _.create(Error.prototype, {
  'constructor': LemonwayError
});

function InvalidTransaction () { this.code = '143' }

InvalidTransaction.prototype = _.create(Error.prototype, {
  'constructor': InvalidTransaction
});

module.exports = {
  codes: {
    '143': InvalidTransaction
  },
  LemonwayError: LemonwayError,
  InvalidTransaction: InvalidTransaction
};