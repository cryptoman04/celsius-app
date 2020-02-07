import ACTIONS from "../../constants/ACTIONS";
import { apiError, startApiCall } from "../api/apiActions";
import API from "../../constants/API";
import { showMessage } from "../ui/uiActions";
import simplexService from "../../services/simplex-service";
import { navigateTo } from "../nav/navActions";
import mixpanelAnalytics from "../../utils/mixpanel-analytics";

export { simplexGetQuote, simplexCreatePaymentRequest, getAllSimplexPayments };

/**
 * Gets info for Simplex request
 */
function simplexGetQuote() {
  return async (dispatch, getState) => {
    const { formData } = getState().forms;
    try {
      dispatch(startApiCall(API.GET_QUOTE));

      const requestedCurrency = formData.isUsd ? "USD" : formData.coin;
      const amount = formData.isUsd
        ? formData.amountUsd
        : formData.amountCrypto;

      const quote = await simplexService.getQuote(
        formData.coin,
        "USD",
        requestedCurrency,
        amount
      );
      dispatch({
        type: ACTIONS.GET_QUOTE_SUCCESS,
        quote: quote.data,
      });

      mixpanelAnalytics.enteredBuyCoinsAmount(
        "CARD",
        formData.coin,
        "USD",
        formData.amountCrypto,
        formData.amountUsd
      );
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_QUOTE, err));
    }
  };
}

/**
 * Creates Simplex request
 * @param {object} args
 */

function simplexCreatePaymentRequest(args) {
  return async (dispatch, getState) => {
    try {
      const { formData } = getState().forms;
      const { pin, code } = formData;
      dispatch(startApiCall(API.CREATE_PAYMENT_REQUEST));
      const paymentRequest = await simplexService.createPaymentRequest(args, {
        pin,
        twoFactorCode: code,
      });

      dispatch({
        type: ACTIONS.CREATE_PAYMENT_REQUEST_SUCCESS,
        paymentRequest: paymentRequest.data,
      });
      dispatch(navigateTo("Simplex"));

      mixpanelAnalytics.initiatedBuyCoinsRequest(
        "CARD",
        formData.coin,
        "USD",
        formData.amountCrypto,
        formData.amountUsd
      );
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.CREATE_PAYMENT_REQUEST, err));
    }
  };
}

/**
 * Gets all simplex payments
 * @param {string} quoteId
 * @param {string} coin
 * @param {string} fiatCurrency
 * @param {string} fiatTotalAmount
 * @param {string} fiatBaseAmount
 * @param {string} requestedCurrency
 * @param {string} amount
 */
function getAllSimplexPayments() {
  return async dispatch => {
    dispatch(startApiCall(API.GET_PAYMENT_REQUESTS));

    try {
      const res = await simplexService.getAllPayments();

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
