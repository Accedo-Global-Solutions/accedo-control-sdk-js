const stampit = require('stampit');
const sessionStamp = require('../session');
const appLogCommon = require('../appLogCommon');
const { post } = require('../../apiHelper');

const { ALLOWED_LEVELS, getLogEvent } = appLogCommon;
const OFF = 'off';
const LOG_LEVELS = [...ALLOWED_LEVELS, OFF];

const stamp = stampit()
  .init(() => {
    // TODO
    // instance.autoBatch = () => {};
  })
  .methods({
    /**
     * NOTE: This is the browser version, another version exists for Node
     * Send a log with the given level, details and extra metadata.
     * @param {'debug'|'info'|'warn'|'error'} level the log level
     * @param {object} details the log information
     * @param {string} details.message the log message
     * @param {string} details.facilityCode the facility code
     * @param {string} details.errorCode the error code
     * @param {string} details.dim1 the dimension 1 information
     * @param {string} details.dim2 the dimension 2 information
     * @param {string} details.dim3 the dimension 3 information
     * @param {string} details.dim4 the dimension 4 information
     * @param {any} [metadata] extra metadata (will go through JSON.stringify).
     *                         Can be passed as any number of trailing arguments.
     * @return {promise}  a promise of the success of the operation
     */
    sendLog(level, details, ...metadata) {
      if (!ALLOWED_LEVELS.includes(level)) {
        return Promise.reject('Unsupported log level');
      }
      // Refer to the Node implementation at `../node/appLog` for the doc
      const cleanMeta = !metadata.length
        ? undefined
        : metadata.length === 1 ? metadata[0] : metadata;

      return this.getLogLevel().then(currentLevel => {
        if (LOG_LEVELS.indexOf(currentLevel) > LOG_LEVELS.indexOf(level)) {
          return Promise.resolve({
            status: 200,
            statusText: 'Request avoided',
            // this is especially useful for tests
            requestAvoided: true,
          });
        }
        const log = getLogEvent(details, cleanMeta);
        return post(`/application/log/${level}`, this.props.config, log);
      });
    },
  })
  // Make sure we have the sessionStamp withSessionHandling method
  .compose(appLogCommon, sessionStamp);

module.exports = stamp;
