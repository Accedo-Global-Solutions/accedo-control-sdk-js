const stampit = require('stampit');
const sessionStamp = require('../session');
const appLogCommon = require('../appLogCommon');
const { post } = require('../../apiHelper');

const { ALLOWED_LEVELS, getLogEvent } = appLogCommon;

const stamp = stampit()
  .methods({
    /**
     * NOTE: This is the Node version, another version exists for browsers
     * Send a log with the given level, details and extra metadata.
     * @param {'debug'|'info'|'warn'|'error'} level the log level
     * @param {object} details the log information
     * @param {string} details.message the log message
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
