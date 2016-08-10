'use strict';

var _ = require('lodash');

function LemonwayError (code, message, description) {
  Error.apply(this);

  this.code = code;
  this.message = message;
  this.description = description;

  this.documentationUrl = 'http://documentation.lemonway.fr/api-en/directkit/overview/error-messages';
}
LemonwayError.prototype = _.create(Error.prototype, { constructor: LemonwayError });

function LemonwayErrorInherit (className, codes, message, description) {
  var _Class = function (code) {
    LemonwayError.call(this, code || codes[0], message, description);
  };
  _Class.codes = codes;

  _Class.prototype = _.create(LemonwayError.prototype, { constructor: _Class, name: className });
  return _Class;
}

var errors = [
  { className: 'InternalError', codes: ['1'], message: 'Internal error' },
  { className: 'LimitAmountReached', codes: ['100'], message: 'Limit amount reached', description: 'If the error is raised during a payment between 2 wallets, the limit has been reached by the sending wallet' },
  { className: 'ReceivingWalletLimitAmountReached', codes: ['101'], message: 'Limit amount reached', description: 'If the error is raised during a payment between 2 wallets, the limit has been reached by the receiving wallet' },
  { className: 'WhiteBrandNotRecognized', codes: ['105'], message: 'White brand not recognized' },
  { className: 'TransactionMaxAmountReached', codes: ['109'], message: 'Amount higher than the maximum limit', description: 'Transaction amount is higher than the maximum amount authorized' },
  { className: 'InsufficientCredit', codes: ['110'], message: 'Insufficient credit' },
  { className: 'InvalidSenderStatus', codes: ['111'], message: 'Invalid status for sender' },
  { className: 'IncorrectAntiPhishingCode', codes: ['114'], message: 'Incorrect anti-phishing code format' },
  { className: 'CommissionError', codes: ['118'], message: 'Error while calculating commission' },
  { className: 'CardInformationFormatIncorrect', codes: ['119'], message: 'Card information format incorrect' },
  { className: 'AuthenticationError', codes: ['120'], message: 'Authentication error' },
  { className: 'CardAlreadyDeactivated', codes: ['121'], message: 'Card already deactivated' },
  { className: 'UnknownPaymentGatewayError', codes: ['124'], message: 'Unknown payment gateway error' },
  { className: 'InvalidPhoneNumber', codes: ['128'], message: 'Invalid phone number' },
  { className: 'WalletTypeNotAllowed', codes: ['137'], message: 'Wallet type not allowed' },
  { className: 'UnavailableFunctionality', codes: ['138'], message: 'Unavailable functionality', description: 'Depends on your contract' },
  { className: 'IgnoredNumber', codes: ['139'], message: 'Ignored number' },
  { className: 'TransactionNotFound', codes: ['143'], message: 'Transaction not found', description: 'If searching for a transaction: please fill in one of the search field\nIf validating a transaction: transaction does not exist or status does not allow validation' },
  { className: 'IncorrectWalletStatus', codes: ['146'], message: 'Incorrect wallet status' },
  { className: 'WalletNotFound', codes: ['147'], message: 'Wallet not found' },
  { className: 'InvalidLogin', codes: ['148'], message: 'Invalid login' },
  { className: 'AmountNotAllowed', codes: ['151'], message: 'Amount not allowed', description: 'Higher than refundable amount, or lower than 0.50€ for a card payment, not allowed or too high according to your contract. Please contact support' },
  { className: 'WalletIDAlreadyExist', codes: ['152'], message: 'Wallet ID already exists' },
  { className: 'InvalidSettingPass', codes: ['153'], message: 'Error SETTING PASS' },
  { className: 'WrongIDNumber', codes: ['155'], message: 'Wrong identity card number' },
  { className: 'ClientNotFound', codes: ['162'], message: 'Client not found' },
  { className: 'SenderWalletBlocked', codes: ['167'], message: 'Wallet blocked for security reason' },
  { className: 'ReceiverWalletBlocked', codes: ['168'], message: 'Receiver wallet blocked for security reason' },
  { className: 'PaymentGatewayInvalidOperation', codes: ['170'], message: 'Invalid operation returned by the payment gateway' },
  { className: 'PaymentGatewayOperationRefused', codes: ['171'], message: 'Operation refused by the payment gateway' },
  { className: 'PaymentGatewayInternalError', codes: ['172'], message: 'Internal error in the payment gateway' },
  { className: 'MoneyInNotAllowed', codes: ['173'], message: 'You are not allowed to do a money-in' },
  { className: 'MoneyInError', codes: ['174'], message: 'Error during money-in' },
  { className: 'PhoneOrEmailNotMatched', codes: ['175'], message: 'Mobile number and email do not match any account in the system' },
  { className: 'SendEmailError', codes: ['176'], message: 'Error when sending email' },
  { className: 'ChangeEmailError', codes: ['177'], message: 'Error during email change process' },
  { className: 'WrongEmailFormat', codes: ['178'], message: 'Wrong email format' },
  { className: 'NotEnoughCredit', codes: ['187'], message: 'Amount is higher than the balance' },
  { className: 'IncorrectAmountFormat', codes: ['188'], message: 'Incorrect amount format' },
  { className: 'CardPaymentProcessingInternalError', codes: ['190'], message: 'Internal error in the card payment processing' },
  { className: 'DemandExpired', codes: ['192'], message: 'ERR_DEMANDEXP' },
  { className: 'DemandNotAPayment', codes: ['193'], message: 'ERR_DEMAND_EXIST_BUT_NOT_A_PAYMENT' },
  { className: 'TransactionWrongId', codes: ['195'], message: 'ERR_TRANS_WRONGID' },
  { className: 'RegistrationFailed', codes: ['200'], message: 'Registration failed' },
  { className: 'BadSecretAnswer', codes: ['202'], message: 'Bad secret answer format' },
  { className: 'UnknownSecretAnswer', codes: ['203'], message: 'Unknown secret question' },
  { className: 'EmailAlreadyUsed', codes: ['204'], message: 'Email already used' },
  { className: 'PaymentGatewayFraudSuspicion', codes: ['209'], message: 'Fraud suspicion from the payment gateway' },
  { className: 'NotRegistered', codes: ['210'], message: 'User not registered' },
  { className: 'BadCardDataFormat', codes: ['212'], message: 'Bad card data format' },
  { className: 'UnknownPartner', codes: ['213'], message: 'Unknown partner' },
  { className: 'NoApprovedIBAN', codes: ['215'], message: 'No approved IBAN found for this wallet' },
  { className: 'AccountTemporarilyBlocked', codes: ['217'], message: 'Your account is temporarily blocked, please click on "Forget password"' },
  { className: 'AccountBlocked', codes: ['218'], message: 'Your account is blocked, please contact our client service: service-client@lemonway.fr' },
  { className: 'CardIdNotFound', codes: ['219'], message: 'Card ID not found' },
  { className: 'RIBAlreadyDeleted', codes: ['220'], message: 'RIB have already been deleted' },
  { className: 'BadIBANDataFormat', codes: ['221'], message: 'Bad IBAN data format' },
  { className: 'BadInputData', codes: ['234'], message: 'Bad input data' },
  { className: 'FileError', codes: ['235'], message: 'File too big or wrong format' },
  { className: 'IPBlacklisted', codes: ['236'], message: 'IP in input parameter is blacklisted' },
  { className: 'EmailBlacklisted', codes: ['237'], message: 'Email is blacklisted' },
  { className: 'IBANBlacklisted', codes: ['238'], message: 'IBAN is blacklisted' },
  { className: 'BadUrlFormat', codes: ['239'], message: 'Bad format URL' },
  { className: 'DocumentAlreadyInReview', codes: ['241'], message: 'A document of the same type is already pending review by LW\'s KYC services' },
  { className: 'WrongBicFormat', codes: ['242'], message: 'Wrong BIC/SWIFT code format' },
  { className: 'DocumentTypeDoesNotExist', codes: ['243'], message: 'Type of document does not exist' },
  { className: 'SDDMandateNotFound', codes: ['244'], message: 'SDD mandate not found' },
  { className: 'SDDMandateInvalid', codes: ['245'], message: 'SDD mandate is invalid' },
  { className: 'SDDMandateAlreadyInUse', codes: ['246'], message: 'SDD mandate already in use for a direct debit' },
  { className: 'WrongDateFormat', codes: ['247'], message: 'Wrong date format' },
  { className: 'WrongIPFormat', codes: ['248'], message: 'Wrong IP format' },
  { className: 'MobileNumberIsMandatory', codes: ['249'], message: 'Mobile number mandatory for electronic signature' },
  { className: 'TypeIsMandatory', codes: ['250'], message: 'Type is mandatory' },
  { className: 'AddressIsMandatory', codes: ['251'], message: 'Address is mandatory' },
  { className: 'WrongNameFormat', codes: ['252'], message: 'Wrong first or last name format' },
  { className: 'BadPhoneFormat', codes: ['253'], message: 'Bad format phone number' },
  { className: 'InvalidDate', codes: ['254'], message: 'Invalid date' },
  { className: 'DocMandateAlreadyAssociated', codes: ['258'], message: 'Already document associate to this mandate' },
  { className: 'AccessTemporarilyBlocked', codes: ['259'], message: 'Access temporarily blocked' },
  { className: 'AmountHigherThanReserve', codes: ['260'], message: 'Amount higher than the rolling reserve' },
  { className: 'InvalidPaymentAccount', codes: ['262'], message: 'Payment account is not valid' },
  { className: 'InvalidWalletId', codes: ['264'], message: 'Invalid Wallet Id' },
  { className: 'InvalidCardType', codes: ['265'], message: 'Bad format for card type' },
  { className: 'InvalidCardDate', codes: ['266'], message: 'Bad format for card date' },
  { className: 'InvalidCardCrypto', codes: ['267'], message: 'Bad format for card crypto' },
  { className: 'SessionNotFound', codes: ['255', '140'], message: 'Session not found' },
  { className: 'ExpiredSession', codes: ['141', '256'], message: 'You session has expired' },
  { className: 'SessionAlreadyCreated', codes: ['142', '257'], message: 'Can\'t connect. Another session is already started for this user' },
  { className: 'ExecutionError', codes: ['179', '180', '181', '182', '183', '184', '185', '189', '191', '230', '232', '233', '240'], message: 'Error while executing the operation, please try again later' },
  { className: 'SendMoneyToMyself', codes: ['186', '211'], message: 'You cannot send money to yourself' },
  { className: 'PaymentNotFound', codes: ['261', '263'], message: 'Payment not found or already processed' }
];

module.exports = _.reduce(errors, function (reducer, error) {
  var _e = LemonwayErrorInherit(error.className, error.codes, error.message, error.description);

  return _(reducer).set(error.className, _e).value();
}, { LemonwayError: LemonwayError });
