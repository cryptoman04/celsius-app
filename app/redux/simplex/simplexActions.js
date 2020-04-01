import ACTIONS from "../../constants/ACTIONS";
import { apiError, startApiCall } from "../api/apiActions";
import API from "../../constants/API";
import { showMessage } from "../ui/uiActions";
import simplexService from "../../services/simplex-service";
import { navigateTo } from "../nav/navActions";
import mixpanelAnalytics from "../../utils/mixpanel-analytics";
import { mocks } from "../../../dev-settings";
import mockTransactions from "../../mock-data/payments.mock";

export {
  simplexGetQuote,
  simplexCreatePaymentRequest,
  getAllSimplexPayments,
  getSimplexQuoteForCoin,
  clearSimplexData
};

/**
 * Gets info for Simplex request
 */
function simplexGetQuote() {
  return async (dispatch, getState) => {
    const { formData } = getState().forms;
    let quote
    try {
      const requestedCurrency = formData.isFiat
        ? formData.fiatCoin
        : formData.cryptoCoin;
      const amount = formData.isFiat
        ? formData.amountFiat
        : formData.amountCrypto;

      if (Number(amount)) {
        dispatch(startApiCall(API.GET_QUOTE));

        quote = await simplexService.getQuote(
          formData.cryptoCoin,
          formData.fiatCoin,
          requestedCurrency,
          amount
        );


        dispatch({
          type: ACTIONS.GET_QUOTE_SUCCESS,
          quote: quote.data,
        });

        mixpanelAnalytics.enteredBuyCoinsAmount(
          "CARD",
          formData.cryptoCoin,
          formData.fiatCoin,
          formData.amountFiat,
          formData.amountCrypto
        );
      }
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_QUOTE, err));
    }
  };
}

/**
 * Gets info Simplex quote for coin
 *
 * @param {String} coin - ETH|BTC
 * @param {String} fiat - USD|EUR
 * @param {String} amountToCheck - USD|EUR
 */
function getSimplexQuoteForCoin(coin) {
  return async dispatch => {
    try {
      dispatch(startApiCall(API.GET_QUOTE_FOR_COIN));

      const amountToCheck = 10000;
      const quote = await simplexService.getQuote(
        coin,
        "USD",
        "USD",
        amountToCheck
      );

      const fiatCurrency = quote.data.fiat_money.currency.toLowerCase();
      const cryptocurrency = quote.data.digital_money.currency.toLowerCase();
      const coinRate =
        quote.data.fiat_money.base_amount / quote.data.digital_money.amount;

      dispatch({
        type: ACTIONS.GET_QUOTE_FOR_COIN_SUCCESS,
        fiatCurrency,
        cryptocurrency,
        coinRate,
      });
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_QUOTE_FOR_COIN, err));
    }
  };
}

/**
 * Creates Simplex payment request
 */
function simplexCreatePaymentRequest() {
  return async (dispatch, getState) => {
    try {
      const { formData } = getState().forms;
      const { simplexData } = getState().simplex;

      const { pin, code } = formData;

      dispatch(startApiCall(API.CREATE_PAYMENT_REQUEST));

      const payment = {
        quote_id: simplexData.quote_id,
        coin: simplexData.digital_money.currency,
        amount: simplexData.digital_money.amount,
        fiat_amount: simplexData.fiat_money.total_amount,
        fiat_currency: simplexData.fiat_money.currency,
        fiat_base_amount: simplexData.fiat_money.base_amount,
      };

      const paymentRequest = await simplexService.createPaymentRequest(
        payment,
        {
          pin,
          twoFactorCode: code,
        }
      );

      dispatch({
        type: ACTIONS.CREATE_PAYMENT_REQUEST_SUCCESS,
        paymentRequest: paymentRequest.data,
      });
      dispatch(navigateTo("Simplex"));

      mixpanelAnalytics.initiatedBuyCoinsRequest(
        "CARD",
        formData.cryptoCoin,
        formData.fiatCoin,
        simplexData.fiat_money.total_amount,
        simplexData.digital_money.amount
      );
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.CREATE_PAYMENT_REQUEST, err));
    }
  };
}

/**
 * Gets all simplex payments
 */
function getAllSimplexPayments() {
  return async dispatch => {
    dispatch(startApiCall(API.GET_PAYMENT_REQUESTS));

    try {
      let res;
      if (!mocks.USE_MOCK_TRANSACTIONS) {
        res = await simplexService.getAllPayments();
      } else {
        res = {
          data: Object.values(mockTransactions).filter(t =>
            ["pending", "approved", "declined"].includes(t.id)
          ),
        };
      }

      dispatch({
        type: ACTIONS.GET_PAYMENT_REQUESTS_SUCCESS,
        payments: res.data,
      });
    } catch (err) {
      dispatch(apiError(API.GET_PAYMENT_REQUESTS, err));
      dispatch(showMessage("error", err.msg));
    }
  };
}

function clearSimplexData() {
  return {
    type: ACTIONS.CLEAR_SIMPLEX_DATA
  }
}
