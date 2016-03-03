'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.logger = undefined;

var _apiHelper = require('./apiHelper');

var defaultDeviceType = 'desktop'; // NOTE: This is the assumed-default value for deviceType, corresponding to Web
// TODO JASON: improve the console.debug logging used in this file!

var deviceType = defaultDeviceType; // TODO JASON: Determine whether to expose this as an option, with fallback to 'desktop' as a default.
var logLevel = 'info'; // TODO JASON: Figure out how to refactor this line so that it's dynamic (consumer-specified)

var logLevelNamesToNumbers = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  off: 10
};

var currentLogLevel = logLevelNamesToNumbers[logLevel];

var getConcatenatedCode = function getConcatenatedCode() {
  var facilityCode = arguments.length <= 0 || arguments[0] === undefined ? '10' : arguments[0];
  var errorCode = arguments.length <= 1 || arguments[1] === undefined ? '911' : arguments[1];

  return parseInt('' + facilityCode + errorCode);
};

var getTimeOfDayDimValue = function getTimeOfDayDimValue() {
  var currentHour = new Date().getHours();
  var result = undefined;
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

var errorTransformer = function errorTransformer(key, val) {
  return !(val instanceof Error) ? val : val.name + ': ' + val.message + ' | ' + val.stack;
};

var getLogMessage = function getLogMessage(message, metadataObjects) {
  var logMessage = message;
  if (metadataObjects.length) {
    logMessage += '| Metadata: ' + JSON.stringify(metadataObjects, errorTransformer);
  }
  return logMessage;
};

var getLogEvent = function getLogEvent() {
  var logEventOptions = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var metadataObjects = arguments[1];

  var message = getLogMessage(logEventOptions.message, metadataObjects);
  var code = getConcatenatedCode(logEventOptions.facilityCode, logEventOptions.errorCode);
  var dimensions = {
    dim1: logEventOptions.source,
    dim2: logEventOptions.view,
    dim3: deviceType,
    dim4: getTimeOfDayDimValue()
  };
  return {
    code: code,
    message: message,
    dimensions: dimensions
  };
};

var sendEvent = function sendEvent(level, event, options) {
  var queryString = (0, _apiHelper.getQueryString)(options);
  var requestUrl = options.serviceUrl + '/log/' + level + '?' + queryString;
  console.debug('AppGrid: sendEvent request: ' + requestUrl); // eslint-disable-line no-console
  return (0, _apiHelper.post)(requestUrl, event).catch(function (error) {
    return console.error('AppGrid: sendEvent - Exception: ', error);
  }); // eslint-disable-line no-console
};

var mapLogLevelNamesToFunctions = function mapLogLevelNamesToFunctions() {
  return Object.keys(logLevelNamesToNumbers).reduce(function (accumulator, current) {
    if (current === 'off') {
      return accumulator;
    } // We don't want a function for 'off'
    accumulator[current] = function (logEventOptions, options) {
      for (var _len = arguments.length, metadata = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        metadata[_key - 2] = arguments[_key];
      }

      if (currentLogLevel > logLevelNamesToNumbers[current]) {
        return;
      }
      var logEvent = getLogEvent(logEventOptions, metadata);
      console.debug('Sending AppGrid log message:', logEvent); // eslint-disable-line no-console
      sendEvent(current, logEvent, options);
    };
    return accumulator;
  }, {});
};

var logger = mapLogLevelNamesToFunctions();

exports.logger = logger;