'use strict';

if (!process.env.LOGIN || !process.env.PASS || !process.env.ENDPOINT || !process.env.PHONE || !process.env.WK_URL) {
  console.error('***')
  console.error(' Set `LOGIN`, `PASS`, `PHONE`, `WK_URL` & `ENDPOINT` env for testing');
  console.error(' http://documentation.lemonway.fr/api-fr/introduction/tests-et-comptes-par-defaut');
  console.error(' LOGIN=society PASS=123456 ENDPOINT=https://ws.lemonway.fr/mb/{ENDPOINT}/directkitjson/service.asmx?WSDL npm test');
  console.error('***');
  process.exit(1);
}

describe('Lemonway SDK', function () {
  require('./wallet');
  require('./transaction');
});
