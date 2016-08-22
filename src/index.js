import uuidLib from 'uuid';
import stamp from './stamps/appgridClient';

/**
 * Returns the range of the current hour of the day, as a string such as '01-05' for 1am to 5 am
 * @return {string} a range of hours
 */
export { getCurrentTimeOfDayDimValue } from './stamps/appLog';

const noop = () => {};

/**
 * Generate a UUID for a device/appKey tuple when you do not have one already
 * @return {string} a new UUID
 */
export const generateUuid = () => uuidLib.v4();

// an AppGrid Client is usable if there is an appKey, an appKey and a uuid, or an appKey, a uuid and a sessionKey
/**
 * Check the parameters given are good enough to make api calls
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
 * Create an instance of an AppGrid client.
 * You must get an instance before accessing any of the exposed client APIs.
 * @param  {object} config the config for this client
 * @mixes userData
 * @return {client}        an AppGrid client tied to the given params
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
