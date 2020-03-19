const KEYBOARD_TYPE = {
  DEFAULT: "default",
  NUMERIC: "numeric",
  EMAIL: "email-address",
  PHONE: "phone-pad",
  NUMBER_PAD: "number-pad",
};

const MODALS = {
  API_KEY_REVOKE_MODAL: "API_KEY_REVOKE_MODAL",
  BECAME_CEL_MEMBER_MODAL: "BECAME_CEL_MEMBER_MODAL", // not showing to all users
  CELPAY_RECEIVED_MODAL: "CELPAY_RECEIVED_MODAL",
  CHANGE_WITHDRAWAL_ADDRESS_MODAL: "CHANGE_WITHDRAWAL_ADDRESS_MODAL", // new modal
  CONFIRM_WITHDRAWAL_ADDRESS_MODAL: "CONFIRM_WITHDRAWAL_ADDRESS_MODAL", // new modal
  CREATE_NEW_ACCOUNT_MODAL: "CREATE_NEW_ACCOUNT_MODAL", // new modal - not binded in new flow
  DEPOSIT_INFO_MODAL: "DEPOSIT_INFO_MODAL",
  DESTINATION_TAG_MODAL: "DESTINATION_TAG_MODAL", // <-- not moved checked
  GENERATE_API_KEY_MODAL: "GENERATE_API_KEY_MODAL",
  KYC_REJECTION_REASONS_MODAL: "KYC_REJECTION_REASONS_MODAL",
  LOAN_ALERT_MODAL: "LOAN_ALERT_MODAL",
  LOAN_APPLICATION_SUCCESS_MODAL: "LOAN_APPLICATION_SUCCESS_MODAL",
  LOAN_CANCEL_MODAL: "LOAN_CANCEL_MODAL",
  LOSE_MEMBERSHIP_MODAL: "LOSE_MEMBERSHIP_MODAL",
  LOSE_TIER_MODAL: "LOSE_TIER_MODAL",
  MEMO_ID_MODAL: "MEMO_ID_MODAL",
  MY_CEL_LOYALTY_CALCULATOR_MODAL: "MY_CEL_LOYALTY_CALCULATOR_MODAL",
  PREPAY_DOLLAR_INTEREST_MODAL: "PREPAY_DOLLAR_INTEREST_MODAL",
  PREPAYMENT_SUCCESSFUL_MODAL: "PREPAYMENT_SUCCESSFUL_MODAL", // new modal
  REFERRAL_RECEIVED_MODAL: "REFERRAL_RECEIVED_MODAL", // <-- not moved not using
  REFERRAL_SEND_MODAL: "REFERRAL_SEND_MODAL",
  REGISTER_PROMO_CODE_MODAL: "REGISTER_PROMO_CODE_MODAL",
  REMOVE_AUTHAPP_MODAL: "REMOVE_AUTHAPP_MODAL",
  SSN_MODAL: "SSN_MODAL",
  TRANSACTION_FILTER_MODAL: "TRANSACTION_FILTER_MODAL", // new modal
  VERIFY_AUTHAPP_MODAL: "VERIFY_AUTHAPP_MODAL",
  WITHDRAW_INFO_MODAL: "WITHDRAW_INFO_MODAL",
  WITHDRAW_WARNING_MODAL: "WITHDRAW_WARNING_MODAL",
  INTEREST_DUE_MODAL: "INTEREST_DUE_MODAL",
  CELPAY_INFO_MODAL: "CELPAY_INFO_MODAL",
  CONFIRM_CELPAY_MODAL: "CONFIRM_CELPAY_MODAL",
  GET_COINS_INFO_MODAL: "GET_COINS_INFO_MODAL",
  GET_COINS_CONFIRM_MODAL: "GET_COINS_CONFIRM_MODAL",
};

const INITIAL_ROUTE = "Home";

const THEMES = {
  LIGHT: "light",
  DARK: "dark",
  CELSIUS: "celsius",
};

const EMPTY_STATES = {
  USER_CLEARED: "USER_CLEARED",

  NON_VERIFIED_CELPAY: "NON_VERIFIED_CELPAY",
  NON_VERIFIED_BORROW: "NON_VERIFIED_BORROW",
  NON_VERIFIED_DEPOSIT: "NON_VERIFIED_DEPOSIT",
  NON_VERIFIED_WITHDRAW: "NON_VERIFIED_WITHDRAW",
  NON_VERIFIED_INTEREST: "NON_VERIFIED_INTEREST",
  NON_VERIFIED_GET_COINS: "NON_VERIFIED_GET_COINS",

  NON_MEMBER_CELPAY: "NON_MEMBER_CELPAY",
  NON_MEMBER_BORROW: "NON_MEMBER_BORROW",
  NON_MEMBER_INTEREST: "NON_MEMBER_INTEREST",

  VERIFICATION_IN_PROCESS_DEPOSIT: "VERIFICATION_IN_PROCESS_DEPOSIT",
  VERIFICATION_IN_PROCESS_CELPAY: "VERIFICATION_IN_PROCESS_CELPAY",
  VERIFICATION_IN_PROCESS_WITHDRAW: "VERIFICATION_IN_PROCESS_WITHDRAW",
  VERIFICATION_IN_PROCESS_GET_COINS: "VERIFICATION_IN_PROCESS_GET_COINS",

  ZERO_INTEREST: "ZERO_INTEREST",
  NO_SSN_INTEREST: "NO_SSN_INTEREST",
  NO_LOANS: "NO_LOANS",
  BORROW_NOT_ENOUGH_FUNDS: "BORROW_NOT_ENOUGH_FUNDS",

  NO_WITHDRAWAL_ADDRESSES: "NO_WITHDRAWAL_ADDRESSES",
  MAINTENANCE: "MAINTENANCE",
  COMPLIANCE: "COMPLIANCE",
  NO_CONTACTS: "NO_CONTACTS",
  INSUFFICIENT_FUNDS: "INSUFFICIENT_FUNDS",
  NO_TRANSACTIONS: "NO_TRANSACTIONS",

  HODL_MODE_WARNING: "HODL_MODE_WARNING",
  HODL_MODE_ACTIVE: "HODL_MODE_ACTIVE",
  CHECK_YOUR_EMAIL: "CHECK_YOUR_EMAIL",
};

const KEYPAD_PURPOSES = {
  WITHDRAW: "WITHDRAW",
  CELPAY: "CELPAY",
  VERIFICATION: "VERIFICATION",
  AMOUNT: "AMOUNT",
  INTEREST_CALCULATOR: "INTEREST_CALCULATOR",
  BORROW: "BORROW",
  BUY_COINS: "BUY_COINS",
};

const PHONES_WITH_CUSTOM_KEYPAD = [
  "iPhone X",
  // 'Simulator',
];

const HIGHLIGHTED_COUNTRIES = [
  "Canada",
  "Germany",
  "United Kingdom",
  "Australia",
  "United States",
];

const WALLET_LANDING_VIEW_TYPES = {
  GRID: "grid",
  LIST: "list",
};

const FAB_TYPE = ["main", "support", "hide"];

const WELCOME_MESSAGES = [
  {
    title: "Interest Income",
    text:
      "Make your Mondays a whole lot more interesting. Deposit coins and receive weekly interest payments directly to your Celsius wallet.",
  },
  {
    title: "Crypto is the New Collateral",
    text:
      "Crypto-backed loans give you access to the cash you need at rates you deserve without selling your coins! ",
  },
  {
    title: "No Fees, No Worries",
    text:
      "CelPay is the easiest way to send and receive crypto instantly - without the fees.",
  },
  {
    title: "Unity in Community",
    text:
      "Celsius Network’s promise is to only act in the best interest of our community by offering unmatched financial services that are safe, secure, and rewarding.",
  },
  {
    title: "Join the CEL-ebration!",
    text: `Get the most out of your Celsius app by earning in CEL! Earning interest in the CEL token gets you up to 30% more interest.`,
  },
];

const LOAN_BANNER_MESSAGES = [
  {
    title: "Got crypto but need cash?",
    content:
      "Don’t sell your coins - borrow against them with a low-interest loan from Celsius.",
  },
  {
    title: "Did you know?",
    content:
      "You can use your crypto as collateral to get a USD or stablecoin loan. Keep the upside potential of your coins and get the cash you need.",
  },
  {
    title: "Why sell your coins?",
    content:
      "You can borrow against them to get the cash you need at rates you deserve. Keep calm and HODL on!",
  },
];

const COIN_CARD_TYPE = {
  COLLATERAL_COIN_CARD: "COLATERAL_COIN_CARD",
  PRINCIPAL_PAYMENT_COIN_CARD: "PRINCIPAL_PAYMENT_COIN_CARD",
  LOAN_PAYMENT_COIN_CARD: "LOAN_PAYMENT_COIN_CARD",
  MARGIN_COLLATERAL_COIN_CARD: "MARGIN_COLLATERAL_COIN_CARD",
};

const LOAN_PAYMENT_REASONS = {
  INTEREST: "INTEREST",
  MANUAL_INTEREST: "MANUAL_INTEREST",
  INTEREST_PREPAYMENT: "INTEREST_PREPAYMENT",
  // PRINCIPAL: 'PRINCIPAL',
};

const LOAN_ALERTS = {
  INTEREST_ALERT: "INTEREST_ALERT",
  PRINCIPAL_ALERT: "PRINCIPAL_ALERT",
  MARGIN_CALL_ALERT: "MARGIN_CALL_ALERT",
};

const LOAN_FILTER_ITEMS = [
  "ALL",
  "ACTIVE",
  "PENDING",
  "COMPLETED",
  "REFINANCED",
  "CANCELED",
];

const HODL_STATUS = {
  ACTIVATED: "Activated",
  DEACTIVATED: "Deactivated",
  PENDING_DEACTIVATION: "Pending Deactivate",
  INACTIVE: "Inactive",
};

const TRANSACTION_FILTER_DATE = [
  {
    title: "Anytime",
    value: null,
  },
  {
    title: "Last Day",
    value: "day",
  },
  {
    title: "Last Week",
    value: "week",
  },
  {
    title: "Last Month",
    value: "month",
  },
  {
    title: "Last Three Months",
    value: "threeMonths",
  },
  {
    title: "Last Six Months",
    value: "sixMonths",
  },
  {
    title: "Last 12 months",
    value: "lastYear",
  },
  {
    title: "Year to Date",
    value: "yearToDate",
  },
  {
    title: "Previous year",
    value: "prevYear",
  },
];

const TRANSACTION_FILTER_TYPE = [
  {
    title: "All Transactions",
    value: null,
  },
  {
    title: "Interest",
    value: "interest",
    icon: "TransactionInterest",
  },
  {
    title: "Deposits",
    value: "received",
    icon: "TransactionReceived",
  },
  {
    title: "CelPay",
    value: "celpay",
    icon: "TransactionCelpay",
  },
  {
    title: "Loans",
    value: "loan",
    icon: "TransactionLoan",
  },
  {
    title: "Withdrawals",
    value: "withdraw",
    icon: "TransactionSent",
  },
];

const CEL_PAY_TYPES = {
  LINK: "LINK",
  FRIEND: "FRIEND",
};

export {
  KEYBOARD_TYPE,
  MODALS,
  INITIAL_ROUTE,
  THEMES,
  EMPTY_STATES,
  KEYPAD_PURPOSES,
  PHONES_WITH_CUSTOM_KEYPAD,
  HIGHLIGHTED_COUNTRIES,
  FAB_TYPE,
  WALLET_LANDING_VIEW_TYPES,
  WELCOME_MESSAGES,
  COIN_CARD_TYPE,
  LOAN_PAYMENT_REASONS,
  LOAN_ALERTS,
  LOAN_FILTER_ITEMS,
  TRANSACTION_FILTER_DATE,
  TRANSACTION_FILTER_TYPE,
  LOAN_BANNER_MESSAGES,
  CEL_PAY_TYPES,
  HODL_STATUS,
};
