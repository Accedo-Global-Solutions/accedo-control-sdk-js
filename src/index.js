import uuidLib from 'uuid';
import stamp from './stamps/appgridClient';

export { getCurrentTimeOfDayDimValue } from './stamps/appLog';

const noop = () => {};

// an AppGrid Client is usable if there is a known sessionKey or both an uuid and an appKey
const checkUsability = (config = {}) =>
  !!config.sessionKey || (config.uuid && config.appKey);

const factory = (config) => {
  const { uuid, gid, appKey, sessionKey, log = noop } = config;
  if (!checkUsability(config)) {
    throw new Error('You must provide at least a sessionKey, or both a uuid and an appKey');
  }

  return stamp({
    props: { config: { uuid, gid, appKey, sessionKey, log } }
  });
};

export default factory;

export const generateUuid = () => uuidLib.v4();
