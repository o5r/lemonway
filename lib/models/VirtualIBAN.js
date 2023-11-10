'use strict';

function VirtualIBAN (data) {
  const { ID, IBAN, BIC, HOLDER, DOM, S, MAXAVAILABLEIBANPERWALLET, MAXAVAILABLEIBAN} = data;

  return {
    id: ID,
    iban: IBAN,
    bic: BIC,
    holder: HOLDER,
    domiciliation: DOM,
    status: S,
    maxAvailableIbanPerWalletLeft: MAXAVAILABLEIBANPERWALLET,
    maxAvailableIbanInTotalLeft: MAXAVAILABLEIBAN,
  };
}

module.exports = VirtualIBAN;
