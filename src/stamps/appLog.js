import stampit from 'stampit';
import sessionStamp from './session';
import { grab, post } from '../apiHelper';

const DEBUG = 'debug';
const INFO = 'info';
const WARN = 'warn';
const ERROR = 'error';

const LOG_LEVELS = [DEBUG, INFO, WARN, ERROR];

const getConcatenatedCode = (facilityCode = '0', errorCode = '0') =>
  parseInt(`${facilityCode}${errorCode}`, 10);

const getLogMessage = (message, metadata) =>
  message + (!metadata ? '' : ` | Metadata: ${JSON.stringify(metadata)}`);

const getLogEvent = (details = {}, metadata) => {
  const message = getLogMessage(details.message, metadata);
  const code = getConcatenatedCode(details.facilityCode, details.errorCode);
  return {
    code,
    message,
    dim1: details.dim1,
    dim2: details.dim2,
    dim3: details.dim3,
    dim4: details.dim4,
  };
};

// DEPRECATED, please do not rely on this. Will be removed in version 3
export const getCurrentTimeOfDayDimValue = () => {
  const hour = new Date().getHours();
  // NOTE: These strings are expected by AppGrid
  switch (true) {
  case (hour >= 1 && hour < 5):
    return '01-05';
  case (hour >= 5 && hour < 9):
    return '05-09';
  case (hour >= 9 && hour < 13):
    return '09-13';
  case (hour >= 13 && hour < 17):
    return '13-17';
  case (hour >= 17 && hour < 21):
    return '17-21';
  default:
    return '21-01';
  }
};

function request(path) {
  return this.withSessionHandling(() => grab(path, this.props.config));
}

function postLog(level, log) {
  return this.withSessionHandling(() => post(`/application/log/${level}`, this.props.config, log));
}

function postLogs(logs) {
  return this.withSessionHandling(() => post('/application/logs', this.props.config, logs));
}

const stamp = stampit()
.methods({
  /**
   * Get the current log level
   * @return {promise}  a promise of the log level (string)
   */
  getLogLevel() {
    return request.call(this, '/application/log/level').then(json => json.logLevel);
  },
  /**
   * Send a log with the given level, details and extra metadata.
   * @param {string} level the log level
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
    if (!LOG_LEVELS.includes(level)) { return Promise.reject('Unsupported log level'); }
    const log = getLogEvent(details, metadata);
    return postLog.call(this, level, log);
  },

  /**
   * Send batched logs, each with its own level, timestamp, details and extra metadata.
   * @param {array} logs Log description objects
   * @param {object} logs.log the information for one of the logs
   * @param {'debug'|'info'|'warn'|'error'} logs.log.logType the log type
   * @param {string|number} logs.log.timestamp the timestamp for the log,
   *                                           as a UTC ISO 8601 string (ie. '2016-07-04T06:17:21Z'),
   *                                           or a POSIX millisecond number
   * @param {string} logs.log.message the log message
   * @param {string} logs.log.facilityCode the facility code
   * @param {string} logs.log.errorCode the error code
   * @param {string} logs.log.dim1 the dimension 1 information
   * @param {string} logs.log.dim2 the dimension 2 information
   * @param {string} logs.log.dim3 the dimension 3 information
   * @param {string} logs.log.dim4 the dimension 4 information
   * @param {any} [logs.log.metadata] extra metadata (will go through JSON.stringify).
   * @return {promise}  a promise of the success of the operation
   */
  sendLogs(logs) {
    const preparedLogs = logs.map(log => {
      const { logType, timestamp } = log;
      return Object.assign(getLogEvent(log, log.metadata), { logType, timestamp });
    });
    return postLogs.call(this, preparedLogs);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
