const { post } = require('../../apiHelper');
const { getLogEvent } = require('../makeAppLog');

/**
 * Send a log with the given level, details and extra metadata.
 * On browsers, the log will only be sent if necessary, and this is
 * ensured by checking the current log level (from a short-lived cache
 * or via a network call)
 *
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
function sendLog(level, details, ...metadata) {
  const cleanMeta = !metadata.length
    ? undefined
    : metadata.length === 1 ? metadata[0] : metadata;
  const log = getLogEvent(details, cleanMeta);
  return this.withSessionHandling(() =>
    post(`/application/log/${level}`, this.props.config, log)
  );
}

module.exports.sendLog = sendLog;
