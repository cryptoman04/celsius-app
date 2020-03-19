import axios from "axios";
import apiUrl from "./api-url";

const hodlService = {
  getHodlCode,
  activateHodlMode,
  deactivateHodlMode,
};

/**
 * initiation of hodl mode
 * @param verificationCode
 * @returns {Promise}
 */
function getHodlCode(verificationCode) {
  return axios.post(`${apiUrl}/users/hodl_mode/begin`, verificationCode);
}

/**
 *  activation of hodl mode, user receives 8 digit code
 * @param verificationCode
 * @returns {Promise}
 */
function activateHodlMode(verificationCode) {
  return axios.post(`${apiUrl}/users/hodl_mode/activate`, verificationCode);
}

/**
 * deactivation code where user sends 8 digit code he received on activation
 * @param verificationCode
 * @returns {Promise}
 */
function deactivateHodlMode(verificationCode) {
  return axios.post(`${apiUrl}/users/hodl_mode/deactivate`, verificationCode);
}

export default hodlService;
