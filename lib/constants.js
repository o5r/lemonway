'use strict';

module.exports.CARD_TYPE = {
  CB: '0',
  VISA: '1',
  MASTERCARD: '2'
};

module.exports.AUTO_COMMISSION = {
  DISABLED: '0',
  ENABLED: '1'
};

module.exports.REGISTER_CARD = {
  DISABLED: '0',
  ENABLED: '1'
};

module.exports.WALLET_STATUS = {
  KYC_1: '5',
  KYC_2: '6',
  CLOSED: '12'
};

module.exports.TRANSACTION_STATUS = {
  IN_PROGRESS: '0',
  SUCCESS: '3',
  ERROR: '4',
  PENDING_VALIDATION: '16'
};

module.exports.DOCUMENT_TYPE = {
  ID: '0',
  PROOF_OF_ADDRESS: '1',
  RIB: '2',
  KBIS: '7'
};

module.exports.DOCUMENT_STATUS = {
  RECEIVED: '1',
  VALID: '2',
  CHECKED_AND_NOT_VALIDATED: '3',
  REPLACED: '4',
  DATE_EXPIRED: '5',
  WRONG_TYPE: '6',
  WRONG_NAME: '7'
};

module.exports.MANDATE_STATUS = {
  NOT_YET_APPROVED: '0',
  APPROVED_WITH_6_DAYS_DELAY: '5',
  APPROVED_WITH_3_DAYS_DELAY: '6',
  DEACTIVATED: '8',
  REJECTED: '9'
};
