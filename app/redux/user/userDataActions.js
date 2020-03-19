import _ from "lodash";
import moment from "moment";

import Constants from "../../../constants";
import ACTIONS from "../../constants/ACTIONS";
import API from "../../constants/API";
import { apiError, startApiCall } from "../api/apiActions";
import { showMessage, openModal, closeModal } from "../ui/uiActions";
import userProfileService from "../../services/user-profile-service";
import { deleteSecureStoreKey } from "../../utils/expo-storage";
import logger from "../../utils/logger-util";
import { setFormErrors, updateFormField } from "../forms/formsActions";
import { default as NavActions, navigateTo } from "../nav/navActions";
import { MODALS } from "../../constants/UI";
import apiUtil from "../../utils/api-util";
import { getWalletSummary } from "../wallet/walletActions";
import userDataService from "../../services/user-data-service";
import { getUserPersonalInfoSuccess } from "./userProfileActions";
import { getUserKYCStatus, isUserLoggedIn } from "../../utils/user-util";
import { KYC_STATUSES } from "../../constants/DATA";

const { SECURITY_STORAGE_AUTH_KEY } = Constants;

export {
  getCelsiusMemberStatus,
  getUserAppSettings,
  setUserAppSettings,
  getLinkedBankAccount,
  linkBankAccount,
  setHodlProps,
  getUserStatus,
};

/**
 * Gets profile info for user
 */
function getProfileInfo() {
  return async dispatch => {
    dispatch(startApiCall(API.GET_USER_PERSONAL_INFO));

    try {
      const personalInfoRes = await userProfileService.getPersonalInfo();
      const personalInfo = personalInfoRes.data.profile || personalInfoRes.data;
      dispatch(getUserPersonalInfoSuccess(personalInfo));
    } catch (err) {
      if (err.status === 422) {
        deleteSecureStoreKey(SECURITY_STORAGE_AUTH_KEY);
      }
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_USER_PERSONAL_INFO, err));
    }
  };
}

/**
 * Get linked bank account info
 */
function getLinkedBankAccount() {
  return async dispatch => {
    dispatch(startApiCall(API.GET_LINKED_BANK_ACCOUNT));

    try {
      const res = await userDataService.getLinkedBankAccount();
      dispatch({
        type: ACTIONS.GET_LINKED_BANK_ACCOUNT_SUCCESS,
        bankAccountInfo: res.data,
      });
    } catch (err) {
      logger.err(err);
    }
  };
}

/**
 * Set Bank account info
 *
 * @param {Object} bankAccountInfo
 * @param {string} bankAccountInfo.bank_name
 * @param {string} bankAccountInfo.bank_routing_number
 * @param {string} bankAccountInfo.account_type
 * @param {string} bankAccountInfo.bank_account_number
 * @param {string} bankAccountInfo.swift
 * @param {string} bankAccountInfo.iban
 * @param {string} bankAccountInfo.location
 */
function linkBankAccount(bankAccountInfo) {
  return async dispatch => {
    try {
      dispatch(startApiCall(API.LINK_BANK_ACCOUNT));
      const bankRes = await userDataService.linkBankAccount(bankAccountInfo);
      dispatch({ type: ACTIONS.LINK_BANK_ACCOUNT_SUCCESS });
      dispatch(updateFormField("bankInfo", bankRes.data));
      dispatch(navigateTo("ConfirmYourLoan"));
    } catch (err) {
      if (err.status === 422) {
        dispatch(setFormErrors(apiUtil.parseValidationErrors(err)));
      } else {
        dispatch(showMessage("error", err.msg));
      }
      dispatch(apiError(API.LINK_BANK_ACCOUNT, err));
    }
  };
}

/**
 * If user has never been a member, he receives 1CEL and becomes a member
 */
function getCelsiusMemberStatus() {
  return async dispatch => {
    try {
      dispatch(startApiCall(API.GET_MEMBER_STATUS));
      const celMemberStatus = await userDataService.getCelsiusMemberStatus();
      if (celMemberStatus.data.is_new_member) {
        dispatch(openModal(MODALS.BECAME_CEL_MEMBER_MODAL));
      }
      dispatch(getWalletSummary());
      dispatch(getProfileInfo());
      dispatch({
        type: ACTIONS.GET_MEMBER_STATUS_SUCCESS,
        isNewMember: celMemberStatus.data.is_new_member,
      });
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_PREVIOUS_SCREEN, err));
    }
  };
}

/**
 * Gets app settings for user
 */
function getUserAppSettings() {
  return async dispatch => {
    try {
      dispatch(startApiCall(API.GET_APP_SETTINGS));
      const userAppData = await userDataService.getUserAppSettings();
      dispatch({
        type: ACTIONS.GET_APP_SETTINGS_SUCCESS,
        userAppData: userAppData.data,
      });
    } catch (e) {
      dispatch(apiError(API.GET_APP_SETTINGS, e));
      dispatch(showMessage("error", e.msg));
    }
  };
}

/**
 * Sets app settings for user
 *
 * @param {Object} data
 * @param {boolean} data.interest_in_cel
 */
function setUserAppSettings(data) {
  return async (dispatch, getState) => {
    try {
      dispatch(startApiCall(API.SET_APP_SETTINGS));
      const appSettings = getState().user.appSettings;

      const newData = { ...data };
      if (newData.interest_in_cel_per_coin) {
        newData.interest_in_cel_per_coin = JSON.stringify(
          newData.interest_in_cel_per_coin
        );
      }

      const userAppData = await userDataService.setUserAppSettings(newData);
      const newSettings = userAppData.data;

      dispatch({
        type: ACTIONS.SET_APP_SETTINGS_SUCCESS,
        userAppData: newSettings,
      });

      const currentDate = moment.utc();

      const newDataKeys = Object.keys(newData);

      if (
        newDataKeys.includes("interest_in_cel") ||
        newDataKeys.includes("interest_in_cel_per_coin")
      ) {
        const coins = Object.keys(newSettings.interest_in_cel_per_coin);

        const changedCoins = [];
        const coinsInCel = [];

        coins.forEach(c => {
          if (newSettings.interest_in_cel_per_coin[c]) {
            coinsInCel.push(c);
          }

          if (
            newSettings.interest_in_cel_per_coin[c] !==
            appSettings.interest_in_cel_per_coin[c]
          ) {
            changedCoins.push(c);
          }
        });
        if (newSettings.interest_in_cel !== appSettings.interest_in_cel) {
          if (currentDate.day() <= 5 && currentDate.hour() < 17) {
            if (newSettings.interest_in_cel && changedCoins === coinsInCel) {
              return dispatch(
                showMessage(
                  "success",
                  `Congrats! Starting next Monday, ${currentDate
                    .day(8)
                    .format(
                      "DD MMMM"
                    )}, you will receive interest income in CEL on all deposited coins.`
                )
              );
            }
            if (!newSettings.interest_in_cel)
              return dispatch(
                showMessage(
                  "warning",
                  `You’re missing out on better rates! Upgrade your interest settings at any time and unlock even greater rewards by choosing to earn interest income in CEL.`
                )
              );
          } else {
            if (newSettings.interest_in_cel) {
              return dispatch(
                showMessage(
                  "success",
                  `Congrats! You have chosen to earn interest income in CEL for all deposited coins. Interest has already been calculated for this week, so you will receive interest in CEL beginning Monday, ${currentDate
                    .day(15)
                    .format("DD MMMM")}. `
                )
              );
            }
            if (!newSettings.interest_in_cel)
              return dispatch(
                showMessage(
                  "success",
                  `You have chosen to earn interest income in-kind for all deposited coins. Interest has already been calculated for this week, so you will receive interest in-kind beginning Monday, ${currentDate
                    .day(15)
                    .format("DD MMMM")}.`
                )
              );
          }
        }

        if (
          !_.isEqual(
            newSettings.interest_in_cel_per_coin,
            appSettings.interest_in_cel_per_coin
          )
        ) {
          if (currentDate.day() <= 5 && currentDate.hour() < 17) {
            if (coinsInCel.length) {
              return dispatch(
                showMessage(
                  "success",
                  `Congrats! Starting next Monday, ${currentDate
                    .day(8)
                    .format(
                      "DD MMMM"
                    )}, you will receive interest income on selected coins in CEL.`
                )
              );
            }
            return dispatch(
              showMessage(
                "success",
                `Starting next Monday, ${currentDate
                  .day(8)
                  .format(
                    "DD MMMM"
                  )}, you will receive interest income on selected coinsin in original coins.`
              )
            );
          }

          if (coinsInCel.length) {
            return dispatch(
              showMessage(
                "success",
                `Congrats! You have chosen to earn interest income in CEL. Interest has already been calculated for this week, so you will receive interest in CEL beginning Monday, ${currentDate
                  .day(15)
                  .format("DD MMMM")}`
              )
            );
          }
          return dispatch(
            showMessage(
              "success",
              `You have chosen to earn interest income in ${changedCoins.join(
                ", "
              )}. Interest has already been calculated for this week, so you will receive interest in selected  coins beginning Monday, ${currentDate
                .day(15)
                .format("DD MMMM")}. `
            )
          );
        }
      }
    } catch (e) {
      dispatch(apiError(API.SET_APP_SETTINGS, e));
      dispatch(showMessage("error", e.msg));
    }
  };
}

/**
 * polling of userStatus (kyc, hodl) every 30 seconds
 */

function getUserStatus() {
  return async (dispatch, getState) => {
    const status = getUserKYCStatus();
    const isLoggedIn = isUserLoggedIn();
    const appInitialized = getState().app.appInitialized;
    const activeScreen = getState().nav.activeScreen;

    if (!isLoggedIn || !appInitialized || activeScreen === "VerifyProfile")
      return;

    dispatch(startApiCall(API.POLL_USER_DATA));

    try {
      const res = await userDataService.getUserStatus();
      const hodlStatus = res.data.hodlModeStatus;
      const kyc = res.data.kycStatus;
      const newStatus = res.data.kycStatus.status;

      dispatch({
        type: ACTIONS.POLL_HODL_STATUS_SUCCESS,
        hodlStatus,
      });

      dispatch({
        type: ACTIONS.GET_KYC_STATUS_SUCCESS,
        kyc,
      });

      if (newStatus === KYC_STATUSES.permanently_rejected) {
        dispatch(closeModal());
        return dispatch(NavActions.navigateTo("KYCFinalRejection"));
      }

      if (newStatus !== status) {
        dispatch(closeModal());
        if (newStatus === KYC_STATUSES.passed) {
          return dispatch(NavActions.navigateTo("WalletLanding"));
        }

        if (newStatus === KYC_STATUSES.rejected) {
          return dispatch(NavActions.navigateTo("WalletLanding"));
        }
      }
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.POLL_USER_DATA, err));
    }
  };
}

/**
 *
 */
function setHodlProps(activeHodlMode) {
  return {
    type: ACTIONS.SET_HODL_PROPS,
    activeHodlMode,
  };
}
