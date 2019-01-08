// TODO(fj): check all other general data endpoints (doc types, blocked countries, graphs...)
// TODO(fj): maybe rename to global data?

import axios from 'axios';
import apiUrl from './api-url';

const generalDataService = {
  getSupportedCurrencies,
  getBackendStatus,
  getBlacklisted
};


function getSupportedCurrencies() {
  return axios.get(`${apiUrl}/currencies`);
}

function getBackendStatus() {
  return axios.get(`${apiUrl}/status`);
}

function getBlacklisted() {
  return axios.get(`${apiUrl}/countries/blacklist`)
}

export default generalDataService;
