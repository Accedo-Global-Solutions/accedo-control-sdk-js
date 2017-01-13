import uuidLib from 'uuid';
import stamp from './stamps/appgridClient';

const noop = () => {};

/**
 * Check the parameters given are good enough to make api calls
 * @function
 * @param  {string} $0.appKey        the application key
 * @param  {string} [$0.deviceId]        a deviceId identifying the client we will make requests for
 * @param  {string} [$0.sessionKey]  a session key corresponding to this deviceId/appKey tuple
 * @return {boolean}                 true when all is well
 * @private
 */
const checkUsability = ({ appKey, deviceId, sessionKey } = {}) =>
  (appKey && !deviceId && !sessionKey) ||
  (appKey && deviceId && !sessionKey) ||
  (appKey && deviceId && sessionKey);

/**
 * Factory function to create an instance of an AppGrid client.
 *
 * You must get an instance before accessing any of the exposed client APIs.
 * @function
 * @param  {object} config the configuration for the new instance
 * @param  {string} config.appKey the application Key
 * @param  {string} [config.deviceId] the device identifier (if not provided, a uuid will be generated instead)
 * @param  {string} [config.sessionKey] the sessionKey (note a new one may be created when not given or expired)
 * @param  {string} [config.ip] the user's IP, given to AppGrid for every request this client will trigger (for geolocation).
 * @param  {function} [config.log] a function to use to see this SDK's logs
 * @param  {function} [config.onDeviceIdGenerated] callback to obtain the new deviceId, if one gets generated
 * @param  {function} [config.onSessionKeyChanged] callback to obtain the sessionKey, anytime a new one gets generated
 * @return {client}        an AppGrid client tied to the given params
 * @example
 * import appgrid from 'appgrid';
 *
 * // when all info is available - use all of it !
 * const client = appgrid({ appKey: 'MY_APP_KEY', deviceId: 'DEVICE_ID', sessionKey: 'SOME_SESSION_KEY' });
 *
 * // when there is no known sessionKey yet
 * const client2 = appgrid({ appKey: 'MY_APP_KEY', deviceId: 'DEVICE_ID' });
 *
 * // when there is no known sessionKey or deviceId yet
 * const client3 = appgrid({ appKey: 'MY_APP_KEY' });
 */
const appgrid = (config) => {
  const { gid, appKey, ip, log = noop, onDeviceIdGenerated = noop, onSessionKeyChanged = noop } = config;
  let { deviceId, sessionKey } = config;
  // First, check the params are OK
  if (!checkUsability(config)) {
    throw new Error('You must provide an appKey | an appKey and a deviceId | an appKey, a deviceId and a sessionKey');
  }
  // Generate a uuid if no deviceId was given
  if (!deviceId) {
    deviceId = appgrid.generateUuid();
    // trigger the callback
    onDeviceIdGenerated(deviceId);
  }

  const stampConfig = { deviceId, gid, ip, appKey, log, onSessionKeyChanged };
  Object.defineProperty(stampConfig, 'sessionKey', {
    set(val) { sessionKey = val; onSessionKeyChanged(val); },
    get() { return sessionKey; }
  });

  return stamp({
    props: { config: stampConfig }
  });
};

/**
 * Generate a UUID.
 *
 * Use this for a device/appKey tuple when you do not have a sessionKey already.
 *
 * This utility method is not used through an appgrid client instance, but available statically
 * @function
 * @return {string} a new UUID
 */
appgrid.generateUuid = () => uuidLib.v4();

export default appgrid;
