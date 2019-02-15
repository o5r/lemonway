'use strict';

describe('wallet', function () {
  require('./register');
  require('./money-in');
  require('./money-in-web');
  require('./money-in-ideal');
  require('./money-in-3D');
  require('./upload-file');
  require('./money-out');
  require('./register-iban');
  require('./money-in-cheque');
  require('./money-in-sdd');
  require('./sign-sdd-mandate');
  require('./update-status');
  require('./unregister-sdd-mandate');
  require('./register-sdd-mandate');
  require('./money-in-with-card-validate');
  require('./money-in-with-card');
  require('./unregister-card');
  require('./register-card');
  require('./money-in-3D-authenticate');
});
