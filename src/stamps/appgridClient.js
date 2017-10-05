const stampit = require('stampit');
const entriesStamp = require('./entries');
const sessionStamp = require('./session');
const applicationStamp = require('./application');
const assetsStamp = require('./assets');
const eventsStamp = require('./events');
const appLogStamp = require('./appLog');
const pluginsStamp = require('./plugins');
const profileStamp = require('./profile');
const metadataStamp = require('./metadata');
const userDataStamp = require('./userData');
const locales = require('./locales');

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
  userDataStamp,
  locales
);

module.exports = stamp;
