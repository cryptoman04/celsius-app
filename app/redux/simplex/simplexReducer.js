import ACTIONS from "../../constants/ACTIONS";

/**
 * TODO make it a function add JSDoc & desc for return
 */
function initialState() {
  return {
    simplexData: {},
    payments: [],
    quotes: {},
  };
}

export default function simplexReducer(state = initialState(), action) {
  const quotes = {};

  switch (action.type) {
    case ACTIONS.CLEAR_SIMPLEX_DATA:
      return {
        ...state,
        simplexData: {},
        quotes: {}
      }
    case ACTIONS.GET_QUOTE_SUCCESS:
      return {
        ...state,
        simplexData: action.quote,
      };

    case ACTIONS.CREATE_PAYMENT_REQUEST_SUCCESS:
      return {
        ...state,
        simplexData: {
          ...state.simplexData,
          ...action.paymentRequest,
        },
      };

    case ACTIONS.GET_PAYMENT_REQUESTS_SUCCESS:
      return {
        ...state,
        payments: action.payments,
      };

    case ACTIONS.GET_QUOTE_FOR_COIN_SUCCESS:
      quotes[action.cryptocurrency] = {
        ...state.quotes[action.cryptocurrency],
        [action.fiatCurrency]: action.coinRate,
      };

      return {
        ...state,
        quotes: {
          ...state.quotes,
          ...quotes,
        },
      };

    default:
      return { ...state };
  }
}
