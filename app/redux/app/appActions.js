import { Platform } from "react-native";
import { IDFA } from "react-native-idfa";
import appsFlyer from "react-native-appsflyer";
import Geolocation from "@react-native-community/geolocation";
import { RESULTS } from "react-native-permissions";

import Constants from "../../../constants";
import store from "../../redux/store";
import * as actions from "../actions";
import {
  getSecureStoreKey,
  deleteSecureStoreKey,
} from "../../utils/expo-storage";
import { BRANCH_LINKS, TRANSFER_STATUSES } from "../../constants/DATA";
import ACTIONS from "../../constants/ACTIONS";
import { registerForPushNotificationsAsync } from "../../utils/push-notifications-util";
import appUtil from "../../utils/app-util";
import branchUtil from "../../utils/branch-util";
import { disableAccessibilityFontScaling } from "../../utils/styles-util";
import ASSETS from "../../constants/ASSETS";
import loggerUtil from "../../utils/logger-util";
import {
  requestForPermission,
  ALL_PERMISSIONS,
} from "../../utils/device-permissions";
import { hasPassedKYC } from "../../utils/user-util";
import { showMessage } from "../ui/uiActions";
import mixpanelAnalytics from "../../utils/mixpanel-analytics";

const { SECURITY_STORAGE_AUTH_KEY } = Constants;

export {
  initCelsiusApp,
  loadCelsiusAssets,
  initAppData,
  resetCelsiusApp,
  handleAppStateChange,
  setInternetConnection,
  getGeolocation,
  showVerifyScreen,
  setAdvertisingId,
  setAppsFlyerUID,
};

/**
 * Initializes Celsius Application
 */
let timeout;

function initCelsiusApp() {
  return async (dispatch, getState) => {
    if (getState().app.appInitializing) return;

    try {
      dispatch({ type: ACTIONS.APP_INIT_START });

      timeout = setTimeout(() => {
        dispatch(
          showMessage(
            "info",
            "Hmm… this is taking a bit longer than usual. If your app doesn’t load shortly, try restarting or checking back in a few minutes."
          )
        );
        clearTimeout(timeout);
      }, 30000);
      await appUtil.logoutOnEnvChange();

      disableAccessibilityFontScaling();
      dispatch(getGeolocation());

      await appUtil.initInternetConnectivityListener();
      await appUtil.pollBackendStatus();

      await dispatch(initAppData());

      await dispatch(branchUtil.initBranch());

      dispatch({ type: ACTIONS.APP_INIT_DONE });
      clearTimeout(timeout);
    } catch (e) {
      clearTimeout(timeout);
      loggerUtil.err(e);
    }
  };
}

/**
 * Resets Celsius Application
 */
function resetCelsiusApp() {
  return async dispatch => {
    try {
      // Logout user
      await deleteSecureStoreKey(SECURITY_STORAGE_AUTH_KEY);
      dispatch({ type: ACTIONS.RESET_APP });
      // Dev warning message
      dispatch(actions.showMessage("warning", "Reseting Celsius App!"));

      await dispatch(initCelsiusApp());
    } catch (e) {
      loggerUtil.err(e);
    }
  };
}

/**
 * Loads all Celsius App assets from ASSETS.js
 */
function loadCelsiusAssets() {
  return async dispatch => {
    dispatch({ type: ACTIONS.START_LOADING_ASSETS });

    // await appUtil.cacheFonts(ASSETS.FONTS);
    await appUtil.cacheImages(ASSETS.CACHE_IMAGES);

    dispatch({ type: ACTIONS.FINISH_LOADING_ASSETS });
  };
}

const onInstallConversionDataCanceller = appsFlyer.onInstallConversionData(
  data => {
    loggerUtil.log(data);
  }
);

const onAppOpenAttributionCanceller = appsFlyer.onAppOpenAttribution(res => {
  const { data } = res;
  switch (data.type) {
    case BRANCH_LINKS.NAVIGATE_TO:
      store.dispatch(actions.navigateTo(data.screen));
      break;
    default:
      break;
  }
});

/**
 * Handles state change of the app
 * @param {string} nextAppState - one of active|inactive|background
 */
const ASK_FOR_PIN_AFTER = 30 * 60 * 100;
let pinTimeout;
let startOfBackgroundTimer;

function handleAppStateChange(nextAppState) {
  return dispatch => {
    const { profile } = store.getState().user;
    const { appState } = store.getState().app;
    const { activeScreen } = store.getState().nav;

    if (Platform.OS === "ios") {
      if (appState.match(/inactive|background/) && nextAppState === "active") {
        appsFlyer.trackAppLaunch();
      }
    }

    // if (nextAppState.match(/inactive|background/) && profile && profile.has_pin && appState === "active") {
    if (nextAppState.match(/inactive|background/) && appState === "active") {
      // ONLY FOR DEBUG PURPOSE
      if (onInstallConversionDataCanceller) {
        onInstallConversionDataCanceller();
        loggerUtil.log("unregister onInstallConversionDataCanceller");
      }
      if (onAppOpenAttributionCanceller) {
        onAppOpenAttributionCanceller();
        loggerUtil.log("unregister onAppOpenAttributionCanceller");
      }
    }

    if (profile && profile.has_pin) {
      if (nextAppState === "active") {
        dispatch(actions.getLoyaltyInfo());
        dispatch(actions.getInitialCelsiusData());
        dispatch(actions.getCurrencyRates());

        if (Platform.OS === "ios") {
          clearTimeout(pinTimeout);
        }

        if (
          Platform.OS === "android" &&
          new Date().getTime() - startOfBackgroundTimer > ASK_FOR_PIN_AFTER
        ) {
          startOfBackgroundTimer = null;
          dispatch(
            actions.navigateTo("VerifyProfile", {
              activeScreen,
              showLogOutBtn: true,
            })
          );
        }
        mixpanelAnalytics.sessionStarted("Foreground");
        // Fix for CN-4253, CN-4235, CN-4205
        // dispatch(getGeolocation());
      }

      if (
        nextAppState.match(/inactive|background/) &&
        profile &&
        profile.has_pin &&
        appState === "active"
      ) {
        if (Platform.OS === "ios") {
          pinTimeout = setTimeout(() => {
            dispatch(
              actions.navigateTo("VerifyProfile", {
                activeScreen,
                showLogOutBtn: true,
              })
            );
            clearTimeout(pinTimeout);
          }, ASK_FOR_PIN_AFTER);
        }

        if (Platform.OS === "android") {
          startOfBackgroundTimer = new Date().getTime();
        }

        mixpanelAnalytics.sessionEnded("Background");
      }
    }

    dispatch({
      type: ACTIONS.SET_APP_STATE,
      appState: nextAppState,
    });
  };
}

/**
 * Sets internet connection in the reducer
 * @param {boolean} connection
 */
function setInternetConnection(connection) {
  return {
    type: ACTIONS.SET_INTERNET_CONNECTION,
    internetConnected: connection,
  };
}

/**
 * Initialize all data needed for the App
 */
function initAppData(initToken = null) {
  return async (dispatch, getState) => {
    // get general data for te app
    await dispatch(actions.getCurrencyRates());
    await dispatch(actions.getCurrencyGraphs());
    await dispatch(actions.getInitialCelsiusData());
    await dispatch(actions.setBannerProps());

    // get user token
    const token =
      initToken || (await getSecureStoreKey(SECURITY_STORAGE_AUTH_KEY));

    // fetch user
    if (token) await dispatch(actions.getProfileInfo());

    // get expired session
    const { expiredSession } = getState().user;

    if (token && !expiredSession) {
      mixpanelAnalytics.sessionStarted("Init app");
      registerForPushNotificationsAsync();
      dispatch(actions.claimAllBranchTransfers());

      // get all KYC document types and claimed transfers for non-verified users
      const { profile } = getState().user;
      const { bannerProps } = getState().ui;
      if (profile) {
        await dispatch(actions.getUserAppSettings());
        await dispatch(actions.getComplianceInfo());
        await dispatch(
          actions.setBannerProps({ sessionCount: bannerProps.sessionCount + 1 })
        );

        if (!profile.kyc || (profile.kyc && !hasPassedKYC())) {
          await dispatch(actions.getAllTransfers(TRANSFER_STATUSES.claimed));
        }

        const { allowed } = getState().compliance.loan;
        // get wallet details for verified users
        if (profile.kyc && hasPassedKYC()) {
          await dispatch(actions.getWalletSummary());
          await dispatch(actions.getLoyaltyInfo());
          await dispatch(actions.getCoinAddress("LTC"));
          if (allowed) await dispatch(actions.getAllLoans());
        }
      }
    } else if (token) {
      // logout if expired session or no token
      await dispatch(actions.logoutUser());
    }
  };
}

/**
 * Handle show verify screen on status code 426
 */
function showVerifyScreen(defaultVerifyState = true) {
  return async dispatch => {
    // if (getState().app.showVerifyScreen === defaultVerifyState) return;
    dispatch({
      type: ACTIONS.SHOW_VERIFY_SCREEN,
      showVerifyScreen: defaultVerifyState,
    });
  };
}

/**
 * Set advertising id for Apps Flyer
 */
function setAdvertisingId() {
  return async dispatch => {
    let userAID;
    if (Platform.OS === "ios") {
      const res = await IDFA.getIDFA();
      userAID = res;
    } else {
      // const res = await RNAdvertisingId.getAdvertisingId();
      // userAID = res.advertisingId;
    }
    dispatch({
      type: ACTIONS.SET_ADVERTISING_ID,
      advertisingId: userAID,
    });
  };
}

/**
 * Set Apps Flyer device UID
 */
function setAppsFlyerUID() {
  return dispatch => {
    appsFlyer.getAppsFlyerUID((error, appsFlyerUid) => {
      if (!error) {
        dispatch({
          type: ACTIONS.SET_DEVICE_APPSFLYER_UID,
          appsFlyerUID: appsFlyerUid,
        });
      }
    });
  };
}

/**
 * Gets geolocation for device
 */
function getGeolocation() {
  return async dispatch => {
    const permission = await requestForPermission(ALL_PERMISSIONS.LOCATION);

    if (permission !== RESULTS.GRANTED) return;

    Geolocation.getCurrentPosition(location => {
      if (location && location.coords) {
        dispatch({
          type: ACTIONS.SET_GEOLOCATION,
          geoLat: location.coords.latitude,
          geoLong: location.coords.longitude,
        });
      }
    });
  };
}
