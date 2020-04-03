import Branch from "react-native-branch";

import Constants from "../../../constants";
import ACTIONS from "../../constants/ACTIONS";
import API from "../../constants/API";
import { startApiCall, apiError } from "../api/apiActions";
import { navigateTo, resetToScreen } from "../nav/navActions";
import { showMessage } from "../ui/uiActions";
import { initAppData, showVerifyScreen } from "../app/appActions";
import {
  registerUserFacebook,
  registerUserGoogle,
  registerUserTwitter,
} from "./thirdPartyActions";
import { claimAllBranchTransfers } from "../transfers/transfersActions";
import {
  deleteSecureStoreKey,
  setSecureStoreKey,
} from "../../utils/expo-storage";
import userProfileService from "../../services/user-profile-service";
import userAuthService from "../../services/user-auth-service";
import apiUtil from "../../utils/api-util";
import logger from "../../utils/logger-util";
import { setFormErrors } from "../forms/formsActions";
import appsFlyerUtil from "../../utils/appsflyer-util";
import branchUtil from "../../utils/branch-util";
import mixpanelAnalytics from "../../utils/mixpanel-analytics";
import {
  logoutUserMixpanel,
  registerMixpanelUser,
} from "../../utils/mixpanel-util";

const { SECURITY_STORAGE_AUTH_KEY } = Constants;

export {
  createAccount,
  registerUser,
  loginUser,
  logoutUser,
  expireSession,
  sendResetLink,
  refreshAuthToken,
};

/**
 * Logs the user in with email and password
 */
function loginUser() {
  return async (dispatch, getState) => {
    try {
      const { formData } = getState().forms;

      dispatch(startApiCall(API.LOGIN_USER));
      const res = await userAuthService.login({
        email: formData.email,
        password: formData.password,
        reCaptchaKey: formData.reCaptchaKey,
      });
      // add token to expo storage
      await setSecureStoreKey(
        SECURITY_STORAGE_AUTH_KEY,
        res.data.auth0.id_token
      );

      const userRes = await userProfileService.getPersonalInfo();
      const user = userRes.data;

      const { showVerifyScreen: showVerifyScreenValue } = getState().app;
      if (!showVerifyScreenValue) {
        await dispatch(initAppData());
        dispatch(claimAllBranchTransfers());
      }

      dispatch({
        type: ACTIONS.LOGIN_USER_SUCCESS,
        callName: API.LOGIN_USER,
        tokens: res.data.auth0,
        user,
      });

      if (!user.pin) {
        dispatch(navigateTo("RegisterSetPin"));
      } else {
        dispatch(navigateTo("VerifyScreen"), {
          onSuccess: () => {
            resetToScreen("WalletLanding");
          },
        });
      }
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.LOGIN_USER, err));
    }
  };
}

/**
 * Registers a user signed up with email
 */
function registerUser() {
  return async (dispatch, getState) => {
    try {
      const { formData } = getState().forms;
      const referralLinkId = branchUtil.getReferralId();

      const user = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password,
        referral_link_id: referralLinkId || undefined,
        reCaptchaKey: formData.reCaptchaKey,
      };
      dispatch(startApiCall(API.REGISTER_USER));
      const res = await userAuthService.register(user);

      // add token to expo storage
      await setSecureStoreKey(
        SECURITY_STORAGE_AUTH_KEY,
        res.data.auth0.id_token
      );
      await dispatch(initAppData());

      mixpanelAnalytics.sessionStarted("User registred");
      dispatch(claimAllBranchTransfers());
      dispatch({
        type: ACTIONS.REGISTER_USER_SUCCESS,
        user: res.data.user,
        tokens: res.data.auth0,
      });
      dispatch(navigateTo("RegisterSetPin"));
    } catch (err) {
      if (err.type === "Validation error") {
        dispatch(setFormErrors(apiUtil.parseValidationErrors(err)));
      } else {
        dispatch(showMessage("error", err.msg));
      }
      dispatch(apiError(API.REGISTER_USER, err));
    }
  };
}

/**
 * Sends an email with the reset password link
 */
function sendResetLink() {
  return async (dispatch, getState) => {
    try {
      const { formData } = getState().forms;
      dispatch(startApiCall(API.SEND_RESET_LINK));
      await userAuthService.sendResetLink(formData.email);
      dispatch(showMessage("info", "Email sent!"));
      dispatch(navigateTo("Login"));
      dispatch({ type: ACTIONS.SEND_RESET_LINK_SUCCESS });
      mixpanelAnalytics.forgottenPassword();
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.SEND_RESET_LINK, err));
    }
  };
}

/**
 * Logs the user out of the app
 */
function logoutUser() {
  return async dispatch => {
    try {
      await logoutUserMixpanel();
      await deleteSecureStoreKey(SECURITY_STORAGE_AUTH_KEY);
      await deleteSecureStoreKey("HIDE_MODAL_INTEREST_IN_CEL");
      if (Constants.appOwnership === "standalone") Branch.logout();
      dispatch({
        type: ACTIONS.LOGOUT_USER,
      });
      await dispatch(resetToScreen("Welcome"));
      await dispatch(navigateTo("Welcome"));
      dispatch(showVerifyScreen(false));
      mixpanelAnalytics.sessionEnded("Logout user");
    } catch (err) {
      logger.err(err);
    }
  };
}

/**
 * Expires the session for the user
 */
function expireSession() {
  return async dispatch => {
    try {
      dispatch({
        type: ACTIONS.EXPIRE_SESSION,
      });
    } catch (err) {
      logger.err(err);
    }
  };
}

/**
 * Creates an account for user no matter the registration method
 */
function createAccount() {
  return async (dispatch, getState) => {
    const { formData } = getState().forms;

    if (formData.googleId) {
      await dispatch(registerUserGoogle());
    }

    if (formData.facebookId) {
      await dispatch(registerUserFacebook());
    }

    if (formData.twitterId) {
      await dispatch(registerUserTwitter());
    }

    if (!formData.googleId && !formData.facebookId && !formData.twitterId) {
      await dispatch(registerUser());
    }

    const user = getState().user.profile;
    if (user.id) {
      appsFlyerUtil.registrationCompleted(user);
      registerMixpanelUser(user.id);
      mixpanelAnalytics.registrationCompleted(user);
    }
  };
}

/**
 * Refreshes auth token when it is about to expire
 */
function refreshAuthToken() {
  return async dispatch => {
    try {
      dispatch(startApiCall(API.REFRESH_AUTH_TOKEN));
      const res = await userAuthService.refreshAuthToken();
      await setSecureStoreKey(
        SECURITY_STORAGE_AUTH_KEY,
        res.data[SECURITY_STORAGE_AUTH_KEY]
      );

      dispatch({
        type: ACTIONS.REFRESH_AUTH_TOKEN_SUCCESS,
      });
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.REFRESH_AUTH_TOKEN, err));
    }
  };
}
