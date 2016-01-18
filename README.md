# Lemonway SDK
=======

## Usage
=======

### Create a new wallet and credit it by card
```js
var Lemonway = require('lemonway');

var lemonway = new Lemonway(login, pass, JSONEndpoint);

lemonway.clone().setUserIp(req).Wallet.create({
  id: id,
  email: client.mail,
  firstName: client.firstName,
  lastName: client.lastName,
  birthDate: client.birthDate
}).then(function (wallet) {
  return wallet.moneyIn({
    amount: amount,
    cardNumber: client.cardNumber,
    cardCrypto: client.cardCrypto,
    cardDate: client.cardDate,
    autoCommission: true
  });
}).then(function (transaction) {
  ...
});
```

### Get a wallet and credit it by card using 3D Secure
```js
var Lemonway = require('lemonway');

var lemonway = new Lemonway(login, pass, JSONEndpoint);

lemonway.clone().setUserIp(req).Wallet.get(walletId)
  .then(function (wallet) {
    return wallet.moneyIn3DInit({
      amount: amount,
      cardNumber: client.cardNumber,
      cardCrypto: client.cardCrypto,
      cardDate: client.cardDate,
      autoCommission: true,
      returnUrl: 'https://your-service/your-return-path'
    });
}).spread(function (acs, transaction) {
  // redirect the client to acs.actionUrl
});
```

### List input transactions
```js
var Lemonway = require('lemonway');

var lemonway = new Lemonway(login, pass, JSONEndpoint);

lemonway.clone().setUserIp(req).Transaction.list({})
  .then(function (transactions) {
    ...
  });
```

### Upload a KYC File
```js
var Lemonway = require('lemonway');

var lemonway = new Lemonway(login, pass, JSONEndpoint, WebkitURL);

lemonway.clone().setUserIp(req).Wallet.get(walletId)
  .then(function (wallet) {
    return wallet.uploadFile({
      fileName: 'RIB.png',
      type: 'RIB',
      filePath: './test/wallet/RIB.png'
    });
  });

```

## API
=======

`Lemonway(login, pass, JSONEndpoint, webKitUrl) -> lemonway`

`lemonway.clone() -> lemonway`
Clone the current lemonway instance, so you can for example set the client ip even if you lemonway instance is a singleton 

`lemonway.setUserIp(req || ip) -> lemonway`
Set the client ip for the next request, this is mandatory in order to use the lemonway API

`lemonway.setUserAgent(req || ip) -> lemonway`
Set the client user agent for the next request, this is NOT mandatory

`lemonway.Wallet.create(opts) -> Promise<wallet>`
Create a new Wallet and return a promise that resolve to the new wallet

arg|type|required|description
---|----|--------|-----------
opts | object | true |
opts.id | string | true | external id (must be unique) |
opts.email | string | true | client email address (must be unique) |
opts.firstName | string | true | client first name |
opts.lastName | string | true | client last name |
opts.title | string | false | client title (can be M, F, J or U) |
opts.street | string | false | 
opts.postCode | string | false | 
opts.city | string | false | client city of residence |
opts.country | string | false | client country of residence |
opts.phoneNumber | string | false | 
opts.mobileNumber | string | false | 
opts.birthDate | date | false | 
opts.isCompany | bool | false | 
opts.companyName | string | false | 
opts.companyWebsite | string | false | 
opts.companyDescription | string | false | 
opts.companyIdentificationNumber | string | false | 
opts.isDebtor | string | false | 
opts.nationality | string | false | 
opts.birthCity | string | false | 
opts.birthCountry | string | false | 
opts.payerOrBenificiary | bool | false | 
opts.isOneTimeCustomer | bool | false | 

`lemonway.Wallet.update(wallet, opts) -> Promise<wallet>`
Update a wallet and return a promise to the updated wallet

arg|type|required|description
---|----|--------|-----------
wallet | Wallet or string | true | Can be a wallet instance or just a wallet id
opts | object | true |
opts.email | string | true | client email address |
opts.firstName | string | true | client first name |
opts.lastName | string | true | client last name |
opts.title | string | false | client title (can be M, F, J or U) |
opts.street | string | false | 
opts.postCode | string | false | 
opts.city | string | false | client city of residence |
opts.country | string | false | client country of residence |
opts.phoneNumber | string | false | 
opts.mobileNumber | string | false | 
opts.birthDate | date | false | 
opts.isCompany | bool | false | 
opts.companyName | string | false | 
opts.companyWebsite | string | false | 
opts.companyDescription | string | false | 
opts.companyIdentificationNumber | string | false | 
opts.isDebtor | string | false | 
opts.nationality | string | false | 
opts.birthCity | string | false | 
opts.birthCountry | string | false | 

`lemonway.Wallet.get(id) -> Promise<wallet>`
Get a wallet by id

arg|type|required|description
---|----|--------|-----------
id | string | true | wallet id

`lemonway.Wallet.list(opts) -> Promise<wallet>`
List wallet where amount changed after 'from' 

arg|type|required|description
---|----|--------|-----------
opts.from | date | false | default to 0

`lemonway.Wallet.uploadFile(wallet, opts) -> Promise<document>`
Upload a KYC file to Lemonway

arg|type|required|description
---|----|--------|-----------
wallet | id or wallet | true | a wallet or a wallet id
opts.fileName | string | true |
opts.type | string | true | the file type, can be ID from identity documents, PROOF_OF_ADDRESS, RIB or KBIS
opts.file | string or buffer | true | a string of a base64 file content or a node buffer, optional if filePath is set
opts.filePath | string | true | the path to the file to upload, optional if file is set

`lemonway.Wallet.listKyc(opts) -> Promise<[object]>`
List kyc

arg|type|required|description
---|----|--------|-----------
opts.from | date | false | date to list from, default to 0

`lemonway.Wallet.getTransHistory(wallet, opts) -> Promise<[transaction]>`
List the wallet transaction 

arg|type|required|description
---|----|--------|-----------
opts.from | date | false | date to list from, default to 0
opts.to | date | false | date to list until, default to now

`lemonway.Wallet.moneyIn(wallet, opts) -> Promise<transaction>`
Credit a wallet via credit card WITHOUT 3D secure

arg|type|required|description
---|----|--------|-----------
wallet | id or wallet | true | a wallet or a wallet id
opts.cardNumber | string | true | 
opts.cardCrypto | string | true | 
opts.cardExpiration | string | true | 
opts.amount | float | true | The amount to be credited
opts.commission | float | false | The commission amount, default to 0 
opts.autoCommission | bool | true |  
opts.isPreAuth | bool | false |  
opts.delayedDays | int | false |  
opts.token | string | false | an optional id token  

`lemonway.Wallet.moneyIn3DInit(wallet, opts) -> Promise<{acs, transaction}>`
Credit a wallet via credit card with 3D secure

arg|type|required|description
---|----|--------|-----------
wallet | id or wallet | true | a wallet or a wallet id
opts.cardNumber | string | true | 
opts.cardCrypto | string | true | 
opts.cardExpiration | string | true | 
opts.amount | float | true | The amount to be credited
opts.commission | float | false | The commission amount, default to 0 
opts.autoCommission | bool | true |  
opts.token | string | false | an optional id token  
opts.returnUrl | string | true | return URL after the Atos 3D secure process  

`lemonway.Transaction.moneyIn3DConfirm(transaction, opts) -> Promise<{acs, transaction}>`
Confirm a 3D secure payment process

arg|type|required|description
---|----|--------|-----------
transaction | id or transaction | true | a transaction or a transaction id
opts.isPreAuth | bool | false |  
opts.delayedDays | int | false |  

`lemonway.Transaction.moneyIn3DAuthenticate(transaction) -> Promise<moneyIn>`
Confirm that a transaction was done with 3D secure enabled

arg|type|required|description
---|----|--------|-----------
wallet | id or wallet | true | a wallet or a wallet id
opts.isPreAuth | bool | false |  
opts.delayedDays | int | false |  

`lemonway.Wallet.registerCard(wallet, opts) -> Promise<card>`
Attach a card to a wallet

arg|type|required|description
---|----|--------|-----------
wallet | id or wallet | true | a wallet or a wallet id
opts.cardNumber | string | true | 
opts.cardCrypto | string | true | 
opts.cardExpiration | string | true | 

`lemonway.Wallet.unregisterCard(wallet, card) -> Promise<card>`
Detach a card from wallet

arg|type|required|description
---|----|--------|-----------
wallet | id or wallet | true | a wallet or a wallet id
card | id or card | true | a card or a card id

`lemonway.Wallet.moneyInWithCardId(wallet, card, opts) -> Promise<transaction>`
Credit a wallet via a registered card

arg|type|required|description
---|----|--------|-----------
wallet | id or wallet | true | a wallet or a wallet id
card | id or card | true | a card or a card id
opts.amount | float | true | amount to credit
opts.commission | float | false |
opts.message | float | false |
opts.autoCommission | bool | true | 
opts.isPreAuth | bool | true | 
opts.delayedDays | int | false | 
opts.token | string | false | 

`lemonway.Transaction.moneyInValidate(transaction) -> Promise<transaction>`
Validate a pre-auth transaction

arg|type|required|description
---|----|--------|-----------
transaction | id or transaction | true | a transaction or a transaction id

`lemonway.Wallet.registerSDDMandate(wallet, opts) -> Promise<sddMandate>`
Register a debit mandate

arg|type|required|description
---|----|--------|-----------
wallet | id or wallet | true | a wallet or a wallet id
opts.holder | string | true | the bank account holder
opts.bic | string | true | BIC code
opts.iban | string | true | 
opts.isRecurring | bool | true | 
opts.street | string | false | mandatory to sign a mandate
opts.postCode | string | false | mandatory to sign a mandate
opts.city | string | false | mandatory to sign a mandate
opts.country | string | false | mandatory to sign a mandate
opts.defaultLanguage | string | false | mandate language, can be 'fr', 'es' or 'de', default to 'fr'

`lemonway.Wallet.unregisterSDDMandate(wallet, mandate) -> Promise<sddMandate>`
Unregister a mandate

arg|type|required|description
---|----|--------|-----------
wallet | id or wallet | true | a wallet or a wallet id
mandate | id or mandate | true | a mandate or a mandate id

`lemonway.Wallet.signDocumentInit(wallet, mandate, opts) -> Promise<{token, redirectUrl}>`
Init a document signature, return a redirectUrl to which you should redirect you client 

arg|type|required|description
---|----|--------|-----------
wallet | id or wallet | true | a wallet or a wallet id
mandate | id or mandate | true | a mandate or a mandate id
mobileNumber | string | true | the client mobile number, is mandatory since the client will receive a confirmation code via SMS 
returnUrl | string | true | the client will be redirected to this URL in case of success
errorUrl | string | true | the client will be redirected to this URL in case of failure

`lemonway.Wallet.moneyInSddInit(wallet, mandate, opts) -> Promise<transaction>`
Credit a wallet via a previously signed sdd mandate 

arg|type|required|description
---|----|--------|-----------
wallet | id or wallet | true | a wallet or a wallet id
mandate | id or mandate | true | a mandate or a mandate id
amount | float | true |  
commission | float | false | 
autoCommission | bool | true | 
collectionDate | date | false | default to now

`lemonway.Wallet.moneyInChequeInit(wallet, opts) -> Promise<transaction>`
Pre-register a cheque, you still have to send the document to Lemonway

arg|type|required|description
---|----|--------|-----------
wallet | id or wallet | true | a wallet or a wallet id
amount | float | true |  
commission | float | false | 
autoCommission | bool | true | 

`lemonway.Wallet.registerIBAN(wallet, opts) -> Promise<iban>`
Attach an iban to a wallet

arg|type|required|description
---|----|--------|-----------
wallet | id or wallet | true | a wallet or a wallet id
holder | string | true | iban holder 
bic | string | false | not mandatory if its a french iban 
iban | string | true |  
dom1 | string | false | 
dom2 | string | false | 
comment | string | false | 

`lemonway.Wallet.moneyOut(wallet, iban, opts) -> Promise<transaction>`
Attach an iban to a wallet

arg|type|required|description
---|----|--------|-----------
wallet | id or wallet | true | a wallet or a wallet id
iban | id or wallet | true | an iban or an iban id
amount | float | true | 
commission | float | false | 
autoCommission | bool | true | 
message | string | false | 

`lemonway.Wallet.sendPayment(fromWallet, toWallet, opts) -> Promise<transaction>`
P2P payment, send a payment from a wallet to another wallet

arg|type|required|description
---|----|--------|-----------
fromWallet | id or wallet | true | a wallet or a wallet id
toWallet | id or wallet | true | a wallet or a wallet id
amount | float | true | 
message | string | false | 
scheduleDate | date | false | 
privateData | string | false | additional data  

`lemonway.Transaction.get(id, opts) -> Promise<transaction>`
Get a transaction by 

arg|type|required|description
---|----|--------|-----------
id | string | true | payment id
opts | object | true |
opts.walletIp | string | true | Client ip |
opts.walletUa | string | false | Client user agent |

`lemonway.MoneyIn.get(id, opts) -> Promise<moneyIn>`
Get a money in 

arg|type|required|description
---|----|--------|-----------
id | string | true | wallet id
opts | object | true |
opts.walletIp | string | true | Client ip |
opts.walletUa | string | false | Client user agent |

`lemonway.MoneyOut.get(id, opts) -> Promise<moneyOut>`
Get a money out 

arg|type|required|description
---|----|--------|-----------
id | string | true | wallet id
opts | object | true |
opts.walletIp | string | true | Client ip |
opts.walletUa | string | false | Client user agent |

`lemonway.Wallet.list(opts) -> Promise<[wallet, ...]>`
List wallets

arg|type|required|description
---|----|--------|-----------
opts | object | true |
opts.walletIp | string | true | Client ip |
opts.walletUa | string | false | Client user agent |


`lemonway.Wallet.moneyIn(wallet, opts) -> Promise<transaction>`
Credit a wallet via credit card

arg|type|required|description
---|----|--------|-----------
wallet | Wallet or string | true | Can be a wallet instance or just a wallet id
opts | object | true |
opts.walletIp | string | true | Client ip 
opts.walletUa | string | false | Client user agent 
opts.cardNumber | string | true | 
opts.cardCrypto | string | true | 
opts.cardDate | string | true | 
opts.amountTot | number | true | amount to credit (decimal format)
opts.amountCom | number | false | 
opts.comment | string | false | 
opts.autoCommission | bool | false | default to false
opts.isPreAuth | bool | false | 
opts.delayedDays | number | false | 
opts.wkToken | string | false | 

`lemonway.Wallet.moneyIn3DInit(id, opts) -> Promise<[acs, transaction]>`
Credit a wallet via credit card with 3D Secure

arg|type|required|description
---|----|--------|-----------
wallet | Wallet or string | true | Can be a wallet instance or just a wallet id
opts | object | true |
opts.walletIp | string | true | Client ip 
opts.walletUa | string | false | Client user agent 
opts.cardNumber | string | true | 
opts.cardCrypto | string | true | 
opts.cardDate | string | true | 
opts.amountTot | number | true | amount to credit (decimal format)
opts.returnUrl | string | true | 3D Secure return URL
opts.amountCom | number | false | 
opts.comment | string | false | 
opts.autoCommission | bool | false | default to false
opts.delayedDays | number | false | 
opts.wkToken | string | false | 

`lemonway.Wallet.registerCard(wallet, opts) -> Promise<card>`
Register and link a card to a wallet

arg|type|required|description
---|----|--------|-----------
wallet | Wallet or string | true | Can be a wallet instance or just a wallet id
opts | object | true |
opts.walletIp | string | true | Client ip 
opts.walletUa | string | false | Client user agent 
opts.cardNumber | string | true | 
opts.cardCode | string | true | 
opts.cardDate | string | true | 

`lemonway.Wallet.unregisterCard(wallet, card, opts) -> Promise<card>`
Unregister and link a card to a wallet

arg|type|required|description
---|----|--------|-----------
wallet | Wallet or string | true | Can be a wallet instance or just a wallet id
card | Card or string | true | Can be a card instance or just a card id
opts | object | true |
opts.walletIp | string | true | Client ip 
opts.walletUa | string | false | Client user agent 

`lemonway.getWizypayAds(opts) -> Promise<[[wizypayOffer], [wizypayAd]]>`
Get wizypay ads

arg|type|required|description
---|----|--------|-----------
opts | object | true |
opts.walletIp | string | true | Client ip 
opts.walletUa | string | false | Client user agent 


## Models
=======
### Wallet
  * id -> `string`
  * lemonWayId -> `string`
  * balance -> `float`
  * name -> `string`
  * email -> `string` 
  * status -> `string`
  * blocked -> `string`
  * method -> `string`
  * documents -> `[Document]`
  * ibans -> `[IBAN]`
  * sddMandates -> `[SDDMandate]`
  * update -> (`opts`) -> `Promise<Wallet>`  
  * updateStatus -> (`opts`) -> `Promise<Wallet>`  
  * moneyIn -> (`opts`) -> `Promise<Transaction>`  
  * moneyIn3DInit -> (`opts`) -> `Promise<Transaction>`  
  * registerCard -> (`opts`) -> `Promise<Card>`  
  * unregisterCard -> (`card`) -> `Promise<Card>`  
  * moneyInWithCardId -> (`card`, `opts`) -> `Promise<Transaction>`  
  * registerIBAN -> (`opts`) -> `Promise<IBAN>`  
  * registerSDDMandate -> (`opts`) -> `Promise<mandate>`  
  * moneyInSDDInit -> (`mandate`, `opts`) -> `Promise<transaction>`  
  * moneyInChequeInit -> (`opts`) -> `Promise<transaction>`  
  * moneyOut -> (`iban`, `opts`) -> `Promise<transaction>`
  * sendPayment -> (`toWallet`, `opts`) -> `Promise<transaction>`
  * createVCC -> (`opts`) -> `Promise<{transaction, vcc}>`
  * uploadFile -> (`opts`) -> `Promise<Document>`
  * listTransactions -> (`opts`) -> `Promise<[transaction]>`

### ACS
  * actionUrl -> `string|undefined`
  * actionMethod -> `string|undefined`
  * pareqFieldName -> `string|undefined`
  * pareqFieldValue -> `string|undefined`
  * termurlFieldName -> `string|undefined`
  * mdFieldName -> `string|undefined`
  * mdFieldValue -> `string|undefined`
  * mpiResult -> `string|undefined`

### Card
  * id -> `string`
  * is3DSecure -> `boolean|undefined`
  * country -> `string|undefined`
  * authorizationNumber -> `string|undefined`
  * cardNumber -> `string|undefined`
  * expirationDate -> `string|undefined`
  
### Document
  * id -> `string`
  * status -> `string|undefined`
  * type -> `string|undefined`
  * validityDate -> `string|undefined`

### IBAN
  * id -> `string`
  * status -> `string|undefined`
  * iban -> `string`
  * swift -> `string`
  * holder -> `string`

### MoneyIn
  * id -> `string`
  * O3DCode -> `string|undefined`
  
### SDDMandate
  * id -> `string`
  * status -> `string`
  * iban -> `string`
  * swift -> `string`

### Transaction
  * id -> `string`
  * date -> `Date|undefined`
  * debitedWallet -> `string|undefined`
  * creditedWallet -> `string|undefined`
  * amountDebited -> `number|undefined`
  * amountCredited -> `number|undefined`
  * fee -> `number|undefined`
  * amazonGiftCode -> `string|undefined`
  * message -> `string|undefined`
  * status -> `string|undefined`
  * IBANUsed -> `string|undefined`
  * lemonwayMessage -> `string|undefined`
  * bankReference -> `string|undefined`
  * virtualCreditCard -> `VirtualCreditCard|undefined`
  * moneyIn -> `MoneyIn|undefined`
  * card -> `Card|undefined`
  * extra -> `object|undefined`
  * extra.is3DSecure -> `boolean|undefined`
  * extra.country -> `string|undefined`
  * extra.authorizationNumber -> `string|undefined`
  * iban -> `IBAN|undefined`
  * getPaymentDetails -> (`userInfo`) -> `Promise<Transaction>`

### VirtualCreditCard
  * id -> `string|undefined`
  * number -> `string|undefined`
  * expirationDate -> `string|undefined`
  * cvx -> `string|undefined`
  

