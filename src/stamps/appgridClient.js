import stampit from 'stampit';
import entriesStamp from './entries';
import sessionStamp from './session';
import applicationStamp from './application';
import assetsStamp from './assets';
import eventsStamp from './events';
import appLogStamp from './appLog';
import pluginsStamp from './plugins';
import profileStamp from './profile';
import metadataStamp from './metadata';
import userDataStamp from './userData';

// Simply compose all the stamps in one single stamp to give access to all methods
const stamp = stampit().compose(
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

export default stamp;
