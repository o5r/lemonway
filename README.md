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
`lemonway.Wallet.update(id, opts) -> Promise<wallet>`
`lemonway.Wallet.get(id, opts) -> Promise<wallet>`
`lemonway.Wallet.list(opts) -> Promise<wallet>`
`lemonway.Wallet.moneyIn(id, opts) -> Promise<transaction>`
`lemonway.Wallet.moneyIn3DInit(id, opts) -> Promise<transaction>`
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
