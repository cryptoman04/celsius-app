// TODO(fj): block console.logs in lint and use this throughout the app

import axios from "axios/index";
import { Constants } from "expo";

const { ENV } = Constants.manifest.extra;

export default {
  logme,
  log,
  warn,
  info,
}

function log(content) {
  if (['STAGING', 'PREPROD', 'DEVELOPMENT'].indexOf(ENV) !== -1) console.log(content)
}

function info(content) {
  if (['STAGING', 'PREPROD', 'DEVELOPMENT'].indexOf(ENV) !== -1) console.info(content)
}

function warn(content) {
  if (['STAGING', 'PREPROD', 'DEVELOPMENT'].indexOf(ENV) !== -1) console.warn(content)
}

function logme(payload) {
  axios.post('https://api.staging.celsius.network/api/v1/logme', payload);
}