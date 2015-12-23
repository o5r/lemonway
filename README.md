# Lemonway SDK
=======

## Usage
=======
```js
var Lemonway = require('lemonway');

var lemonway = new Lemonway(login, pass, JSONEndpoint);

lemonway.Wallet.register({
  walletIp: client.ip,
  wallet: id,
  clientMail: client.mail,
  clientFirstName: client.firstName,
  clientLastName: client.lastName,
  birthdate: client.birthDate
}).then(function (wallet) {
  return wallet.moneyIn({
    walletIp: client.ip,
    amountTot: amount,
    cardType: Lemonway.constants.CARD_TYPE.CB,
    cardNumber: client.cardNumber,
    cardCrypto: client.cardCrypto,
    cardDate: client.cardDate,
    autoCommission: Lemonway.constants.AUTO_COMMISSION.ENABLED
  });
}).then(function (transaction) {
  ...
});
```

## API
=======

`Lemonway(login, pass, JSONEndpoint) -> lemonway`

`Lemonway.constants`
`Lemonway.constants`
`Lemonway.constants.CARD_TYPE`
`Lemonway.constants.CARD_TYPE.CB`
`Lemonway.constants.CARD_TYPE.VISA`
`Lemonway.constants.CARD_TYPE.MASTER_CARD`
`Lemonway.constants.AUTO_COMMISSION.ENABLED`
`Lemonway.constants.REGISTER_CARD.DISABLED`
`Lemonway.constants.REGISTER_CARD.ENABLED`
`Lemonway.constants.WALLET_STATUS.KYC_1`
`Lemonway.constants.WALLET_STATUS.KYC_2`
`Lemonway.constants.WALLET_STATUS.CLOSED`


`lemonway.Wallet.register(opts) -> Promise<wallet>`
Register a new Wallet

arg|type|required|description
---|----|--------|-----------
opts | object | true |
opts.walletIp | string | true | Client ip |
opts.walletUa | string | false | Client user agent |
opts.wallet | string | true | external id (must be unique) |
opts.clientMail | string | true | client email address |
opts.clientFirstName | string | true | client first name |
opts.clientLastName | string | true | client last name |
opts.clientTitle | string | false | client title (can be M, F, J or U) |
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
Update a wallet

arg|type|required|description
---|----|--------|-----------
wallet | Wallet or string | true | Can be a wallet instance or just a wallet id
opts | object | true |
opts.walletIp | string | true | Client ip |
opts.walletUa | string | false | Client user agent |
opts.clientMail | string | true | client email address |
opts.clientFirstName | string | true | client first name |
opts.clientLastName | string | true | client last name |
opts.clientTitle | string | false | client title (can be M, F, J or U) |
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

`lemonway.Wallet.get(id, opts) -> Promise<wallet>`
Get a wallet 

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


`lemonway.Wallet.registerCard(id, opts) -> Promise<transaction>`
`lemonway.Wallet.unregisterCard(id, opts) -> Promise<transaction>`
`lemonway.getWizypayAds(opts) -> Promise<[[wizypayOffer], [wizypayAd]]>`

## Models
=======

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

### IDealInit
  * id -> `string`
  * actionUrl -> `string|undefined`
  
### IBAN
  * id -> `string`
  * status -> `string|undefined`
  * iban -> `string`
  * swift -> `string`
  * holder -> `string`

### MoneyIn
  * id -> `string`
  * O3DCode -> `string|undefined`
  
### MoneyInWeb
  * id -> `string|undefined`
  * token -> `string`
  * card -> `Card|undefined`
  
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
  
### Wallet
  * id -> `string`
  * lemonWayId -> `string`
  * balance -> `number`
  * name -> `string|undefined`
  * email -> `string|undefined` 
  * status -> `string|undefined`
  * blocked -> `string|undefined`
  * method -> `string|undefined`
  * documents -> `[Document]|undefined`
  * ibans -> `[IBAN]|undefined`
  * sddMandates -> `[SDDMandate]|undefined`
  * update -> (`walletData`) -> `Promise<Wallet>`  
  * update -> (`walletData`) -> `Promise<Wallet>`  
  * updateStatus -> (`walletData`) -> `Promise<Wallet>`  
  * close -> (`clientInfo`) -> `Promise<Wallet>`  
  * reload -> (`clientInfo`) -> `Promise<Wallet>`  
  * moneyIn -> (`data`) -> `Promise<Transaction>`  
  * moneyIn3DInit -> (`data`) -> `Promise<Transaction>`  
  * registerCard -> (`data`) -> `Promise<Card>`  
  * unregisterCard -> (`Card`, `data`) -> `Promise<Card>`  
  * moneyInWithCardId -> (`data`) -> `Promise<Transaction>`  
  * registerIBAN -> (`data`) -> `Promise<IBAN>`  
  * moneyOut -> (`clientInfo`) -> `Promise<Transaction>`
  * uploadFile -> (`clientInfo`) -> `Promise<Document>`
  * createGiftCardAmazon -> (`clientInfo`) -> `Promise<Transaction>`

### WizypayAd
  * id -> `string`
  * kind -> `string`
  * text -> `string`
  * redirectLink -> `string`
  * pictureLink -> `string`
  * htmlTag -> `string`
  * affiliationMerchant -> `object|undefined`
  * affiliationMerchant.id -> `string`
  * affiliationMerchant.name -> `string`

### WizypayOffer
  * id -> `string`
  * name -> `string`
  * description -> `string`
  * startDate -> `Date`
  * endDate -> `Date`
  * badge -> `string`
  * code -> `string`
  * redirectLink -> `string`
  * pictureLink -> `string`
  * affiliationMerchant -> `object|undefined`
  * affiliationMerchant.id -> `string`
  * affiliationMerchant.name -> `string`
