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
 * @param  {string} [$0.uuid]        a uuid identifying the client we will make requests for
 * @param  {string} [$0.sessionKey]  a session key corresponding to this uuid/appKey tuple
 * @return {boolean}                 true when all is well
 * @private
 */
const checkUsability = ({ appKey, uuid, sessionKey } = {}) =>
  (appKey && !uuid && !sessionKey) ||
  (appKey && uuid && !sessionKey) ||
  (appKey && uuid && sessionKey);

/**
 * Factory function to create an instance of an AppGrid client.
 * You must get an instance before accessing any of the exposed client APIs.
 * @function
 * @param  {object} config the configuration for the new instance
 * @param  {string} config.appKey the application Key
 * @param  {string} [config.uuid] a unique identifier (one will be generated if not provided)
 * @param  {string} [config.sessionKey] the sessionKey (note a new one may be created when needed)
 * @param  {string} [config.log] a function to use to see this SDK's logs
 * @return {client}        an AppGrid client tied to the given params
 * @example
 * import factory from 'appgrid';
 *
 * // when all info is available - use all of it !
 * const client = factory({ appKey: 'MY_APP_KEY', uuid: 'USERS_UUID', sessionKey: 'SOME_SESSION_KEY' });
 *
 * // when there is no known sessionKey yet
 * const client2 = factory({ appKey: 'MY_APP_KEY', uuid: 'USERS_UUID' });
 *
 * // when there is no known sessionKey or uuid yet
 * const client3 = factory({ appKey: 'MY_APP_KEY' });
 */
const factory = (config) => {
  const { gid, appKey, sessionKey, log = noop } = config;
  let { uuid } = config;
  // First, check the params are OK
  if (!checkUsability(config)) {
    throw new Error('You must provide an appKey | an appKey and a uuid | an appKey, a uuid and a sessionKey');
  }
  // Generate a uuid if none was given
  if (!uuid) {
    uuid = generateUuid();
  }

  return stamp({
    props: { config: { uuid, gid, appKey, sessionKey, log } }
  });
};

export default factory;
