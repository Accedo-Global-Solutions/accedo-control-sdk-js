const sessionStamp = require('../session');
const appLogCommon = require('../appLogCommon');
const { post } = require('../../apiHelper');

const { ALLOWED_LEVELS, getLogEvent } = appLogCommon;

// Make sure we have the sessionStamp withSessionHandling method
const stamp = sessionStamp.compose(appLogCommon, {
  methods: {
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
        post(`/application/log/${level}`, this.config, log)
      );
    },
  },
});

module.exports = stamp;
