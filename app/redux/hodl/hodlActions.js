// import ACTIONS from "../../constants/ACTIONS";
import { apiError, startApiCall } from "../api/apiActions";
import API from "../../constants/API";
import hodlService from "../../services/hodl-service";
import { navigateTo } from "../nav/navActions";
import { showMessage } from "../ui/uiActions";
import ACTIONS from "../../constants/ACTIONS";

export { getHodlCode, activateHodlMode, deactivateHodlMode };

/**
 * act of intention to star hodl mode
 */

function getHodlCode() {
  return async (dispatch, getState) => {
    dispatch(startApiCall(API.GET_HODL_CODE));

    const { formData } = getState().forms;

    try {
      const verification = {
        pin: formData.pin,
        twoFactorCode: formData.code,
      };
      const result = await hodlService.getHodlCode(verification);

      dispatch(navigateTo("HODLViewCode"));

      dispatch({
        type: ACTIONS.GET_HODL_CODE_SUCCESS,
        hodlCode: result.data,
      });
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.GET_HODL_CODE, err));
    }
  };
}

/**
 * activation of hodlMode
 */

function activateHodlMode() {
  return async (dispatch, getState) => {
    dispatch(startApiCall(API.ACTIVATE_HODL_MODE));

    const { formData } = getState().forms;

    try {
      const verification = {
        pin: formData.pin,
        twoFactorCode: formData.code,
      };
      const response = await hodlService.activateHodlMode(verification);
      dispatch({ type: ACTIONS.ACTIVATE_HODL_MODE_SUCCESS });
      if (response.data.ok) {
        return {
          success: true,
        };
      }
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.ACTIVATE_HODL_MODE, err));
    }
  };
}

/**
 * hodl mode deactivation
 */

function deactivateHodlMode() {
  return async (dispatch, getState) => {
    dispatch(startApiCall(API.DEACTIVATE_HODL_MODE));

    const { formData } = getState().forms;

    try {
      const verification = {
        pin: formData.pin,
        twoFactorCode: formData.code,
        code: formData.hodlCode,
      };

      const response = await hodlService.deactivateHodlMode(verification);
      dispatch({ type: ACTIONS.DEACTIVATE_HODL_MODE_SUCCESS });
      if (response.data.ok) {
        return {
          success: true,
        };
      }
    } catch (err) {
      dispatch(showMessage("error", err.msg));
      dispatch(apiError(API.DEACTIVATE_HODL_MODE, err));
    }
  };
}
