import { getValidatedOptions } from './options';
import { getQueryString, post } from './apiHelper';

const logLevelNamesToNumbers = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  off: 10
};

const getConcatenatedCode = (facilityCode = 0, errorCode = 0) => {
  return parseInt(`${facilityCode}${errorCode}`);
};

const getCurrentTimeOfDayDimValue = () => {
  const currentHour = new Date().getHours();
  let result;
  if (currentHour >= 1 && currentHour <= 5) {
    result = '01-05'; // NOTE: These strings are expected by AppGrid...
  } else if (currentHour >= 5 && currentHour <= 9) {
    result = '05-09';
  } else if (currentHour >= 9 && currentHour <= 13) {
    result = '09-13';
  } else if (currentHour >= 13 && currentHour <= 17) {
    result = '13-17';
  } else if (currentHour >= 17 && currentHour <= 21) {
    result = '17-21';
  } else if (currentHour >= 21 || currentHour < 1) {
    result = '21-01';
  }
  return result;
};

const errorTransformer = (key, val) => {
  return (!(val instanceof Error)) ? val
    : `${val.name}: ${val.message} | ${val.stack}`;
};

const getLogMessage = (message, metadataObjects) => {
  let logMessage = message;
  if (metadataObjects.length) { logMessage += `| Metadata: ${JSON.stringify(metadataObjects, errorTransformer)}`; }
  return logMessage;
};


const getLogEvent = (logEventOptions = {}, metadataObjects) => {
  const message = getLogMessage(logEventOptions.message, metadataObjects);
  const code = getConcatenatedCode(logEventOptions.facilityCode, logEventOptions.errorCode);
  const dimensions = {
    dim1: logEventOptions.dim1,
    dim2: logEventOptions.dim2,
    dim3: logEventOptions.dim3,
    dim4: logEventOptions.dim4
  };
  return {
    code,
    message,
    dimensions
  };
};

// TODO JASON: Update the following call to include the appKey & sessionId!
const sendEvent = (level, event, options) => {
  const queryString = getQueryString(options);
  const requestUrl = `${options.appGridUrl}/log/${level}?${queryString}`;
  options.debugLogger(`AppGrid: sendEvent request: ${requestUrl}`);
  return post(requestUrl, event);
};

const mapLogLevelNamesToFunctions = () => {
  return Object.keys(logLevelNamesToNumbers).reduce((accumulator, current) => {
    if (current === 'off') { return accumulator; } // We don't want a function for 'off'
    accumulator[current] = (logEventOptions, options, ...metadata) => {
      return getValidatedOptions(options)
        .then((validatedOptions) => {
          const currentLogLevel = logLevelNamesToNumbers[validatedOptions.logLevel];
          if (currentLogLevel > logLevelNamesToNumbers[current]) { return; }
          const logEvent = getLogEvent(logEventOptions, metadata);
          options.debugLogger('Sending AppGrid log message:', logEvent);
          return sendEvent(current, logEvent, validatedOptions);
        });
    };
    return accumulator;
  }, {});
};

const logger = mapLogLevelNamesToFunctions();

export { logger, getCurrentTimeOfDayDimValue };
