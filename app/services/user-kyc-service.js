import axios from "axios";
import apiUrl from "./api-url";

const userKYCService = {
  getKYCDocTypes,
  getUtilityBill,
  setUtilityBill,
  getPrimeTrustToULink,
  updateProfileAddressInfo,
  getProfileTaxpayerInfo,
  updateProfileTaxpayerInfo,
  startKYC,
  createKYCDocuments,
  getKYCDocuments,
  pollKYCStatus,
};

/**
 * Gets documents that Onfido supports for all countries
 *
 * @returns {Promise}
 */
function getKYCDocTypes() {
  return axios.get(`${apiUrl}/kyc/countries`);
}

/**
 * Gets Utility bill image
 *
 * @returns {Promise}
 */
function getUtilityBill() {
  return axios.get(`${apiUrl}/me/documents/utility_bill`);
}

/**
 * Sets utility bill image
 *
 * @param {Object} utilityBill
 * @returns {Promise}
 */
function setUtilityBill(utilityBill) {
  const formData = new FormData();
  formData.append("utility_bill_image", {
    name: "utility_bill_image.jpg",
    type: "image/jpg",
    uri: utilityBill.uri,
  });
  return axios.put(`${apiUrl}/user/profile/documents/utility_bill`, formData);
}

/**
 * Gets Link for Primetrust KYC ToU
 *
 * @returns {Promise}
 */
function getPrimeTrustToULink() {
  return axios.get(`${apiUrl}/kyc/primetrust/custodial_agreement_preview`);
}

/**
 * Updates address info for user
 * @see https://documenter.getpostman.com/view/4207695/RW1aHzQg#55dd21a1-2e99-4c6d-865c-a605eaef5b57
 *
 * @param {Object} profileAddressInfo
 * @param {string} profileAddressInfo.country - eg. "Serbia"
 * @param {string} profileAddressInfo.state - US state
 * @param {string} profileAddressInfo.city - eg. "Beograd"
 * @param {string} profileAddressInfo.zip - eg. "11FG0"
 * @param {string} profileAddressInfo.street
 * @param {string} profileAddressInfo.building_number - eg. "456b"
 * @param {string} profileAddressInfo.flat_number
 * @return {Promise}
 */
function updateProfileAddressInfo(profileAddressInfo) {
  return axios.post(`${apiUrl}/me/address`, profileAddressInfo);
}

/**
 * Gets taxpayer info for user
 * @see https://documenter.getpostman.com/view/4207695/RW1aHzQg#46f917e4-9e14-4531-bebd-a11ccf9e1fc2
 *
 * @return {Promise}
 */
function getProfileTaxpayerInfo() {
  return axios.get(`${apiUrl}/me/taxpayer_info`);
}

/**
 * Updates taxpayer info for user
 * @see https://documenter.getpostman.com/view/4207695/RW1aHzQg#ce921baa-1d5e-4cca-986c-ed1bcfb393ff
 *
 * @param {Object} profileTaxpayerInfo
 * @param {string} profileTaxpayerInfo.ssn
 * @param {string} profileTaxpayerInfo.itin
 * @param {string} profileTaxpayerInfo.national_id
 * @return {Promise}
 */
function updateProfileTaxpayerInfo(profileTaxpayerInfo) {
  return axios.post(`${apiUrl}/me/taxpayer_info`, profileTaxpayerInfo);
}

/**
 * Start the KYC process on Onfido for user
 * @see https://documenter.getpostman.com/view/4207695/RW1aHzQg#0846a0d3-ae4f-4ee6-a6c0-fa38230b2f1c
 *
 * @returns {Promise}
 */
function startKYC() {
  return axios.post(`${apiUrl}/me/kyc/start`);
}

/**
 * Creates KYC documents for user
 * @see https://documenter.getpostman.com/view/4207695/RW1aHzQg#10e4b34c-ebc6-4b0f-a0d0-c2fcf97d74c4
 *
 * @returns {Promise}
 */
function createKYCDocuments(documents) {
  const formData = new FormData();
  formData.append("document_front_image", {
    name: "front.jpg",
    type: "image/jpg",
    uri: documents.front.uri,
  });
  if (documents.back) {
    formData.append("document_back_image", {
      name: "back.jpg",
      type: "image/jpg",
      uri: documents.back.uri,
    });
  }
  formData.append("type", documents.type);
  return axios.put(`${apiUrl}/user/profile/documents`, formData);
}

/**
 * Gets kyc documents for user
 * @see https://documenter.getpostman.com/view/4207695/RW1aHzQg#9dfb9269-c3af-4723-8ec9-f62b380b3892
 *
 * @returns {Promise}
 */
function getKYCDocuments() {
  return axios.get(`${apiUrl}/me/documents`);
}

// Docs: https://documenter.getpostman.com/view/4207695/celsius/RW1aHzQg#10e4b34c-ebc6-4b0f-a0d0-c2fcf97d74c4

/**
 * Gets KYC status for user
 * @see https://documenter.getpostman.com/view/4207695/RW1aHzQg#f346333f-db08-4e97-ab03-df9410b03809
 *
 * @returns {Promise}
 */
function pollKYCStatus() {
  return axios.get(`${apiUrl}/me/poll`);
}

// Docs: https://documenter.getpostman.com/view/4207695/celsius/RW1aHzQg#9dfb9269-c3af-4723-8ec9-f62b380b3892

export default userKYCService;
