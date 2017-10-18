const makeAccedoOne = require('../node/client');

let hasLocalStorage = false;
let hasSessionStorage = false;
try {
  hasLocalStorage = typeof localStorage !== 'undefined';
  hasSessionStorage = typeof sessionStorage !== 'undefined';
} catch (err) {
  // Probably Safari 11 with 'website data' set to 'always blocked'
}
const hasSomeWebStorage = hasLocalStorage || hasSessionStorage;

const WEBSTORAGE_DEVICE_ID = 'ag_d';
const WEBSTORAGE_SESSION_KEY = 'ag_s';

/**
 * Default implementation for the browserInfoProvider option (applied to browsers only).
 * This will persist deviceId in localStorage and sessionKey in sessionStorage.
 *
 * @private
 * @return {Object} An object with both deviceId and sessionKey
 */
const defaultBrowserInfoProvider = () => {
  // try-catch in case of an exotic device that would crash on webstorage access
  try {
    // Take deviceId from localStorage
    const deviceId = localStorage[WEBSTORAGE_DEVICE_ID];

    // Take sessionKey from sessionStorage
    const sessionKey = hasSessionStorage
      ? sessionStorage[WEBSTORAGE_SESSION_KEY]
      : undefined;

    return { deviceId, sessionKey };
  } catch (error) {
    return {};
  }
};

const defaultBrowserOnDeviceIdGenerated = id => {
  if (!hasLocalStorage) {
    return;
  }
  // https://github.com/Accedo-Products/accedo-one-sdk-js/issues/7
  try {
    localStorage[WEBSTORAGE_DEVICE_ID] = id;
  } catch (error) {
    // nothing we can do on private mode or lack of storage space
  }
};

const defaultBrowserOnSessionKeyChanged = key => {
  if (!hasSessionStorage) {
    return;
  }
  // https://github.com/Accedo-Products/accedo-one-sdk-js/issues/7
  try {
    sessionStorage[WEBSTORAGE_SESSION_KEY] = key;
  } catch (error) {
    // nothing we can do on private mode or lack of storage space
  }
};

// Refer to `./index` for the doc
const makeAccedoOneWrapper = stamp => config => {
  const accedoOne = makeAccedoOne(stamp);
  if (!hasSomeWebStorage) {
    return accedoOne(config);
  }

  const {
    browserInfoProvider = defaultBrowserInfoProvider,
    onDeviceIdGenerated = defaultBrowserOnDeviceIdGenerated,
    onSessionKeyChanged = defaultBrowserOnSessionKeyChanged,
  } = config;
  let { deviceId, sessionKey } = config;

  if ((!deviceId || !sessionKey) && browserInfoProvider) {
    const browserInfo = browserInfoProvider();
    deviceId = deviceId || browserInfo.deviceId;
    sessionKey = sessionKey || browserInfo.sessionKey;
  }

  return accedoOne(
    Object.assign({}, config, {
      deviceId,
      sessionKey,
      onDeviceIdGenerated,
      onSessionKeyChanged,
    })
  );
};

module.exports = makeAccedoOneWrapper;
