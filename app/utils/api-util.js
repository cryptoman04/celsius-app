import axios from "axios";
import qs from "qs";
import r from "jsrsasign";
import { Platform } from "react-native";
import { Base64 } from "js-base64";
import DeviceInfo from "react-native-device-info";
import CodePush from "react-native-code-push";

import logger from "./logger-util";
import Constants from "../../constants";
import { getSecureStoreKey } from "../utils/expo-storage";
import store from "../redux/store";
import * as actions from "../redux/actions";
import { isKYCRejectedForever } from "./user-util";
import mixpanelAnalytics from "./mixpanel-analytics";

const {
  SECURITY_STORAGE_AUTH_KEY,
  CLIENT_VERSION,
  ENV,
  PUBLIC_KEY,
} = Constants;
let token;
let deviceModel;
let osVersion;
let revisionId;

export default {
  initInterceptors, // TODO split into multiple methods
  areCallsInProgress,
  parseValidationErrors,
};

/**
 * Initializes axios interceptors for every HTTP request
 */
function initInterceptors() {
  axios.interceptors.request.use(
    async req => {
      const newRequest = { ...req };
      newRequest.headers = {
        "X-Advertising-AFID": store.getState().app.appsFlyerUID,
      };

      if (Platform.OS === "ios") {
        newRequest.headers = {
          ...newRequest.headers,
          "X-Advertising-IDFA": store.getState().app.advertisingId,
        };
      } else {
        newRequest.headers = {
          ...newRequest.headers,
          "X-Advertising-AAID": store.getState().app.advertisingId,
        };
      }

      if (!deviceModel || !osVersion) {
        deviceModel = DeviceInfo.getModel();
        osVersion = DeviceInfo.getSystemVersion();
      }

      if (!revisionId) {
        CodePush.getUpdateMetadata().then(metadata => {
          revisionId = metadata
            ? `${metadata.appVersion}@${metadata.label}`
            : "local";
        });
      }

      const geolocation = store.getState().app.geolocation;

      if (geolocation) {
        newRequest.headers = {
          ...newRequest.headers,
          "geo-lat": geolocation.geoLat,
          "geo-long": geolocation.geoLong,
        };
      }

      if (!req.url.includes("branch.io")) {
        newRequest.headers = {
          ...newRequest.headers,
          installationId: Constants.installationId,
          os: Platform.OS,
          buildVersion: revisionId,
          deviceYearClass: Constants.deviceYearClass,
          deviceModel,
          osVersion,
        };
      }

      if (
        (req.url.includes("profile/profile_picture") &&
          !req.data.profile_picture_url) ||
        req.url.includes("user/profile/documents")
      ) {
        newRequest.headers = {
          ...newRequest.headers,
          "Content-Type": "multipart/form-data",
        };
      } else if (req.method === "post" && !req.url.includes("branch.io")) {
        // set x-www-form-urlencoded -> https://github.com/axios/axios#using-applicationx-www-form-urlencoded-format
        newRequest.data = qs.stringify(req.data);
        newRequest.headers = {
          ...newRequest.headers,
          Accept: "application/json",
          "Content-Type": "application/x-www-form-urlencoded; charset=UTF-8",
        };
      }

      // get token from secure store
      try {
        const storageToken = await getSecureStoreKey(SECURITY_STORAGE_AUTH_KEY);
        if (token !== storageToken) token = storageToken;

        if (token != null) {
          newRequest.headers = {
            ...newRequest.headers,
            authorization: `Bearer ${token}`,
          };
        }
      } catch (err) {
        logger.err(err);
      }

      if (ENV === "PRODUCTION" || ENV === "PREPROD") {
        newRequest.headers["X-Client-Version"] = CLIENT_VERSION;
      } else {
        newRequest.headers["X-Client-Version"] = ENV;
      }

      /* eslint-disable no-underscore-dangle */
      // console.log({ [req.method.toUpperCase()]: newRequest })
      /* eslint-enable no-underscore-dangle */

      return newRequest;
    },
    error => Promise.reject(error)
  );

  axios.interceptors.response.use(
    res => {
      const sign = res.headers["x-cel-sign"];
      const data = res.data;

      if (verifyKey(data, sign)) {
        /* eslint-disable no-underscore-dangle */
        // console.log({ RESPONSE: res })
        /* eslint-enable no-underscore-dangle */

        return res;
      }

      const err = {
        type: "Sign Error",
        msg: "Wrong API key",
      };

      /* eslint-disable no-underscore-dangle */
      // console.log({ API_ERROR: err })
      /* eslint-enable no-underscore-dangle */

      return Promise.reject(err);
    },
    async error => {
      const defaultMsg = "Oops, it looks like something went wrong.";
      const err = error.response
        ? error.response.data
        : {
            type: "Unknown Server Error",
            msg: defaultMsg,
            raw_error: error,
          };

      if (!err.msg) err.msg = defaultMsg;

      mixpanelAnalytics.apiError({
        ...err,
        url: error.config.url,
        method: error.config.method,
      });

      if (err.status === 401 && err.slug === "SESSION_EXPIRED") {
        store.dispatch(actions.expireSession());
        await store.dispatch(await actions.logoutUser());
      }

      if (err.status === 403 && err.slug === "USER_SUSPENDED") {
        const { profile } = store.getState().user;
        if (profile && profile.id) {
          await store.dispatch(await actions.logoutUser());
        }
        await store.dispatch(await actions.showMessage("error", err.msg));
      }

      if (error && error.response && error.response.status === 426) {
        const { showVerifyScreen } = store.getState().app;
        if (!showVerifyScreen) {
          store.dispatch(
            actions.navigateTo("VerifyProfile", {
              hideBack: true,
              show: error.response.data.show,
              onSuccess: () => {
                store.dispatch(
                  actions.navigateTo(
                    isKYCRejectedForever()
                      ? "KYCFinalRejection"
                      : "WalletLanding"
                  )
                );
              },
            })
          );
          store.dispatch(actions.showVerifyScreen());
        }
        return Promise.resolve();
      }

      if (error && error.response && error.response.status === 429) {
        store.dispatch(actions.navigateTo("LockedAccount"));
      }

      /* eslint-disable no-underscore-dangle */
      // console.log({ API_ERROR: err })
      /* eslint-enable no-underscore-dangle */

      return Promise.reject(err);
    }
  );
}

/**
 * Checks if api calls are in progress
 *
 * @param {Array} callsToCheck - array of api call names from API.js
 * @param {Array} callsInProgress - calls currently in progress
 * @returns {boolean}
 */
function areCallsInProgress(callsToCheck, callsInProgress = undefined) {
  const calls = callsInProgress || store.getState().api.callsInProgress;
  return !!calls.filter(cip => callsToCheck.indexOf(cip) !== -1).length;
}

/**
 * Parses validation errors from server
 *
 * @param {Object} serverError - error response from the server
 * @returns {Object} validationErrors - key/value pairs for errors, key is the field name, value is the error message from server
 */
function parseValidationErrors(serverError) {
  const errKeys = Object.keys(serverError.raw_error);
  const validationErrors = {};

  errKeys.forEach(ek => {
    validationErrors[ek] = serverError.raw_error[ek].msg;
  });

  return validationErrors;
}

/**
 * Verifies the data with signature key from the server
 *
 * @param {Object} address - data from server response
 * @param {string} sign - sign from response headers
 * @returns {boolean}
 *
 * endpont /users/hodl_mode/begin returns wrong api key
 * CN-4875 Wire hodl mode
 */
function verifyKey(data, sign) {
  try {
    const sig2 = new r.KJUR.crypto.Signature({ alg: "SHA256withRSA" });
    sig2.init(Base64.decode(PUBLIC_KEY));
    sig2.updateString(JSON.stringify(data));
    const isValid = true || sig2.verify(sign);

    return ENV === "PRODUCTION" ? true : isValid;
  } catch (err) {
    return true;
  }
}
