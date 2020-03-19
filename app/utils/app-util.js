// TODO(sb): RN update dependencies fixes
// import * as Font from "expo-font";
// import { Asset } from "expo-asset";
import React from "react";
import { Image } from "react-native";
import NetInfo from "@react-native-community/netinfo";
import twitter from "react-native-simple-twitter";
import CodePush from "react-native-code-push";
import jwtDecode from "jwt-decode";
import moment from "moment";

import appsFlyerUtil from "./appsflyer-util";
import Constants from "../../constants";
import {
  deleteSecureStoreKey,
  getSecureStoreKey,
  setSecureStoreKey,
} from "./expo-storage";
import baseUrl from "../services/api-url";
import store from "../redux/store";
import * as actions from "../redux/actions";
import apiUtil from "./api-util";
import { initMixpanel } from "./mixpanel-util";

const {
  SECURITY_STORAGE_AUTH_KEY,
  TWITTER_CUSTOMER_KEY,
  TWITTER_SECRET_KEY,
} = Constants;

export default {
  initializeThirdPartyServices,
  logoutOnEnvChange,
  initInternetConnectivityListener,
  pollBackendStatus,
  cacheImages,
  // cacheFonts,
  recursiveMap,
  getRevisionId,
};

/**
 * Initializes all third party services used in Celsius app
 */
async function initializeThirdPartyServices() {
  await store.dispatch(actions.setAppsFlyerUID());
  await store.dispatch(actions.setAdvertisingId());

  apiUtil.initInterceptors();
  twitter.setConsumerKey(TWITTER_CUSTOMER_KEY, TWITTER_SECRET_KEY);
  await appsFlyerUtil.initSDK();
  await initMixpanel();
}

/**
 * Logs the user out on environment change, helps developers
 */
async function logoutOnEnvChange() {
  const previousBaseUrl = await getSecureStoreKey("BASE_URL");
  if (previousBaseUrl !== baseUrl) {
    await deleteSecureStoreKey(SECURITY_STORAGE_AUTH_KEY);
    await setSecureStoreKey("BASE_URL", baseUrl);
  }
}

/**
 * Initializes the connectivity listener for the app
 */
function initInternetConnectivityListener() {
  NetInfo.isConnected.addEventListener("connectionChange", isConnected =>
    store.dispatch(actions.setInternetConnection(isConnected))
  );
}

/**
 * Polls status of the backend app from /status every 30s
 * @todo rename to poll data or something
 */
const POLL_INTERVAL = 30 * 1000;
let iteration = 0;
let backendPollInterval;
async function pollBackendStatus() {
  if (backendPollInterval) clearInterval(backendPollInterval);

  await store.dispatch(actions.getBackendStatus());
  await store.dispatch(actions.getUserStatus());
  await checkAndRefreshAuthToken();

  backendPollInterval = setInterval(async () => {
    await store.dispatch(actions.getBackendStatus());
    await store.dispatch(actions.getUserStatus());
    await checkAndRefreshAuthToken();

    iteration++;
  }, POLL_INTERVAL);
}

/**
 * Check if auth token is about too expire and refresh it from BE
 * Check every 15min, or every 30 poll iterations
 */
async function checkAndRefreshAuthToken() {
  if (iteration % 30 !== 0) return;

  const EXPIRES_IN_HOURS = 24;
  const storageToken = await getSecureStoreKey(SECURITY_STORAGE_AUTH_KEY);
  if (!storageToken) return;

  const decodedToken = jwtDecode(storageToken);
  const expirationDate = decodedToken.exp
    ? new Date(decodedToken.exp * 1000)
    : new Date();
  const isAboutToExpire = moment()
    .add(EXPIRES_IN_HOURS, "hours")
    .isAfter(moment(expirationDate));

  if (isAboutToExpire) {
    await store.dispatch(actions.refreshAuthToken());
  }
}

/**
 * Caches app images
 *
 * @param {Array} images
 * @returns {Array} - array of promises
 */
// For images that saved to the local file system,
// use Expo.Asset.fromModule(image).downloadAsync()
// to download and cache the image.
// There is also a loadAsync() helper method to cache a batch of assets.
// For web images, use Image.prefetch(image).
// Continue referencing the image normally,
// e.g. with <Image source={require('path/to/image.png')} />
async function cacheImages(images) {
  for (let i = 0; i < images.length; i++) {
    if (typeof image === "string") {
      await Image.prefetch(images[i]);
    } else {
      // await Asset.fromModule(images[i]).downloadAsync();
    }
  }
}

/**
 * Verifies the data with signature key from the server
 *
 * @param {Array} fonts - data from server response
 * @returns {Array} - array of promises
 */
// Fonts are preloaded using Expo.Font.loadAsync(font).
// async function cacheFonts(fonts) {
// for (let i = 0; i < fonts.length; i++) {
//   await Font.loadAsync(fonts[i]);
// }
// }

/**
 * Change all nested react elemnets through fn()
 *
 * @param {Array} children - array of react children elements
 * @param {Function} fn - function that will change all nested elements
 * @returns {Array} - array of react childrens changed through fn()
 */
function recursiveMap(children, fn) {
  return React.Children.map(children, child => {
    if (!React.isValidElement(child)) {
      return child;
    }

    let newChild = child;

    if (child.props.children) {
      newChild = React.cloneElement(child, {
        children: recursiveMap(child.props.children, fn),
      });
    }

    return fn(newChild);
  });
}

let metadata;

/**
 * Get the current app verision from CodePush
 */
async function getRevisionId() {
  if (!metadata) {
    metadata = await CodePush.getUpdateMetadata();
  }

  if (!metadata) {
    return {
      codePushVersion: {},
      revisionId: "local",
    };
  }

  const codePushVersion = {
    label: metadata.label,
    version: metadata.appVersion,
    description: metadata.description,
  };

  return {
    codePushVersion,
    revisionId: `${codePushVersion.version}@${codePushVersion.label}`,
  };
}
