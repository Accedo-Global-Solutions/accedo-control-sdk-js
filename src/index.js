import uuidLib from 'uuid';
import stamp from './stamps/appgridClient';

export { getCurrentTimeOfDayDimValue } from './stamps/appLog';

const noop = () => {};

export const generateUuid = () => uuidLib.v4();

// an AppGrid Client is usable if there is an appKey, an appKey and a uuid, or an appKey, a uuid and a sessionKey
const checkUsability = ({ appKey, uuid, sessionKey } = {}) =>
  (appKey && !uuid && !sessionKey) ||
  (appKey && uuid && !sessionKey) ||
  (appKey && uuid && sessionKey);

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
