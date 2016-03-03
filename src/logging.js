// TODO JASON: improve the console logging used in this file!

import { validate } from './options';
import { getQueryString, post } from './apiHelper';

const logLevelNamesToNumbers = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  off: 10
};

const getConcatenatedCode = (facilityCode = '10', errorCode = '911') => {
  return parseInt(`${facilityCode}${errorCode}`);
};

const getTimeOfDayDimValue = () => {
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
    dim1: logEventOptions.source,
    dim2: logEventOptions.view,
    dim3: logEventOptions.deviceType,
    dim4: getTimeOfDayDimValue()
  };
  return {
    code,
    message,
    dimensions
  };
};

const sendEvent = (level, event, options) => {
  const queryString = getQueryString(options);
  const requestUrl = `${options.serviceUrl}/log/${level}?${queryString}`;
  console.info(`AppGrid: sendEvent request: ${requestUrl}`); // eslint-disable-line no-console
  return post(requestUrl, event)
    .catch(error => console.error('AppGrid: sendEvent - Exception: ', error)); // eslint-disable-line no-console
};

const mapLogLevelNamesToFunctions = () => {
  return Object.keys(logLevelNamesToNumbers).reduce((accumulator, current) => {
    if (current === 'off') { return accumulator; } // We don't want a function for 'off'
    accumulator[current] = (logEventOptions, options, ...metadata) => {
      validate(options);
      logEventOptions.deviceType = options.deviceType;
      const currentLogLevel = logLevelNamesToNumbers[options.logLevel];
      if (currentLogLevel > logLevelNamesToNumbers[current]) { return; }
      const logEvent = getLogEvent(logEventOptions, metadata);
      console.info('Sending AppGrid log message:', logEvent); // eslint-disable-line no-console
      sendEvent(current, logEvent, options);
    };
    return accumulator;
  }, {});
};

const logger = mapLogLevelNamesToFunctions();

export { logger };
