'use strict';

var _ = require('lodash');

var Model = require('./model');

function Upload (client, data) {
  Model.call(this, client);

  this.id = data.ID;
}

Upload.prototype = _.create(Model.prototype, {
  'constructor': Upload
});

module.exports = Upload;