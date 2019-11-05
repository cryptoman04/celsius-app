import { TRANSACTION_TYPES } from "../constants/DATA";

export default {
  [TRANSACTION_TYPES.WITHDRAWAL_CANCELED]: {
    id: TRANSACTION_TYPES.WITHDRAWAL_CANCELED,
    transaction_id: null,
    amount: "-0.00490253",
    amount_usd: "-49.99992429258563",
    coin: "btc",
    interest_coin: null,
    time: "2019-07-02T10:49:24.926Z",
    is_confirmed: false,
    from_address: "2N9afLpGvkrMhdQKYjjm8vvMSc4CJfBABib",
    to_address: "2NGDQhJ2FxF7F2Rk3bWsjpEcsj1wxLTpsWo",
    state: "canceled",
    nature: "withdrawal",
    type: "outgoing",
    transfer_data: {},
    loan_data: {},
    referral_data: {},
    verified: false,
  },

  [TRANSACTION_TYPES.COLLATERAL_PENDING]: {
    id: TRANSACTION_TYPES.COLLATERAL_PENDING,
    transaction_id: null,
    amount: "-14.45691943",
    amount_usd: "-1666.666666666666666697325954021",
    coin: "ltc",
    interest_coin: null,
    time: "2019-07-02T14:26:07.612Z",
    is_confirmed: false,
    from_address: null,
    to_address: null,
    state: "pending",
    nature: "collateral",
    type: "outgoing",
    transfer_data: {},
    loan_data: {
      initiation_date: "July 2, 2019",
      initiation_time: "14:25",
      loan_amount: "550",
      loan_collateral_crypto: "14.456919434115754231",
      loan_collateral_usd: "1666.666666666666666666",
      repayment_deadline: "2021-01-02T14:25:28.991Z",
      annual_interest_rate: "0.05",
      monthly_interest_payment: "2.302130898021308918",
      total_interest_payment: "41.438356164383560525",
      margin: "12300",
      liquidation: "10000",
    },
    referral_data: {},
    verified: null,
  },
  [TRANSACTION_TYPES.COLLATERAL_LOCKED]: {
    id: TRANSACTION_TYPES.COLLATERAL_LOCKED,
    transaction_id: null,
    amount: "-14.45691943",
    amount_usd: "-1666.666666666666666697325954021",
    coin: "ltc",
    interest_coin: null,
    time: "2019-07-02T14:26:07.612Z",
    is_confirmed: false,
    from_address: null,
    to_address: null,
    state: "locked",
    nature: "collateral",
    type: "outgoing",
    transfer_data: {},
    loan_data: {
      initiation_date: "July 2, 2019",
      initiation_time: "14:25",
      loan_amount: "550",
      loan_collateral_crypto: "14.456919434115754231",
      loan_collateral_usd: "1666.666666666666666666",
      repayment_deadline: "2021-01-02T14:25:28.991Z",
      annual_interest_rate: "0.05",
      monthly_interest_payment: "2.302130898021308918",
      total_interest_payment: "41.438356164383560525",
      margin: "12345",
      liquidation: "12345",
    },
    referral_data: {},
    verified: null,
  },
  [TRANSACTION_TYPES.COLLATERAL_UNLOCKED]: {
    id: TRANSACTION_TYPES.COLLATERAL_UNLOCKED,
    transaction_id: null,
    amount: "-14.45691943",
    amount_usd: "-1666.666666666666666697325954021",
    coin: "ltc",
    interest_coin: null,
    time: "2019-07-02T14:26:07.612Z",
    is_confirmed: false,
    from_address: null,
    to_address: null,
    state: "unlocked",
    nature: "collateral",
    type: "outgoing",
    transfer_data: {},
    loan_data: {
      initiation_date: "July 2, 2019",
      initiation_time: "14:25",
      loan_amount: "550",
      loan_collateral_crypto: "14.456919434115754231",
      loan_collateral_usd: "1666.666666666666666666",
      repayment_deadline: "2021-01-02T14:25:28.991Z",
      annual_interest_rate: "0.05",
      monthly_interest_payment: "2.302130898021308918",
      total_interest_payment: "41.438356164383560525",
      unlocked_at: "2019-07-12T14:26:07.612Z",
      // "unlock_reason": "rejected",
      // "unlock_reason": "cancelled",
      unlock_reason: "finished",
    },
    referral_data: {},
    verified: null,
  },
  [TRANSACTION_TYPES.COLLATERAL_LIQUIDATED]: {
    id: TRANSACTION_TYPES.COLLATERAL_LIQUIDATED,
    transaction_id: null,
    amount: "-14.45691943",
    amount_usd: "-1666.666666666666666697325954021",
    coin: "ltc",
    interest_coin: null,
    time: "2019-07-02T14:26:07.612Z",
    is_confirmed: false,
    from_address: null,
    to_address: null,
    state: "liquidated",
    nature: "collateral",
    type: "outgoing",
    transfer_data: {},
    loan_data: {
      initiation_date: "July 2, 2019",
      initiation_time: "14:25",
      loan_amount: "550",
      loan_collateral_crypto: "14.456919434115754231",
      loan_collateral_usd: "1666.666666666666666666",
      repayment_deadline: "2021-01-02T14:25:28.991Z",
      annual_interest_rate: "0.05",
      monthly_interest_payment: "2.302130898021308918",
      total_interest_payment: "41.438356164383560525",
      liquidated_at: "2019-07-12T14:26:07.612Z",
    },
    referral_data: {},
    verified: null,
  },

  [TRANSACTION_TYPES.INTEREST]: {
    id: TRANSACTION_TYPES.INTEREST,
    transaction_id: null,
    amount: "1.20823769",
    amount_usd: 145.30297339476456,
    coin: "ltc",
    interest_coin: "ltc",
    time: "2019-07-08T11:00:27.759Z",
    is_confirmed: true,
    from_address: null,
    to_address: null,
    state: "confirmed",
    nature: "interest",
    type: "incoming",
    transfer_data: {},
    loan_data: {},
    referral_data: {},
    verified: null,
  },
  [TRANSACTION_TYPES.BONUS_TOKEN]: {
    id: TRANSACTION_TYPES.BONUS_TOKEN,
    transaction_id: null,
    amount: "1.0000",
    amount_usd: "0.0704207649809",
    coin: "cel",
    interest_coin: null,
    time: "2019-05-14T14:33:00.240Z",
    is_confirmed: true,
    from_address: null,
    to_address: null,
    state: "confirmed",
    nature: "bonus_token",
    type: "incoming",
    transfer_data: {},
    loan_data: {},
    referral_data: {},
    verified: null,
    note: "MEMBERSHIP_BONUS_TOKEN",
  },
  [TRANSACTION_TYPES.MARGIN_CALL]: {
    id: TRANSACTION_TYPES.MARGIN_CALL,
    transaction_id: null,
    amount: "5.000",
    amount_usd: "255.0704207649809",
    coin: "cel",
    interest_coin: null,
    time: "2019-05-14T14:33:00.240Z",
    is_confirmed: true,
    from_address: null,
    to_address: null,
    state: "confirmed",
    nature: "margin_call",
    type: "incoming",
    transfer_data: {},
    loan_data: {},
    referral_data: {},
    verified: null,
    note: "MARGIN_CALL_COLLATERAL",
  },
  [TRANSACTION_TYPES.LOAN_PRINCIPAL]: {
    id: TRANSACTION_TYPES.LOAN_PRINCIPAL,
    transaction_id: null,
    amount: "-50.45691943",
    amount_usd: "-3666.666666666666666697325954021",
    coin: "ltc",
    time: "2019-07-01T14:26:07.612Z",
    payment_period: "6",
    is_confirmed: false,
    from_address: null,
    to_address: null,
    state: "pending",
    nature: "loan_principal",
    type: "outgoing",
    transfer_data: {},
    loan_data: {
      initiation_date: "July 2, 2019",
      initiation_time: "14:25",
      loan_amount: "550",
      loan_collateral_crypto: "14.456919434115754231",
      loan_collateral_usd: "1666.666666666666666666",
      repayment_deadline: "2021-01-02T14:25:28.991Z",
      annual_interest_rate: "0.05",
      monthly_interest_payment: "2.302130898021308918",
      total_interest_payment: "41.438356164383560525",
      liquidated_at: "2019-07-12T14:26:07.612Z",
    },
    referral_data: {},
    verified: null,
  },
  [TRANSACTION_TYPES.LOAN_INTEREST]: {
    id: TRANSACTION_TYPES.LOAN_INTEREST,
    transaction_id: null,
    amount: "-300.45691943",
    amount_usd: "-1999.666666666666666697325954021",
    coin: "ltc",
    time: "2019-07-10T14:26:07.612Z",
    payment_period: "1",
    is_confirmed: false,
    from_address: null,
    to_address: null,
    state: "pending",
    nature: "loan_interest",
    type: "outgoing",
    transfer_data: {},
    loan_data: {
      initiation_date: "July 2, 2019",
      initiation_time: "14:25",
      loan_amount: "550",
      loan_collateral_crypto: "14.456919434115754231",
      loan_collateral_usd: "1666.666666666666666666",
      repayment_deadline: "2021-01-02T14:25:28.991Z",
      annual_interest_rate: "0.05",
      monthly_interest_payment: "2.302130898021308918",
      total_interest_payment: "41.438356164383560525",
      liquidated_at: "2019-07-12T14:26:07.612Z",
    },
    referral_data: {},
    verified: null,
  },
  [TRANSACTION_TYPES.PENDING_INTEREST]: {
    id: TRANSACTION_TYPES.PENDING_INTEREST,
    transaction_id: null,
    amount: "6.6666",
    amount_usd: "696.9696",
    coin: "ltc",
    interest_coin: "ltc",
    time: "2019-07-08T11:00:27.759Z",
    is_confirmed: true,
    from_address: null,
    to_address: null,
    state: "confirmed",
    nature: "pending_interest",
    type: "incoming",
    transfer_data: {},
    loan_data: {},
    referral_data: {},
    verified: null,
  },
};
