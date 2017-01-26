import uuidLib from 'uuid';
import stamp from './stamps/appgridClient';

const noop = () => {};

const hasLocalStorage = (typeof localStorage !== 'undefined');
const hasSessionStorage = (typeof sessionStorage !== 'undefined');
const hasSomeWebStorage = hasLocalStorage || hasSessionStorage;

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
  // Take deviceId from localStorage
  const deviceId = localStorage[WEBSTORAGE_DEVICE_ID];

  // Take sessionKey from sessionStorage
  const sessionKey = (hasSessionStorage) ? sessionStorage[WEBSTORAGE_SESSION_KEY] : undefined;

  return { deviceId, sessionKey };
};

const defaultBrowserOnDeviceIdGenerated = (id) => {
  if (!hasLocalStorage) { return; }

  localStorage[WEBSTORAGE_DEVICE_ID] = id;
};

const defaultBrowserOnSessionKeyChanged = (key) => {
  if (!hasSessionStorage) { return; }

  sessionStorage[WEBSTORAGE_SESSION_KEY] = key;
};

/**
 * A wrapper over the appgrid factory for clients that support Web Storage by default
 * (most browsers). Provides default `onDeviceIdGenerated` and `onSessionKeyChanged` callbacks for
 * persistency through Web Storage. Also sets the `deviceId` and `sessionKey` values from
 * Web Storage to the factory when not given as an option.
 *
 * This behaviour can be customised by providing a `browserInfoProvider` function returning an
 * object with the keys `deviceId` and `sessionKey`. You could implement a different strategy
 * relying on cookies or a device-specific API for instance.
 *
 * If you do, you will want to customise the `onSessionKeyChanged` and `onDeviceIdGenerated`
 * callbacks as well.
 *
 * Refer to the factory's documentation to see other available options.
 *
 * Note this is this library's default export for Web Storage-enabled devices.
 *
 * @function
 * @param  {object} config the configuration for the new instance
 * @param  {string} config.browserInfoProvider A function to customise the persistency strategy
 * @param  {any} [config.appKey/log/gid/etc] You should also pass any extra option accepted by the appgrid factory function (appKey, log, gid, ...)
 * @return {client}        an AppGrid client tied to the given params
 */
const appgridWrapperForBrowsers = (config) => {
  if (!hasSomeWebStorage) {
    return appgrid(config);
  }

  const {
    browserInfoProvider = defaultBrowserInfoProvider,
    onDeviceIdGenerated = defaultBrowserOnDeviceIdGenerated,
    onSessionKeyChanged = defaultBrowserOnSessionKeyChanged
  } = config;
  let { deviceId, sessionKey } = config;

  if ((!deviceId || !sessionKey) && browserInfoProvider) {
    const browserInfo = browserInfoProvider();
    deviceId = deviceId || browserInfo.deviceId;
    sessionKey = sessionKey || browserInfo.sessionKey;
  }

  return appgrid(Object.assign({}, config, { deviceId, sessionKey, onDeviceIdGenerated, onSessionKeyChanged }));
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

export default hasSomeWebStorage ? appgridWrapperForBrowsers : appgrid;
