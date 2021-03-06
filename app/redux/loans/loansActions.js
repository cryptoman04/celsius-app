import ACTIONS from "../../constants/ACTIONS";
import API from "../../constants/API";
import { showMessage, closeModal, openModal } from "../ui/uiActions";
import { apiError, startApiCall } from "../api/apiActions";
import { navigateTo } from "../nav/navActions";
import loansService from "../../services/loans-service";
import formatter from "../../utils/formatter";
import loanUtil from "../../utils/loan-util";
import { MODALS, LOAN_ALERTS } from "../../constants/UI";
import mixpanelAnalytics from "../../utils/mixpanel-analytics";
import appsFlyerUtil from "../../utils/appsflyer-util";

export {
  applyForALoan,
  getAllLoans,
  getLoanById,
  confirmLoanInfo,
  setActiveLoan,
  cancelLoan,
  lockMarginCollateral,
  updateLoanSettings,
  loanApplyPreviewData,
  getLoanSettings,
  payPrincipal,
  prepayInterest,
  payMonthlyInterest,
  getAmortizationTable,
  checkForLoanAlerts,
  sendBankDetailsEmail,
  lockMarginCallCollateral,
};

/**
 * Applies the user for a loan
 */
function applyForALoan() {
  return async (dispatch, getState) => {
    const { formData } = getState().forms;
    const { automaticLoanLimit } = getState().generalData;

    startApiCall(API.APPLY_FOR_LOAN);

    const loanApplication = {
      coin: formData.collateralCoin,
      ltv: formData.ltv,
      interest: formData.interest,
      loan_amount: formData.loanAmount,
      term_of_loan: formData.termOfLoan,
      bank_info_id: formData.bankInfo ? formData.bankInfo.id : undefined,
      loan_asset_short: formData.coin,
    };
    try {
      const verification = {
        pin: formData.pin,
        twoFactorCode: formData.code,
      };

      const res = await loansService.apply(loanApplication, verification);
      dispatch({ type: ACTIONS.APPLY_FOR_LOAN_SUCCESS });

      const allLoans = await loansService.getAllLoans();

      dispatch({
        type: ACTIONS.GET_ALL_LOANS_SUCCESS,
        callName: API.GET_ALL_LOANS,
        allLoans,
      });

      dispatch(
        navigateTo("LoanRequestDetails", {
          id: res.data.loan.id,
          hideBack: true,
        })
      );
      dispatch(showMessage("success", "Loan created successfully!"));

      if (
        Number(formData.loanAmount) <= Number(automaticLoanLimit) &&
        formData.coin !== "USD"
      ) {
        dispatch(openModal(MODALS.LOAN_APPLICATION_SUCCESS_MODAL));
      }

      appsFlyerUtil.loanApplied(res.data);
      mixpanelAnalytics.loanApplied(res.data);
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.APPLY_FOR_LOAN, err));
    }
  };
}

/**
 * Applies the user for a loan
 */
function loanApplyPreviewData() {
  return async (dispatch, getState) => {
    const { formData } = getState().forms;
    dispatch(startApiCall(API.APPLY_FOR_LOAN_PREVIEW_DATA));

    const loanApplication = {
      coin: formData.collateralCoin,
      ltv: formData.ltv,
      interest: formData.interest,
      loan_amount: formData.loanAmount,
      term_of_loan: formData.termOfLoan,
      bank_info_id: formData.bankInfo ? formData.bankInfo.id : undefined,
      loan_asset_short: formData.coin,
    };

    try {
      const res = await loansService.loanApplyPreviewData(loanApplication);
      dispatch({
        type: ACTIONS.APPLY_FOR_LOAN_PREVIEW_DATA_SUCCESS,
        loan: loanUtil.mapLoan(res.data),
      });
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.APPLY_FOR_LOAN_PREVIEW_DATA, err));
    }
  };
}

/**
 * Get all loans for user
 */
function getAllLoans() {
  return async dispatch => {
    try {
      startApiCall(API.GET_ALL_LOANS);
      const allLoans = await loansService.getAllLoans();

      dispatch({
        type: ACTIONS.GET_ALL_LOANS_SUCCESS,
        callName: API.GET_ALL_LOANS,
        allLoans,
      });
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_ALL_LOANS, err));
    }
  };
}

/**
 * Get loans by id
 */
function getLoanById(id) {
  return async dispatch => {
    try {
      startApiCall(API.GET_LOAN);
      const res = await loansService.getLoanById(id);

      dispatch({
        type: ACTIONS.GET_LOAN_SUCCESS,
        loan: loanUtil.mapLoan(res.data),
      });
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_ALL_LOANS, err));
    }
  };
}

/**
 * Get loan information for confirmation for user
 */
function confirmLoanInfo(data) {
  return async dispatch => {
    try {
      startApiCall(API.GET_CONFIRM_LOAN_INFO);
      const res = await loansService.setConfirmLoanInfo(data);
      const loanInfo = res.data;

      dispatch({
        type: ACTIONS.GET_CONFIRM_LOAN_INFO_SUCCESS,
        callName: API.GET_CONFIRM_LOAN_INFO,
        loanInfo,
      });
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_ALL_LOANS, err));
    }
  };
}

/**
 * Add collateral on margin call
 *
 * @param {String} marginCallID
 * @param {Object} marginCallData
 * @param {String} marginCallData.coin
 * @param {String} marginCallData.amount_collateral_usd
 * @param {String} marginCallData.amount_collateral_crypto
 *
 * @returns {Promise}
 */
function lockMarginCollateral(marginCallID, marginCallData) {
  return async dispatch => {
    try {
      startApiCall(API.LOCK_MARGIN_CALL_COLLATERAL);

      await loansService.lockMarginCollateral(marginCallID, marginCallData);

      dispatch({
        type: ACTIONS.LOCK_MARGIN_CALL_COLLATERAL_SUCCESS,
        callName: API.LOCK_MARGIN_CALL_COLLATERAL,
      });

      dispatch(
        showMessage(
          "success",
          `You have successfully locked on additional ${formatter.crypto(
            marginCallData.amount_collateral_crypto,
            marginCallData.coin
          )} as collateral.`
        )
      );
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.LOCK_MARGIN_CALL_COLLATERAL, err));
    }
  };
}

/**
 * Sets active loan in the reducer
 *
 * @param {uuid} - loanId
 */
function setActiveLoan(loanId) {
  return {
    type: ACTIONS.SET_ACTIVE_LOAN,
    loanId,
  };
}

/**
 * Cancels desired pending loan
 */
function cancelLoan() {
  return async (dispatch, getState) => {
    try {
      const { loanId } = getState().forms.formData;
      startApiCall(API.CANCEL_LOAN);
      await loansService.cancelLoan(loanId);

      dispatch(showMessage("success", "Loan successfully canceled!"));
      dispatch(closeModal());
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.CANCEL_LOAN, err));
    }
  };
}

/**
 *  Update Loan Settings
 *
 *  param {String} loanId
 *  param {Object} loan.setting true/false
 */

function updateLoanSettings(id, value) {
  return async dispatch => {
    try {
      startApiCall(API.UPDATE_LOAN_SETTINGS);
      const res = await loansService.updateLoanSettings(id, value);
      const loanSettings = res.data;

      dispatch({
        type: ACTIONS.UPDATE_LOAN_SETTINGS_SUCCESS,
        callName: API.UPDATE_LOAN_SETTINGS,
        loanSettings,
      });
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.UPDATE_LOAN_SETTINGS, err));
    }
  };
}

/**
 *
 * @param {Number} id
 * @returns {Function}
 */

function getLoanSettings(id) {
  return async dispatch => {
    try {
      startApiCall(API.GET_LOAN_SETTINGS);
      const res = await loansService.getLoanSettings(id);
      const loanSettings = res.data;

      dispatch({
        type: ACTIONS.GET_LOAN_SETTINGS_SUCCESS,
        callName: API.GET_LOAN_SETTINGS,
        loanSettings,
      });
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_LOAN_SETTINGS, err));
    }
  };
}

/**
 *
 * @param {Number} loanId
 * @returns {Function}
 */

function prepayInterest(id) {
  return async (dispatch, getState) => {
    startApiCall(API.PREPAY_LOAN_INTEREST);

    try {
      const { formData } = getState().forms;
      const verification = {
        pin: formData.pin,
        twoFactorCode: formData.code,
      };

      const res = await loansService.prepayInterest(
        formData.prepaidPeriod,
        formData.coin,
        id,
        verification
      );
      const transactionId = res.data.transaction_id;

      dispatch({
        type: ACTIONS.PREPAY_LOAN_INTEREST_SUCCESS,
      });
      dispatch(navigateTo("TransactionDetails", { id: transactionId }));
      dispatch(openModal(MODALS.PREPAYMENT_SUCCESSFUL_MODAL));
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.PREPAY_LOAN_INTEREST, err));
      dispatch(navigateTo("BorrowLanding"));
    }
  };
}

/**
 * Pays principal for the selected loan
 *
 * @param {Number} id
 */

function payPrincipal(id) {
  return async (dispatch, getState) => {
    startApiCall(API.PAY_LOAN_PRINCIPAL);

    try {
      const { formData } = getState().forms;
      const verification = {
        pin: formData.pin,
        twoFactorCode: formData.code,
      };

      const res = await loansService.payPrincipal(id, verification);

      const transactionId = res.data.transaction_id;
      dispatch(navigateTo("TransactionDetails", { id: transactionId }));
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.PAY_LOAN_PRINCIPAL, err));
    }
  };
}

function lockMarginCallCollateral(id, coin) {
  return async (dispatch, getState) => {
    let apiCallName;
    try {
      const { formData } = getState().forms;

      const verification = {
        pin: formData.pin,
        twoFactorCode: formData.code,
      };

      apiCallName = API.PAY_MARGIN_CALL;
      startApiCall(apiCallName);
      const res = await loansService.lockMarginCallCollateral(
        id,
        coin,
        verification
      );

      const transactionId = res.data.transaction_id;
      dispatch(navigateTo("TransactionDetails", { id: transactionId }));

      apiCallName = API.GET_ALL_LOANS;
      startApiCall(API.GET_ALL_LOANS);
      const allLoans = await loansService.getAllLoans();

      dispatch({
        type: ACTIONS.GET_ALL_LOANS_SUCCESS,
        callName: API.GET_ALL_LOANS,
        allLoans,
      });
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(apiCallName, err));
    }
  };
}

/**
 * Pay monthly interest for specific loan
 *
 * @param {UUID} id - loan id
 * @param {string} coin - BTC|ETH coin in which interest should be paid
 */
function payMonthlyInterest(id, coin) {
  return async (dispatch, getState) => {
    startApiCall(API.PAY_LOAN_INTEREST);

    try {
      const { formData } = getState().forms;
      const verification = {
        pin: formData.pin,
        twoFactorCode: formData.code,
      };

      const res = await loansService.payMonthlyInterest(id, coin, verification);
      const transactionId = res.data.transaction_id;
      dispatch({ type: ACTIONS.PAY_LOAN_INTEREST_SUCCESS });
      dispatch(navigateTo("TransactionDetails", { id: transactionId }));
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.PAY_LOAN_PRINCIPAL, err));
    }
  };
}

// TODO: remove
function getAmortizationTable(id) {
  return async dispatch => {
    startApiCall(API.GET_AMORTIZATION_TABLE);

    try {
      const res = await loansService.getAmortizationTable(id);
      const amortizationTable = res.data;

      dispatch({
        type: ACTIONS.GET_AMORTIZATION_TABLE_SUCCESS,
        callName: API.GET_AMORTIZATION_TABLE,
        amortizationTable,
      });
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_AMORTIZATION_TABLE, err));
    }
  };
}

/**
 * Opens initial modal for loan payment warning (interest, principal, margin call)
 *
 */
function checkForLoanAlerts() {
  return (dispatch, getState) => {
    const { allLoans } = getState().loans;

    const loanAlerts = [];
    allLoans.forEach(l => {
      if (
        l.installments_to_be_paid &&
        Number(l.installments_to_be_paid.total)
      ) {
        loanAlerts.push({ id: l.id, type: LOAN_ALERTS.INTEREST_ALERT });
      }

      if (l.margin_call_activated) {
        loanAlerts.push({ id: l.id, type: LOAN_ALERTS.MARGIN_CALL_ALERT });
      }

      if (l.can_pay_principal && l.coin_loan_asset !== "USD") {
        loanAlerts.push({ id: l.id, type: LOAN_ALERTS.PRINCIPAL_ALERT });
      }
    });

    dispatch({
      type: ACTIONS.CHECK_LOAN_ALERTS,
      loanAlerts,
    });

    if (loanAlerts.length) {
      dispatch(openModal(MODALS.LOAN_ALERT_MODAL));
    }
  };
}

function sendBankDetailsEmail() {
  return async dispatch => {
    try {
      startApiCall(API.SEND_BANK_WIRING_INFO_DETAIL);

      await loansService.sendBankDetailsEmail();
      dispatch(
        showMessage(
          "success",
          "You should receive email with wiring bank info shortly"
        )
      );
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.SEND_BANK_WIRING_INFO_DETAIL, err));
    }
  };
}
