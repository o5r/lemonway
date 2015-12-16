# Lemonway SDK
=======

## Usage
=======
```js
var Lemonway = require('lemonway);

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
