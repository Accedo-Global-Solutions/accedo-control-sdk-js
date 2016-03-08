'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getCurrentTimeOfDayDimValue = exports.logger = undefined;

var _options = require('./options');

var _apiHelper = require('./apiHelper');

var logLevelNamesToNumbers = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
  off: 10
};

var getConcatenatedCode = function getConcatenatedCode() {
  var facilityCode = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
  var errorCode = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];

  return parseInt('' + facilityCode + errorCode);
};

var getCurrentTimeOfDayDimValue = function getCurrentTimeOfDayDimValue() {
  var currentHour = new Date().getHours();
  var result = void 0;
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
    dim1: logEventOptions.dim1,
    dim2: logEventOptions.dim2,
    dim3: logEventOptions.dim3,
    dim4: logEventOptions.dim4
  };
  return {
    code: code,
    message: message,
    dimensions: dimensions
  };
};

// TODO JASON: Update the following call to include the appKey & sessionId!
var sendEvent = function sendEvent(level, event, options) {
  var requestUrl = options.appGridUrl + '/log/' + level;
  options.debugLogger('AppGrid: sendEvent request: ' + requestUrl);
  return (0, _apiHelper.post)(requestUrl, options, event);
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

      return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
        var currentLogLevel = logLevelNamesToNumbers[validatedOptions.logLevel];
        if (currentLogLevel > logLevelNamesToNumbers[current]) {
          return;
        }
        var logEvent = getLogEvent(logEventOptions, metadata);
        options.debugLogger('Sending AppGrid log message:', logEvent);
        return sendEvent(current, logEvent, validatedOptions);
      });
    };
    return accumulator;
  }, {});
};

var logger = mapLogLevelNamesToFunctions();

exports.logger = logger;
exports.getCurrentTimeOfDayDimValue = getCurrentTimeOfDayDimValue;