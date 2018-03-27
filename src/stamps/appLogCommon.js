const sessionStamp = require('./session');
const { grab, post } = require('../apiHelper');

const DEBUG = 'debug';
const INFO = 'info';
const WARN = 'warn';
const ERROR = 'error';

const ALLOWED_LEVELS = [DEBUG, INFO, WARN, ERROR];

const getLogMessage = (message, metadata) =>
  !metadata ? message : JSON.stringify([message, metadata]);

const getLogEvent = (details = {}, metadata) => {
  const message = getLogMessage(details.message, metadata);
  return {
    code: details.errorCode || 0,
    message,
    dim1: details.dim1,
    dim2: details.dim2,
    dim3: details.dim3,
    dim4: details.dim4,
  };
};

function request(path) {
  return this.withSessionHandling(() => grab(path, this.config));
}

function postLogs(logs) {
  return this.withSessionHandling(() =>
    post('/application/logs', this.config, logs)
  );
}

// we'll cache the log level for 3 minutes on each instance
const CACHE_TTL = 1000 * 60 * 3;

// Make sure we have the sessionStamp withSessionHandling method
const stamp = sessionStamp.compose({
  init(_, { instance }) {
    // the latest log level retrieved and the timestamp
    let latestLevel = {};
    // the promise of getting the current log level
    let currentLevelPromise;

    /**
     * Get the current log level
     * @return {promise}  a promise of the log level (string)
     */
    instance.getLogLevel = function getLogLevel() {
      if (currentLevelPromise) {
        return currentLevelPromise;
      }

      const { logLevel: previousLevel, timestamp = 0 } = latestLevel;
      // Return a promise of the previous log level if it was obtained recently enough
      if (Date.now() - timestamp < CACHE_TTL) {
        return Promise.resolve(previousLevel);
      }
      currentLevelPromise = request
        .call(instance, '/application/log/level')
        .then(({ logLevel }) => {
          // we're no longer getting the current level
          currentLevelPromise = null;

          latestLevel = { logLevel, timestamp: Date.now() };
          return logLevel;
        })
        .catch(err => {
          // we're no longer getting the current level
          currentLevelPromise = null;

          throw err;
        });

      return currentLevelPromise;
    };
  },
  methods: {
    /**
     * Send batched logs, each with its own level, timestamp, details and extra
     * metadata.
     * Note that on browsers, the other method, `sendLog`, is more convenient as
     * it will auto-batch logs for you.
     *
     * @param {object[]} logs Log description objects
     * @param {'debug'|'info'|'warn'|'error'} logs[].logType the log type
     * @param {string|number} logs[].timestamp the timestamp for the log,
     *                                           as a UTC ISO 8601 string
     *                                           (ie. '2016-07-04T06:17:21Z'),
     *                                           or a POSIX millisecond number
     * @param {string} logs[].message the log message
     * @param {string} logs[].errorCode the error code
     * @param {string} logs[].dim1 the dimension 1 information
     * @param {string} logs[].dim2 the dimension 2 information
     * @param {string} logs[].dim3 the dimension 3 information
     * @param {string} logs[].dim4 the dimension 4 information
     * @param {any} [logs[].metadata] extra metadata (will go through JSON.stringify).
     * @return {promise}  a promise of the success of the operation
     */
    sendLogs(logs) {
      const preparedLogs = logs.map(log => {
        const { logType, timestamp } = log;
        return Object.assign(getLogEvent(log, log.metadata), {
          logType,
          timestamp,
        });
      });
      return postLogs.call(this, preparedLogs);
    },
  },
});

module.exports = stamp;
stamp.getLogEvent = getLogEvent;
stamp.ALLOWED_LEVELS = ALLOWED_LEVELS;
