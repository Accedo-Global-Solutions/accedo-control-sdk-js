import uuidLib from 'uuid';
import stamp from './stamps/appgridClient';

/**
 * Globally available (use `import { getCurrentTimeOfDayDimValue } from 'appgrid'`)
 * Returns the range of the current hour of the day, as a string such as '01-05' for 1am to 5 am.
 * Useful for AppGrid log events.
 * @function
 * @return {string} a range of hours
 */
export { getCurrentTimeOfDayDimValue } from './stamps/appLog';

const noop = () => {};

/**
 * Globally available (use `import { generateUuid } from 'appgrid'`)
 * Generate a UUID.
 * Use this for a device/appKey tuple when you do not have a sessionKey already.
 * @function
 * @return {string} a new UUID
 */
export const generateUuid = () => uuidLib.v4();

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
 * You must get an instance before accessing any of the exposed client APIs.
 * @function
 * @param  {object} config the configuration for the new instance
 * @param  {string} config.appKey the application Key
 * @param  {string} [config.deviceId] the device identifier (if not provided, a uuid will be generated instead)
 * @param  {string} [config.sessionKey] the sessionKey (note a new one may be created when not given or expired)
 * @param  {string} [config.log] a function to use to see this SDK's logs
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
const factory = (config) => {
  const { gid, appKey, sessionKey, log = noop } = config;
  let { deviceId } = config;
  // First, check the params are OK
  if (!checkUsability(config)) {
    throw new Error('You must provide an appKey | an appKey and a deviceId | an appKey, a deviceId and a sessionKey');
  }
  // Generate a uuid if no deviceId was given
  if (!deviceId) {
    deviceId = generateUuid();
  }

  return stamp({
    props: { config: { deviceId, gid, appKey, sessionKey, log } }
  });
};

export default factory;
