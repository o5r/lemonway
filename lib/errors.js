'use strict';

var _ = require('lodash');

function LemonwayError (code, message, description) {
  Error.apply(this);

  this.code = code;
  this.message = message;
  this.description = description;

  this.documentationUrl = 'http://documentation.lemonway.fr/api-en/directkit/overview/errors/error-codes';
}
LemonwayError.prototype = _.create(Error.prototype, { constructor: LemonwayError });

function LemonwayErrorInherit (className, code, message, description) {
  var _Class = function () { LemonwayError.call(this, code, message, description) };
  _Class.prototype = _.create(LemonwayError.prototype, { constructor: _Class, name: className });
  return _Class;
}

var errors = [
  { className: 'InternalError', code: 1, message: 'Internal error' },
  { className: 'LimitAmountReached', code: 100, message: 'Limit amount reached', description: 'If the error is raised during a payment between 2 wallets, the limit has been reached by the sending wallet' },
  { className: 'ReceivingWalletLimitAmountReached', code: 101, message: 'Limit amount reached', description: 'If the error is raised during a payment between 2 wallets, the limit has been reached by the receiving wallet' },
  { className: 'WhiteBrandNotRecognized', code: 105, message: 'White brand not recognized' },
  { className: 'InsufficientCredit', code: 110, message: 'Insufficient credit' },
  { className: 'CardInformationFormatIncorrect', code: 119, message: 'Card information format incorrect' },
  { className: 'UnknownPaymentGatewayError', code: 124, message: 'Unknown payment gateway error' },
  { className: 'UnavailableFunctionality', code: 138, message: 'Unavailable functionality', description: 'Depends on your contract' },
  { className: 'TransactionNotFound', code: 143, message: 'Transaction not found', description: 'If searching for a transaction: please fill in one of the search field\nIf validating a transaction: transaction does not exist or status does not allow validation' },
  { className: 'IncorrectWalletStatus', code: 146, message: 'Incorrect wallet status' },
  { className: 'WalletNotFound', code: 147, message: 'Wallet not found' },
  { className: 'AmountNotAllowed', code: 151, message: 'Amount not allowed', description: 'Higher than refundable amount, or lower than 0.50€ for a card payment, not allowed or too high according to your contract. Please contact support' },
  { className: 'WalletIDAlreadyExist', code: 152, message: 'Wallet ID already exists' },
  { className: 'WalletBlockedForSecurityReason', code: 167, message: 'Wallet blocked for security reason' },
  { className: 'PaymentGatewayInvalidOperation', code: 170, message: 'Invalid operation returned by the payment gateway' },
  { className: 'PaymentGatewayOperationRefused', code: 171, message: 'Operation refused by the payment gateway' },
  { className: 'PaymentGatewayInternalError', code: 172, message: 'Internal error in the payment gateway' },
  { className: 'IncorrectAmountFormat', code: 188, message: 'Incorrect amount format' },
  { className: 'CardPaymentProcessingInternalError', code: 190, message: 'Internal error in the card payment processing' },
  { className: 'EmailAlreadyUsed', code: 204, message: 'Email already used' },
  { className: 'PaymentGatewayFraudSuspicion', code: 209, message: 'Fraud suspicion from the payment gateway' },
  { className: 'BadCardDataFormat', code: 212, message: 'Bad card data format' },
  { className: 'NoApprovedIBAN', code: 215, message: 'No approved IBAN found for this wallet' },
  { className: 'CardIdNotFound', code: 219, message: 'Card ID not found' },
  { className: 'BadIBANDataFormat', code: 221, message: 'Bad IBAN data format' },
  { className: 'BadInputData', code: 234, message: 'Bad input data' },
  { className: 'FileError', code: 235, message: 'File too big or wrong format' },
  { className: 'IPBlacklisted', code: 236, message: 'IP in input parameter is blacklisted' },
  { className: 'EmailBlacklisted', code: 237, message: 'Email is blacklisted' },
  { className: 'DocumentAlreadyInReview', code: 241, message: 'A document of the same type is already pending review by LW\'s KYC services' },
  { className: 'WrongBicFormat', code: 242, message: 'Wrong BIC/SWIFT code format' },
  { className: 'DocumentTypeDoesNotExist', code: 243, message: 'Type of document does not exist' },
  { className: 'SDDMandateNotFound', code: 244, message: 'SDD mandate not found' },
  { className: 'SDDMandateInvalid', code: 245, message: 'SDD mandate is invalid' },
  { className: 'SDDMandateAlreadyInUse', code: 246, message: 'SDD mandate already in use for a direct debit' },
  { className: 'WrongDateFormat', code: 247, message: 'Wrong date format' },
  { className: 'WrongIPFormat', code: 248, message: 'Wrong IP format' },
  { className: 'MobileNumberIsMandatory', code: 249, message: 'Mobile number mandatory for electronic signature' },
  { className: 'TypeIsMandatory', code: 250, message: 'Type is mandatory' },
  { className: 'AddressIsMandatory', code: 251, message: 'Address is mandatory' },
  { className: 'WrongNameFormat', code: 252, message: 'Wrong first or last name format' }
];

module.exports = _.reduce(errors, function (reducer, error) {
  var _e = LemonwayErrorInherit(error.className, error.code, error.message, error.description);
  return _(reducer).set(error.className, _e).set(error.code, _e).value();
}, { LemonwayError: LemonwayError });
