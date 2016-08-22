import stampit from 'stampit';
import sessionStamp from './session';
import { grab, post } from '../apiHelper';

const DEBUG = 'debug';
const INFO = 'info';
const WARN = 'warn';
const ERROR = 'error';

const LOG_LEVELS = [DEBUG, INFO, WARN, ERROR];

const getConcatenatedCode = (facilityCode = 0, errorCode = 0) =>
  parseInt(`${facilityCode}${errorCode}`, 10);

const getLogMessage = (message, metadata) =>
  message + (!metadata ? '' : ` | Metadata: ${JSON.stringify(metadata)}`);

const getLogEvent = (options = {}, metadata) => {
  const message = getLogMessage(options.message, metadata);
  const code = getConcatenatedCode(options.facilityCode, options.errorCode);
  const dimensions = {
    dim1: options.dim1,
    dim2: options.dim2,
    dim3: options.dim3,
    dim4: options.dim4
  };
  return {
    code,
    message,
    dimensions
  };
};

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

const stamp = stampit()
.methods({
  getLogLevel() {
    return request.call(this, '/application/log/level').then(json => json.logLevel);
  },
  sendLog(level, options, ...metadata) {
    if (!LOG_LEVELS.includes(level)) { return Promise.reject('Unsupported log level'); }
    const log = getLogEvent(options, metadata);
    return postLog.call(this, level, log);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
