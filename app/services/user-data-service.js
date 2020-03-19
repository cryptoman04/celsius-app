import axios from "axios";
import apiUrl from "./api-url";

const userDataService = {
  getLinkedBankAccount,
  linkBankAccount,
  getCelsiusMemberStatus,
  getLoyaltyInfo,
  getUserAppSettings,
  setUserAppSettings,
  getUserStatus,
};

/**
 * Gets users bank account for loan
 * @see https://documenter.getpostman.com/view/4207695/S11RLvpb#eec4ff11-563e-48bb-82c1-0d6d3fb78ba2
 *
 * @return {Promise}
 */
function getLinkedBankAccount() {
  return axios.get(`${apiUrl}/bank/account`);
}

/**
 * Creates bank account for user
 * @see https://documenter.getpostman.com/view/4207695/S11RLvpb#230b4a7d-0055-4d51-81e9-7397fdc29278
 *
 * @param {number} bankAccountInfo
 * @param {string} bankAccountInfo.bank_name
 * @param {string} bankAccountInfo.bank_routing_number
 * @param {string} bankAccountInfo.account_type
 * @param {string} bankAccountInfo.bank_account_number
 * @param {string} bankAccountInfo.iban
 * @param {string} bankAccountInfo.swift
 * @return {Promise}
 */
function linkBankAccount(bankAccountInfo) {
  return axios.post(`${apiUrl}/bank/account`, bankAccountInfo);
}

/**
 * Get the user member status
 * @return {Promise}
 */
function getCelsiusMemberStatus() {
  return axios.post(`${apiUrl}/user/membership`);
}

/**
 * Gets Loyalty info for user
 *
 * @returns {Promise}
 */

function getLoyaltyInfo() {
  return axios.get(`${apiUrl}/user/loyalty`);
}

/**
 * Get user app setings
 * @returns {Promise}
 */
function getUserAppSettings() {
  return axios.get(`${apiUrl}/user_app_settings`);
}

function setUserAppSettings(data) {
  return axios.put(`${apiUrl}/user_app_settings`, data);
}

/**
 *  get user kyc and hodl status
 * @returns {Promise}
 */
function getUserStatus() {
  return axios.get(`${apiUrl}/me/poll`);
}

export default userDataService;
