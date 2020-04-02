import { NavigationActions, StackActions } from "react-navigation";
import ACTIONS from "../../constants/ACTIONS";
import userBehavior from "../../utils/mixpanel-analytics";

let _navigator;

export {
  navigateTo,
  navigateBack,
  setTopLevelNavigator,
  setActiveScreen,
  resetToScreen,
};

/**
 * TODO add JSDoc
 */
function setActiveScreen(screenName) {
  return dispatch => {
    dispatch({ type: ACTIONS.SET_ACTIVE_SCREEN, payload: { screenName } });
  };
}

/**
 * Sets _navigator
 * @param {Object} navigatorRef
 */
function setTopLevelNavigator(navigatorRef) {
  _navigator = navigatorRef;
}

/**
 * Navigates to a screen
 * @param {string} routeName - name of the screen
 * @param {Object} params - parameters for the next screen
 */
function navigateTo(routeName, params) {
  return () => {
    _navigator.dispatch(
      NavigationActions.navigate({
        routeName,
        params,
      })
    );
    userBehavior.navigated(routeName);
  };
}

/**
 * Navigates back
 */
function navigateBack(backScreenName) {
  return () => {
    if (backScreenName === "VerifyProfile") {
      // If back button leads to VerifyProfile, skip it and go back one more screen
      userBehavior.navigated("Back");
      _navigator.dispatch(StackActions.pop({ n: 2 }));
    } else {
      _navigator.dispatch(NavigationActions.back());
    }

    userBehavior.navigated(backScreenName);
  };
}

/**
 * Resets stack, index = 0
 *
 * @param flow
 * @param params
 * @returns {Function}
 */

function resetToScreen(screenName, params) {
  userBehavior.navigated(screenName);
  return () => {
    _navigator.dispatch(
      StackActions.reset({
        index: 0,
        key: null,
        actions: [
          NavigationActions.navigate({ routeName: screenName, params }),
        ],
      })
    );
  };
}
