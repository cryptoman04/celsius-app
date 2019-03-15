// TODO(fj): remove clear storage. it doesn't work :)

import * as Expo from 'expo'

export {
  setSecureStoreKey,
  getSecureStoreKey,
  deleteSecureStoreKey,
  clearSecureStorage,
};

/**
 * @name setSecureStoreKey
 * @param key {string}
 * @param value {string}
 * @description Store a key–value pair.
 * The key to associate with the stored value. Keys may contain alphanumeric characters ., -, and _.
 *
 * @return A promise that will reject if value cannot be stored on the device
 * */
async function setSecureStoreKey(key, value) {
  try {
    return await Expo.SecureStore.setItemAsync(key, value)
  } catch (error) {

    return null;
  }
}

/**
 * @name getSecureStoreKey
 * @param key {string}
 * @description Fetch the stored value associated with the provided key.
 *
 * @return A promise that resolves to the previously stored value, or null if there is no entry for the given key.
 * The promise will reject if an error occurred while retrieving the value.
 * */
async function getSecureStoreKey(key) {
  try {
    return await Expo.SecureStore.getItemAsync(key);
  } catch (error) {

    return null;
  }
}

/**
 * @name deleteSecureStoreKey
 * @param key {string}
 * @description Delete the value associated with the provided key.
 *
 * @return A promise that will reject if the value couldn’t be deleted.
 * */
async function deleteSecureStoreKey(key) {
  try {
    return await Expo.SecureStore.deleteItemAsync(key);
  } catch (error) {

    return null;
  }
}

/**
 * @name clear
 * @description Delete the value associated with the provided key.
 *
 * @return A promise that will reject if the value couldn’t be deleted.
 * */
async function clearSecureStorage() {
  try {
    return await Expo.SecureStore.clear();
  } catch (error) {

    return null;
  }
}

