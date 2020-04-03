import ACTIONS from "../../constants/ACTIONS";
import API from "../../constants/API";
import { apiError, startApiCall } from "../api/apiActions";
import { showMessage } from "../ui/uiActions";
import { clearForm } from "../forms/formsActions";
import walletService from "../../services/wallet-service";
import { navigateTo } from "../nav/navActions";
import addressUtil from "../../utils/address-util";

export {
  getWalletSummary,
  getAllCoinWithdrawalAddresses,
  setCoinWithdrawalAddress,
  setCoinWithdrawalAddressLabel,
  setCoinWithdrawalAddressLabels,
  getCoinAddress,
};

/**
 * Gets wallet summary for user
 */
function getWalletSummary() {
  return async dispatch => {
    try {
      dispatch(startApiCall(API.GET_WALLET_SUMMARY));
      const res = await walletService.getWalletSummary();

      dispatch({
        type: ACTIONS.GET_WALLET_SUMMARY_SUCCESS,
        wallet: res.data,
      });
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_WALLET_SUMMARY, err));
    }
  };
}

/**
 * Gets Deposit address for coin
 * @param {string} coin - btc|eth|xrp
 */
function getCoinAddress(coin) {
  return async dispatch => {
    try {
      dispatch(startApiCall(API.GET_COIN_ADDRESS));

      const res = await walletService.getCoinAddress(coin);
      dispatch(
        getCoinAddressSuccess({
          [`${coin}Address`]: res.data.wallet.address,
          [`${coin}AlternateAddress`]: res.data.wallet.address_alt,
          [`${coin}RawResponse`]: res.data.wallet,
        })
      );
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_COIN_ADDRESS, err));
    }
  };
}

/**
 * TODO add JSDoc
 */
function getCoinAddressSuccess(address) {
  return {
    type: ACTIONS.GET_COIN_ADDRESS_SUCCESS,
    callName: API.GET_COIN_ADDRESS,
    address,
  };
}

/**
 * Sets withdrawal address for user for coin
 *
 * @param {string} flow - one of withdrawal|change-address
 */
function setCoinWithdrawalAddress(flow = "withdrawal") {
  return async (dispatch, getState) => {
    try {
      const { formData } = getState().forms;
      const { coin, coinTag, withdrawAddress } = formData;

      const address = addressUtil.joinAddressTag(
        coin,
        withdrawAddress,
        coinTag
      );

      const verification = {
        pin: formData.pin,
        twoFactorCode: formData.code,
      };

      dispatch(startApiCall(API.SET_COIN_WITHDRAWAL_ADDRESS));
      const response = await walletService.setCoinWithdrawalAddress(
        coin,
        address,
        verification
      );

      dispatch(setCoinWithdrawalAddressSuccess(coin, response.data));

      const nextScreen =
        flow === "change-address" ? "WithdrawAddressLabel" : "WithdrawConfirm";
      dispatch(navigateTo(nextScreen));

      if (flow === "change-address") {
        dispatch(
          showMessage(
            "success",
            `Open your email to confirm the change of your ${formData.coin} withdrawal address. Note that withdrawals for ${formData.coin} will be locked for the next 24h due to our security protocols.`
          )
        );
      }
    } catch (error) {
      dispatch(showMessage("error", error.msg));
      dispatch(apiError(API.SET_COIN_WITHDRAWAL_ADDRESS, error));
    }
  };
}

/**
 *  Sets withdrawal addresse label
 *  @param {string} coin - short coin name
 *  @param {string} label - label name for Wallet Withdraw Address
 */
function setCoinWithdrawalAddressLabel(coin, label) {
  return async dispatch => {
    try {
      dispatch(startApiCall(API.SET_COIN_WITHDRAWAL_ADDRESS_LABEL));

      const response = await walletService.setCoinWithdrawalAddressLabel(
        coin,
        label
      );
      dispatch(setCoinWithdrawalAddressLabelSuccess(coin, response.data));
      dispatch(navigateTo("WithdrawAddressOverview"));
      dispatch(clearForm());
    } catch (error) {
      dispatch(showMessage("error", error.msg));
      dispatch(apiError(API.SET_COIN_WITHDRAWAL_ADDRESS_LABEL, error));
    }
  };
}

/**
 *  Gets all withdrawal addresses previously set by user
 */
function getAllCoinWithdrawalAddresses() {
  return async dispatch => {
    try {
      dispatch(startApiCall(API.GET_ALL_COIN_WITHDRAWAL_ADDRESSES));
      const response = await walletService.getAllCoinWithdrawalAddresses();
      dispatch(getAllCoinWithdrawalAddressesSuccess(response.data));
    } catch (error) {
      dispatch(showMessage(`error`, error.msg));
      dispatch(apiError(API.GET_ALL_COIN_WITHDRAWAL_ADDRESSES, error));
    }
  };
}

/**
 * TODO add JSDoc
 */
function getAllCoinWithdrawalAddressesSuccess(allWalletAddresses) {
  return {
    type: ACTIONS.GET_ALL_COIN_WITHDRAWAL_ADDRESSES_SUCCESS,
    allWalletAddresses,
  };
}

/**
 * TODO add JSDoc
 */
function setCoinWithdrawalAddressLabels(walletAddressLabels) {
  return {
    type: ACTIONS.SET_COIN_WITHDRAWAL_ADDRESS_LABELS,
    walletAddressLabels,
  };
}
/**
 * TODO add JSDoc
 */
function setCoinWithdrawalAddressSuccess(coin, address) {
  return {
    type: ACTIONS.SET_COIN_WITHDRAWAL_ADDRESS_SUCCESS,
    callName: API.SET_COIN_WITHDRAWAL_ADDRESS,
    address: {
      [coin]: address,
    },
  };
}

function setCoinWithdrawalAddressLabelSuccess(coin, address) {
  return {
    type: ACTIONS.SET_COIN_WITHDRAWAL_ADDRESS_LABEL_SUCCESS,
    callName: API.SET_COIN_WITHDRAWAL_ADDRESS_LABEL,
    address: {
      [coin]: address,
    },
  };
}
