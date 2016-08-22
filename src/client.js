import stampit from 'stampit';
import entriesStamp from './stamps/entries';
import sessionStamp from './stamps/session';
import applicationStamp from './stamps/application';
import assetsStamp from './stamps/assets';
import eventsStamp from './stamps/events';
import appLogStamp from './stamps/appLog';
import pluginsStamp from './stamps/plugins';
import profileStamp from './stamps/profile';
import metadataStamp from './stamps/metadata';
import userDataStamp from './stamps/userData';

const clientStamp = stampit().compose(
  sessionStamp,
  entriesStamp,
  applicationStamp,
  assetsStamp,
  eventsStamp,
  appLogStamp,
  pluginsStamp,
  profileStamp,
  metadataStamp,
  userDataStamp
);

const noop = () => {};

// an AppGrid Client is usable if there is a known sessionKey or both an uuid and an appKey
const checkUsability = (config = {}) =>
  !!config.sessionKey || (config.uuid && config.appKey);

const stamp = (config) => {
  const { uuid, gid, appKey, sessionKey, log = noop } = config;
  if (!checkUsability(config)) {
    throw new Error('You must provide at least a sessionKey, or both a uuid and an appKey');
  }

  return clientStamp({
    props: { config: { uuid, gid, appKey, sessionKey, log } }
  });
};

export default stamp;
