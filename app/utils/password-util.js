import { PasswordMeter } from "password-meter";
import store from "../redux/store";
import {
  SECURITY_STRENGTH_ITEMS,
  SECURITY_STRENGTH_LEVEL,
} from "../constants/DATA";

/**
 * @typedef {Object} UserData - user's first name, last name and optional middle name.
 * @property {string} firstName - user's first name
 * @property {string|undefined} middleName - user's middle name
 * @property {string} lastName - user's last name
 */
/**
 * Calculates password score based on cleartext and users first, middle and last name.
 *
 * @param {string} password
 * @param {UserData} userData
 * @return {Object}
 */

const calculatePasswordScore = () => {
  const { formData } = store.getState().forms;

  const excludes = [formData.firstName, formData.lastName, formData.email, " "];
  if (formData.middleName) {
    excludes.push(formData.middleName);
  }
  const pm = new PasswordMeter({
    minLength: {
      value: 8,
      message: SECURITY_STRENGTH_ITEMS[0].copy,
    },
    uppercaseLettersMinLength: {
      value: 1,
      message: SECURITY_STRENGTH_ITEMS[1].copy,
    },
    lowercaseLettersMinLength: 2,
    numbersMinLength: {
      value: 1,
      message: SECURITY_STRENGTH_ITEMS[2].copy,
    },
    symbolsMinLength: {
      value: 1,
      message: SECURITY_STRENGTH_ITEMS[3].copy,
    },
    exclude: {
      value: excludes,
      message: SECURITY_STRENGTH_ITEMS[4].copy,
    },
  });
  const result = pm.getResult(formData.password || formData.newPassword);
  let customStatus;
  switch (true) {
    case result.score < 80:
      customStatus = SECURITY_STRENGTH_LEVEL.WEAK;
      break;
    case result.score < 140:
      customStatus = SECURITY_STRENGTH_LEVEL.FAIR;
      break;
    case result.score < 200:
      customStatus = SECURITY_STRENGTH_LEVEL.GOOD;
      break;
    default:
      customStatus = SECURITY_STRENGTH_LEVEL.STRONG;
  }

  if (!result.errors) {
    result.errors = [];
  }
  return {
    result,
    customStatus,
  };
};

export default calculatePasswordScore;
