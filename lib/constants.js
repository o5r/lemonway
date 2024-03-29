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
  WALLET_SC: '-1',
  ACCOUNT_NOT_OPENED: '1',
  INCOMPLETE_KYC: '2',
  REJECTED_KYC: '3',
  KYC_1: '5',
  KYC_2: '6',
  KYC_3: '7',
  EXPIRED_KYC: '8',
  BLOCKED: '10',
  CLOSED: '12',
  BEING_UPDATED_TO_KYC_3: '13',
  ONE_TIME_CUSTOMER: '14',
  WALLET_FOR_CROWDLENDING: '15',
  WALLET_TECHNIQUE: '16'
};

module.exports.TRANSACTION_STATUS = {
  IN_PROGRESS: '0',
  SUCCESS: '3',
  ERROR: '4',
  CANCELLATION_SUCCESS: '6',
  PENDING_VALIDATION: '16'
};

module.exports.TRANSACTION_METHOD = {
  CARD: '0',
  INCOMING_WIRE: '1',
  OUTGOING_WIRE: '3',
  IDEAL: '13',
  SDD: '14',
  CHECK: '15',
  NEOSURF_CARD: '16'
};

module.exports.TRANSACTION_TYPE = {
  MONEY_IN: '0',
  MONEY_OUT: '1',
  P2P: '2'
};

module.exports.DOCUMENT_TYPE = {
  ID: '0',
  PROOF_OF_ADDRESS: '1',
  RIB: '2',
  INSIDE_EU_PASSPORT: '3',
  OUTSIDE_EU_PASSORT: '4',
  RESIDENCE_PERMIT: '5',
  KBIS: '7',
  DRIVER_LICENCE: '11',
  SOCIAL_SECURITY: '14',
  FAMILY_BOOKLET: '15',
  INSURANCE: '16'
};

module.exports.DOCUMENT_STATUS = {
  RECEIVED: '1',
  VALID: '2',
  REJECTED: '3',
  UNREADABLE: '4',
  DATE_EXPIRED: '5',
  WRONG_TYPE: '6',
  WRONG_NAME: '7',
  DUPLICATED_DOCUMENT: '8',
};

module.exports.MANDATE_STATUS = {
  NOT_YET_APPROVED: '0',
  APPROVED_WITH_6_DAYS_DELAY: '5',
  APPROVED_WITH_3_DAYS_DELAY: '6',
  DEACTIVATED: '8',
  REJECTED: '9'
};
