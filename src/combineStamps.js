const stampit = require('stampit');
const entries = require('./stamps/entries');
const session = require('./stamps/session');
const application = require('./stamps/application');
const assets = require('./stamps/assets');
const events = require('./stamps/events');
const plugins = require('./stamps/plugins');
const profile = require('./stamps/profile');
const metadata = require('./stamps/metadata');
const userData = require('./stamps/userData');
const locales = require('./stamps/locales');
const makeAppLog = require('./stamps/makeAppLog');

// Simply compose all the stamps in one single stamp to give access to all methods
const makeStamp = sendLog =>
  stampit().compose(
    session,
    entries,
    application,
    assets,
    events,
    plugins,
    profile,
    metadata,
    userData,
    locales,
    makeAppLog(sendLog)
  );

module.exports = makeStamp;
