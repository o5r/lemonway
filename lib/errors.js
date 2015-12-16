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

module.exports = {
  LemonwayError: LemonwayError
};