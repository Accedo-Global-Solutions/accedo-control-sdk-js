const stampit = require('stampit');
const sessionStamp = require('../session');
const appLogCommon = require('../appLogCommon');
const { post } = require('../../apiHelper');

const { ALLOWED_LEVELS, getLogEvent } = appLogCommon;

const stamp = stampit()
  .methods({
    // See doc on the browser implementation at `../browser/appLog.js`
    sendLog(level, details, ...metadata) {
      if (!ALLOWED_LEVELS.includes(level)) {
        return Promise.reject('Unsupported log level');
      }
      const cleanMeta = !metadata.length
        ? undefined
        : metadata.length === 1 ? metadata[0] : metadata;

      const log = getLogEvent(details, cleanMeta);
      return this.withSessionHandling(() =>
        post(`/application/log/${level}`, this.props.config, log)
      );
    },
  })
  // Make sure we have the sessionStamp withSessionHandling method
  .compose(appLogCommon, sessionStamp);

module.exports = stamp;
