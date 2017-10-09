const uuidLib = require('uuid');

const noop = () => {};

/**
 * Check the parameters given are good enough to make api calls
 * @function
 * @param  {Object} options              options
 * @param  {string} options.appKey       the application key
 * @param  {string} [options.deviceId]   a deviceId identifying the client we will make requests for
 * @param  {string} [options.sessionKey] a session key corresponding to this deviceId/appKey tuple
 * @return {boolean}                 true when all is well
 * @private
 */
const checkUsability = ({ appKey, deviceId, sessionKey } = {}) =>
  (appKey && !deviceId && !sessionKey) || (appKey && deviceId);

// Refer to `./index` for the doc
const appgrid = stamp => config => {
  const { gid, appKey, ip, target } = config;
  const {
    log = noop,
    onDeviceIdGenerated = noop,
    onSessionKeyChanged = noop,
  } = config;
  let { deviceId, sessionKey } = config;
  // If there is no deviceId, do not allow reusing a sessionKey
  if (!deviceId) {
    sessionKey = null;
  }
  // Check the params are OK
  if (!checkUsability({ appKey, deviceId, sessionKey })) {
    throw new Error(
      'You must provide an appKey | an appKey and a deviceId | an appKey, a deviceId and a sessionKey'
    );
  }
  // Generate a uuid if no deviceId was given
  if (!deviceId) {
    deviceId = uuidLib.v4();
    // trigger the callback
    onDeviceIdGenerated(deviceId);
  }

  const stampConfig = {
    deviceId,
    gid,
    ip,
    appKey,
    target,
    log,
    onSessionKeyChanged,
  };
  Object.defineProperty(stampConfig, 'sessionKey', {
    set(val) {
      sessionKey = val;
      onSessionKeyChanged(val);
    },
    get() {
      return sessionKey;
    },
  });

  return stamp({
    props: { config: stampConfig },
  });
};

module.exports = appgrid;
