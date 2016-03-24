'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var fetch = _interopDefault(require('isomorphic-fetch'));
var qs = _interopDefault(require('qs'));
var uuid = _interopDefault(require('uuid'));
var chalk = _interopDefault(require('chalk'));
var fs = require('fs');

var babelHelpers = {};

babelHelpers.extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

var MIME_TYPE_JSON = 'application/json';
var credentials = 'same-origin'; // NOTE: This option is required in order for Fetch to send cookies
var defaultHeaders = { accept: MIME_TYPE_JSON };

var extractJsonAndAddTimestamp = function extractJsonAndAddTimestamp(response) {
  var time = Date.now();
  return response.json().then(function (json) {
    if (json.error && json.error.code !== '404') {
      throw new Error('AppGrid GET Request Error. Code: ' + json.error.code + ' Message: ' + json.error.message + '. Status: ' + json.error.status);
    }
    return { time: time, json: json };
  });
};

var getForwardedForHeader = function getForwardedForHeader(_ref) {
  var clientIp = _ref.clientIp;

  if (!clientIp) {
    return {};
  }
  return { 'X-FORWARDED-FOR': clientIp };
};

var getSessionHeader = function getSessionHeader(_ref2) {
  var sessionId = _ref2.sessionId;

  if (!sessionId) {
    return {};
  }
  return { 'X-SESSION': sessionId };
};

var getNoCacheHeader = function getNoCacheHeader(_ref3) {
  var noCache = _ref3.noCache;

  if (!noCache) {
    return {};
  }
  return { 'X-NO-CACHE': 'true' };
};

var getContentTypeHeader = function getContentTypeHeader() {
  return { 'Content-Type': MIME_TYPE_JSON };
};

var getQueryString = function getQueryString(options) {
  var existingQs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var defaultQs = {
    appKey: options.appId,
    uuid: options.uuid
  };
  if (options.gid) {
    defaultQs.gid = options.gid;
  }
  var qsObject = babelHelpers.extends({}, existingQs, defaultQs);
  var queryString = qs.stringify(qsObject);
  return queryString;
};

var getRequestUrlWithQueryString = function getRequestUrlWithQueryString(url, options) {
  var splitUrl = url.split('?');
  var urlWithoutQs = splitUrl[0];
  var existingQs = qs.parse(splitUrl[1]);
  var queryString = getQueryString(options, existingQs);
  return urlWithoutQs + '?' + queryString;
};

var getExtraHeaders = function getExtraHeaders(options) {
  return babelHelpers.extends({}, getForwardedForHeader(options), getSessionHeader(options), getNoCacheHeader(options));
};

var getFetchRequest = function getFetchRequest(url, options) {
  var headers = babelHelpers.extends({}, defaultHeaders, getExtraHeaders(options));
  var requestUrl = getRequestUrlWithQueryString(url, options);
  options.debugLogger('Sending a GET request to: ' + requestUrl + '. With the following headers: ', headers);
  return fetch(requestUrl, { credentials: credentials, headers: headers });
};

var grab = function grab(url, options) {
  return getFetchRequest(url, options).then(extractJsonAndAddTimestamp).then(function (response) {
    options.debugLogger('GET response: ', response);
    return response;
  });
};

var grabRaw = function grabRaw(url, options) {
  return getFetchRequest(url, options).then(function (response) {
    return response.body;
  });
};

var post = function post(url, options) {
  var body = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var headers = babelHelpers.extends({}, defaultHeaders, getContentTypeHeader(), getExtraHeaders(options));
  var requestUrl = getRequestUrlWithQueryString(url, options);
  options.debugLogger('Sending a POST request to: ' + requestUrl + '. With the following headers and body: ', headers, body);
  var requestOptions = {
    headers: headers,
    credentials: credentials,
    method: 'post',
    body: JSON.stringify(body)
  };
  return fetch(requestUrl, requestOptions).then(function (_ref4) {
    var status = _ref4.status;
    var statusText = _ref4.statusText;

    if (status !== 200) {
      throw new Error('AppGrid POST request returned a non-200 response. Status Code: ' + status + '. Status Text: ' + statusText);
    }
    var result = { status: status, statusText: statusText };
    options.debugLogger('POST response: ', result);
    return result;
  });
};

var getSession = function getSession(options) {
  options.debugLogger('AppGrid: Requesting a new session for the following UUID: ' + options.uuid);
  var requestUrl = options.appGridUrl + '/session';
  return grab(requestUrl, options).then(function (response) {
    return response.json.sessionKey;
  });
};

var updateSessionUuid = function updateSessionUuid(options) {
  var requestUrl = options.appGridUrl + '/session';
  return post(requestUrl, options).then(function (response) {
    return response;
  });
};

var getStatus = function getStatus(options) {
  var requestUrl = options.appGridUrl + '/status';
  return grab(requestUrl, options);
};

var validateSession = function validateSession(options) {
  if (!options.sessionId) {
    return Promise.resolve(false);
  }
  return getStatus(options).then(function (response) {
    return !response.json.error;
  }).catch(function () {
    return false;
  });
};

var generateUuid = function generateUuid() {
  return uuid.v4();
};

var requiredOptions = ['appGridUrl', 'appId'];

var optionalOptionDefaults = {
  logLevel: 'info',
  uuid: function uuid() {
    return generateUuid();
  }
};

var validateRequiredOption = function validateRequiredOption(options, option) {
  if (options[option]) {
    return;
  }
  var errorMessage = 'AppGrid Fatal Error: Required option: ' + option + ' was not found.';
  throw new Error(errorMessage);
};

var setDefaultOptionValueIfNeeded = function setDefaultOptionValueIfNeeded(options, option) {
  if (options[option]) {
    return;
  }
  options[option] = typeof optionalOptionDefaults[option] === 'function' ? options[option] = optionalOptionDefaults[option]() : options[option] = optionalOptionDefaults[option];
  options.debugLogger('AppGrid: Default value of: ' + options[option] + ' was used for: ' + option);
};

var getDebugOutput = function getDebugOutput(options) {
  var noOp = function noOp() {};
  if (!options || !options.debugLogger || typeof options.debugLogger !== 'function') {
    return noOp;
  }
  return options.debugLogger;
};

var getNewSession = function getNewSession(options, failOnInvalidSession) {
  if (failOnInvalidSession) {
    throw new Error('This AppGrid API call requires a valid session!');
  }
  options.debugLogger('AppGrid: Requesting a new Session');
  return getSession(options).then(function (sessionId) {
    options.sessionId = sessionId;
    return options;
  });
};

var validateAndUpdateSessionIdIfNeeded = function validateAndUpdateSessionIdIfNeeded(options, isSessionValidationSkipped, failOnInvalidSession) {
  if (isSessionValidationSkipped) {
    return Promise.resolve(options);
  }
  return validateSession(options).then(function (isValid) {
    if (!isValid) {
      return getNewSession(options, failOnInvalidSession);
    }
    options.debugLogger('AppGrid: Session is valid.');
    return options;
  });
};

var getValidatedOptions = function getValidatedOptions(options, isSessionValidationSkipped, failOnInvalidSession) {
  return new Promise(function (resolve, reject) {
    if (!options) {
      reject(new Error('The options object was falsey'));
      return;
    }
    options.debugLogger = getDebugOutput(options);
    requiredOptions.forEach(function (option) {
      return validateRequiredOption(options, option);
    });
    Object.keys(optionalOptionDefaults).forEach(function (option) {
      return setDefaultOptionValueIfNeeded(options, option);
    });
    validateAndUpdateSessionIdIfNeeded(options, isSessionValidationSkipped, failOnInvalidSession).then(function (validatedOptions) {
      resolve(validatedOptions);
    }).catch(reject);
  });
};

var getAllAssets = function getAllAssets(options) {
  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/asset';
    validatedOptions.debugLogger('AppGrid: getAllAssets request: ' + requestUrl);
    return grab(requestUrl, validatedOptions);
  });
};

var getAssetStreamById = function getAssetStreamById(id, options) {
  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/asset/' + id;
    validatedOptions.debugLogger('AppGrid: getAssetStreamById request: ' + requestUrl);
    return grabRaw(requestUrl, validatedOptions);
  });
};

var assets = Object.freeze({
  getAllAssets: getAllAssets,
  getAssetStreamById: getAssetStreamById
});

var defaultCountOfResults = 20;

var getPaginationQueryParams = function getPaginationQueryParams(offset, countOfResults) {
  return 'offset=' + offset + '&size=' + countOfResults;
};

var getEntryRequestUrl = function getEntryRequestUrl(validatedOptions, relativePath, isPreview, atUtcTime, ids, typeId) {
  var requestUrl = validatedOptions.appGridUrl + '/' + relativePath;
  var qsObject = {};
  if (ids && ids.length) {
    qsObject.id = '' + ids.join(',');
  }
  if (typeId) {
    qsObject.typeId = typeId;
  }
  if (isPreview) {
    qsObject.preview = true;
  }
  if (atUtcTime) {
    qsObject.at = atUtcTime.toISOString();
  }
  var queryString = qs.stringify(qsObject);
  requestUrl += '?' + queryString;
  return requestUrl;
};

var getAllEntries = function getAllEntries(options) {
  var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var countOfResults = arguments.length <= 2 || arguments[2] === undefined ? defaultCountOfResults : arguments[2];

  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/content/entries?' + getPaginationQueryParams(offset, countOfResults);
    validatedOptions.debugLogger('AppGrid: getAllEntries request: ' + requestUrl);
    return grab(requestUrl, validatedOptions);
  });
};

var getEntryById = function getEntryById(options, id) {
  var isPreview = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
  var atUtcTime = arguments[3];

  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = getEntryRequestUrl(validatedOptions, 'content/entry/' + id, isPreview, atUtcTime);
    validatedOptions.debugLogger('AppGrid: getEntryById request: ' + requestUrl);
    return grab(requestUrl, validatedOptions);
  });
};

var getEntriesByIds = function getEntriesByIds(options, ids) {
  var offset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
  var countOfResults = arguments.length <= 3 || arguments[3] === undefined ? defaultCountOfResults : arguments[3];
  var isPreview = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
  var atUtcTime = arguments[5];

  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = getEntryRequestUrl(validatedOptions, 'content/entries', isPreview, atUtcTime, ids);
    requestUrl += '&' + getPaginationQueryParams(offset, countOfResults);
    validatedOptions.debugLogger('AppGrid: getEntriesByIds request: ' + requestUrl);
    return grab(requestUrl, validatedOptions);
  });
};

var getEntriesByTypeId = function getEntriesByTypeId(options, typeId) {
  var offset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
  var countOfResults = arguments.length <= 3 || arguments[3] === undefined ? defaultCountOfResults : arguments[3];
  var isPreview = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
  var atUtcTime = arguments[5];

  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = getEntryRequestUrl(validatedOptions, 'content/entries', isPreview, atUtcTime, null, typeId);
    requestUrl += '&' + getPaginationQueryParams(offset, countOfResults);
    validatedOptions.debugLogger('AppGrid: getEntriesByTypeId request: ' + requestUrl);
    return grab(requestUrl, validatedOptions);
  });
};

var contentEntries = Object.freeze({
  getAllEntries: getAllEntries,
  getEntryById: getEntryById,
  getEntriesByIds: getEntriesByIds,
  getEntriesByTypeId: getEntriesByTypeId
});

var sendUsageStartEvent = function sendUsageStartEvent(options) {
  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/event/log';
    var body = {
      eventType: 'START'
    };
    validatedOptions.debugLogger('AppGrid: sendUsageStartEvent request: ' + requestUrl);
    return post(requestUrl, validatedOptions, body);
  });
};

var sendUsageStopEvent = function sendUsageStopEvent(options, retentionTimeInSeconds) {
  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/event/log';
    var body = {
      eventType: 'QUIT',
      retentionTime: retentionTimeInSeconds
    };
    validatedOptions.debugLogger('AppGrid: sendUsageStopEvent request: ' + requestUrl);
    return post(requestUrl, validatedOptions, body);
  });
};

var events = Object.freeze({
  sendUsageStartEvent: sendUsageStartEvent,
  sendUsageStopEvent: sendUsageStopEvent
});

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

var getLogLevel = function getLogLevel(options) {
  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/application/log/level';
    return grab(requestUrl, options).then(function (response) {
      return response.json.logLevel;
    });
  });
};

var sendEvent = function sendEvent(options, level, event) {
  var requestUrl = options.appGridUrl + '/application/log/' + level;
  options.debugLogger('AppGrid: sendEvent request: ' + requestUrl);
  return post(requestUrl, options, event);
};

var mapLogLevelNamesToFunctions = function mapLogLevelNamesToFunctions() {
  return Object.keys(logLevelNamesToNumbers).reduce(function (accumulator, current) {
    if (current === 'off') {
      return accumulator;
    } // We don't want a function for 'off'
    accumulator[current] = function (options, logEventOptions) {
      for (var _len = arguments.length, metadata = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
        metadata[_key - 2] = arguments[_key];
      }

      return getValidatedOptions(options).then(function (validatedOptions) {
        var currentLogLevel = logLevelNamesToNumbers[validatedOptions.logLevel];
        if (currentLogLevel > logLevelNamesToNumbers[current]) {
          return;
        }
        var logEvent = getLogEvent(logEventOptions, metadata);
        validatedOptions.debugLogger('Sending AppGrid log message:', logEvent);
        return sendEvent(validatedOptions, current, logEvent);
      });
    };
    return accumulator;
  }, {});
};

var logger = mapLogLevelNamesToFunctions();

var getAllMetadata = function getAllMetadata(options) {
  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/metadata';
    validatedOptions.debugLogger('AppGrid: getAllMetadata request: ' + requestUrl);
    return grab(requestUrl, validatedOptions);
  });
};

var getMetadataByKey = function getMetadataByKey(options, key) {
  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/metadata/' + key;
    validatedOptions.debugLogger('AppGrid: getMetadataByKey request: ' + requestUrl);
    return grab(requestUrl, validatedOptions);
  });
};

var getMetadataByKeys = function getMetadataByKeys(options, keys) {
  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/metadata/' + keys.join(',');
    validatedOptions.debugLogger('AppGrid: getMetadataByKeys request: ' + requestUrl);
    return grab(requestUrl, validatedOptions);
  });
};

var metadata = Object.freeze({
  getAllMetadata: getAllMetadata,
  getMetadataByKey: getMetadataByKey,
  getMetadataByKeys: getMetadataByKeys
});

var getAllEnabledPlugins = function getAllEnabledPlugins(options) {
  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/plugins';
    validatedOptions.debugLogger('AppGrid: getAllEnabledPlugins request: ' + requestUrl);
    return grab(requestUrl, validatedOptions);
  });
};

var plugins = Object.freeze({
  getAllEnabledPlugins: getAllEnabledPlugins
});

var invokeSessionHelperFunctionWithValidatedOptions = function invokeSessionHelperFunctionWithValidatedOptions(options, helperFunction, isSessionValidationSkipped, failOnInvalidSession) {
  return getValidatedOptions(options, isSessionValidationSkipped, failOnInvalidSession).then(function (validatedOptions) {
    return helperFunction(validatedOptions);
  });
};

var generateUuid$1 = generateUuid;
var getSession$1 = function getSession$$(options) {
  return invokeSessionHelperFunctionWithValidatedOptions(options, getSession, true);
};
var getStatus$1 = function getStatus$$(options) {
  return invokeSessionHelperFunctionWithValidatedOptions(options, getStatus);
};
var validateSession$1 = function validateSession$$(options) {
  return invokeSessionHelperFunctionWithValidatedOptions(options, validateSession, true);
};
var updateSessionUuid$1 = function updateSessionUuid$$(options) {
  return invokeSessionHelperFunctionWithValidatedOptions(options, updateSessionUuid, false, true);
};

var session = Object.freeze({
  generateUuid: generateUuid$1,
  getSession: getSession$1,
  getStatus: getStatus$1,
  updateSessionUuid: updateSessionUuid$1,
  validateSession: validateSession$1
});

var applicationScopePath = 'user';
var applicationGroupScopePath = 'group';

var getAllDataByUser = function getAllDataByUser(options, scope, userName) {
  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/' + scope + '/' + userName;
    validatedOptions.debugLogger('AppGrid: getAllDataByUser request: ' + requestUrl);
    return grab(requestUrl, validatedOptions);
  });
};

var getDataByUserAndKey = function getDataByUserAndKey(options, scope, userName, key) {
  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/' + scope + '/' + userName + '/' + key + '?json=true';
    validatedOptions.debugLogger('AppGrid: getDataByUserAndKey request: ' + requestUrl);
    return grab(requestUrl, validatedOptions);
  });
};

var setUserData = function setUserData(options, scope, userName, data) {
  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/' + scope + '/' + userName;
    validatedOptions.debugLogger('AppGrid: setUserData request: ' + requestUrl);
    return post(requestUrl, validatedOptions, data);
  });
};

var setUserDataByKey = function setUserDataByKey(options, scope, userName, key, value) {
  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/' + scope + '/' + userName + '/' + key;
    validatedOptions.debugLogger('AppGrid: setUserDataByKey request: ' + requestUrl);
    return post(requestUrl, validatedOptions, value);
  });
};

var getAllApplicationScopeDataByUser = function getAllApplicationScopeDataByUser(options, userName) {
  return getAllDataByUser(options, applicationScopePath, userName);
};

var getAllApplicationGroupScopeDataByUser = function getAllApplicationGroupScopeDataByUser(options, userName) {
  return getAllDataByUser(options, applicationGroupScopePath, userName);
};

var getApplicationScopeDataByUserAndKey = function getApplicationScopeDataByUserAndKey(options, userName, key) {
  return getDataByUserAndKey(options, applicationScopePath, userName, key);
};

var getApplicationGroupScopeDataByUserAndKey = function getApplicationGroupScopeDataByUserAndKey(options, userName, key) {
  return getDataByUserAndKey(options, applicationGroupScopePath, userName, key);
};

var setApplicationScopeUserData = function setApplicationScopeUserData(options, userName, data) {
  return setUserData(options, applicationScopePath, userName, data);
};

var setApplicationGroupScopeUserData = function setApplicationGroupScopeUserData(options, userName, data) {
  return setUserData(options, applicationGroupScopePath, userName, data);
};

var setApplicationScopeUserDataByKey = function setApplicationScopeUserDataByKey(options, userName, key, value) {
  return setUserDataByKey(options, applicationScopePath, userName, key, value);
};

var setApplicationGroupScopeUserDataByKey = function setApplicationGroupScopeUserDataByKey(options, userName, key, value) {
  return setUserDataByKey(options, applicationGroupScopePath, userName, key, value);
};

var userData = Object.freeze({
  getAllApplicationScopeDataByUser: getAllApplicationScopeDataByUser,
  getAllApplicationGroupScopeDataByUser: getAllApplicationGroupScopeDataByUser,
  getApplicationScopeDataByUserAndKey: getApplicationScopeDataByUserAndKey,
  getApplicationGroupScopeDataByUserAndKey: getApplicationGroupScopeDataByUserAndKey,
  setApplicationScopeUserData: setApplicationScopeUserData,
  setApplicationGroupScopeUserData: setApplicationGroupScopeUserData,
  setApplicationScopeUserDataByKey: setApplicationScopeUserDataByKey,
  setApplicationGroupScopeUserDataByKey: setApplicationGroupScopeUserDataByKey
});

var logUtils = {
  getCurrentTimeOfDayDimValue: getCurrentTimeOfDayDimValue,
  getLogLevel: getLogLevel
};

var api = {
  assets: assets,
  contentEntries: contentEntries,
  events: events,
  logger: logger,
  logUtils: logUtils,
  metadata: metadata,
  plugins: plugins,
  session: session,
  userData: userData
};

/* // NOTE: Uncomment this block, and the 'debugLogger' line inside of the appGridOptions, below in order to show debug logs in the console.
const debugLogger = (message, ...metadata) => {
  console.log(chalk.bgBlack.white(`\t\tAppGrid DEBUG: ${message} `), ...metadata);
};
*/

var logError = function logError(message) {
  var _console;

  for (var _len = arguments.length, metadata = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    metadata[_key - 1] = arguments[_key];
  }

  (_console = console).error.apply(_console, [chalk.bgBlack.red.bold('\t\t ' + message)].concat(metadata));
};

var exampleUuid = api.session.generateUuid();
var downloadsDirectoryName = 'downloads';

var appGridOptions = {
  // NOTE: The following properties are required
  appGridUrl: 'https://appgrid-api.cloud.accedo.tv',
  appId: '56ea6a370db1bf032c9df5cb',

  // NOTE: The following properties are optional
  logLevel: 'info', // This will default to: 'info' if not provided
  /* Here are the possible values for logLevel (NOTE: there is a corresponding AppGrid.logger.'level' function for each, apart from 'off') :
     debug,
     info,
     warn,
     error,
     off
  */
  clientIp: '', // NOTE: If provided, this value will be inserted into the X-FORWARDED-FOR header for all AppGrid API Calls
  sessionId: '', // NOTE: It's ideal to store and reuse the sessionId as much as possible, however a new one will automatically be requested if needed or missing.
  gid: '', // NOTE: Refer to the AppGrid documentation on how to optionally make use of a GID.
  uuid: exampleUuid // NOTE: This value should be unique per end-user. If not provided, a new UUID will be generated for each request.
  // debugLogger // NOTE: This is for capturing any debug messages from the AppGrid library. If not defined, a no-op will be used instead.
};

var logExampleCategoryHeader = function logExampleCategoryHeader(message) {
  console.log();
  console.log(chalk.bgBlack.yellow('\t*************************************************'));
  console.log(chalk.bgBlack.yellow('\t*   \t' + message));
  console.log(chalk.bgBlack.yellow('\t*************************************************'));
};

var logExampleHeader = function logExampleHeader(message) {
  console.log();
  console.log('\t\t ' + chalk.yellow('Example:') + ' ' + message);
};

var exampleAppGridLogging = function exampleAppGridLogging() {
  var getLogEventOptions = function getLogEventOptions(message, facilityCode) {
    // NOTE: This is simply a convenience/helper method for building a logEvent object.
    var networkErrorCode = '002'; // NOTE: The ErrorCode used must exist within your AppGrid Application's configuration.
    var middlewareSourceCode = 'service-mw'; // NOTE: The SourceCode used must exist within your AppGrid Application's configuration.
    var noneViewName = ''; // NOTE: The ViewName used must exist within your AppGrid Application's configuration.
    var deviceType = 'desktop'; // NOTE: The deviceType used must exist within your AppGrid Application's configuration.
    return {
      message: message,
      errorCode: networkErrorCode,
      facilityCode: facilityCode, // NOTE: The FacilityCode used must exist within you AppGrid Application's configuration
      dim1: middlewareSourceCode,
      dim2: noneViewName,
      dim3: deviceType,
      dim4: api.logUtils.getCurrentTimeOfDayDimValue()
    };
  };
  var logFacilityCode = 13;
  logExampleCategoryHeader('AppGrid Logging Examples');

  var getLogLevel = function getLogLevel() {
    logExampleHeader('Requesting the current LogLevel from AppGrid');
    return api.logUtils.getLogLevel(appGridOptions).then(function (logLevelResponse) {
      console.log('\t\t Successfully got the current LogLevel from AppGrid: ' + chalk.blue(logLevelResponse));
      appGridOptions.logLevel = logLevelResponse;
    }).catch(function (error) {
      logError('Oops! There was an error while requesting the current LogLevel from AppGrid!', error);
    });
  };

  var sendInfoLogMessage = function sendInfoLogMessage() {
    logExampleHeader('Sending an info log message to AppGrid');
    var exampleInfoEventOptions = getLogEventOptions('This is an info log entry!', logFacilityCode);
    return api.logger.info(appGridOptions, exampleInfoEventOptions).then(function () {
      console.log('\t\t Successfully sent an info log to AppGrid');
    }).catch(function (error) {
      logError('Oops! There was an error while sending an info log to AppGrid!', error);
    });
  };

  var sendInfoLogMessageWithMetadata = function sendInfoLogMessageWithMetadata() {
    logExampleHeader('Sending an info log message with Metadata to AppGrid');
    var exampleInfoEventOptionsWithMetadata = getLogEventOptions('This is an info log entry with Metadata!', logFacilityCode);
    var exampleInfoMetadata = { someMetadataKey: 'someValue' };
    return api.logger.info(appGridOptions, exampleInfoEventOptionsWithMetadata, exampleInfoMetadata).then(function () {
      console.log('\t\t Successfully sent an info log with Metadata to AppGrid');
    }).catch(function (error) {
      logError('Oops! There was an error while sending an info log with Metadata to AppGrid!', error);
    });
  };

  return getLogLevel().then(sendInfoLogMessage).then(sendInfoLogMessageWithMetadata).then(function () {
    return logExampleCategoryHeader('End AppGrid Logging Examples');
  });
};

var exampleAppGridEvents = function exampleAppGridEvents() {
  logExampleCategoryHeader('AppGrid Event Examples:');

  var sendUsageStartEvent = function sendUsageStartEvent() {
    logExampleHeader('Sending a UsageStart Event to AppGrid');
    return api.events.sendUsageStartEvent(appGridOptions).then(function () {
      console.log('\t\t Successfully sent a UsageStart Event to AppGrid');
    }).catch(function (error) {
      logError('Oops! There was an error while sending a UsageStart event to AppGrid!', error);
    });
  };

  var sendUsageStopEvent = function sendUsageStopEvent() {
    return new Promise(function (resolve) {
      logExampleHeader('Sending a UsageStop Event to AppGrid');
      var rententionTimeInSeconds = 6;
      console.log('\t\t Waiting ' + rententionTimeInSeconds + ' second(s) before sending the UsageStop Event.');
      setTimeout(function () {
        api.events.sendUsageStopEvent(appGridOptions, rententionTimeInSeconds).then(function () {
          console.log('\t\t Successfully sent a UsageStop Event to AppGrid');
          resolve();
        }).catch(function () {
          logError('Oops! There was an error while sending a UsageStop Event to AppGrid!');
          resolve();
        });
      }, rententionTimeInSeconds * 1000);
    });
  };

  return sendUsageStartEvent().then(sendUsageStopEvent).then(function () {
    return logExampleCategoryHeader('End AppGrid Event Examples');
  });
};

var exampleAppGridMetadata = function exampleAppGridMetadata() {
  logExampleCategoryHeader('AppGrid Metadata Examples:');

  var getAllMetadata = function getAllMetadata() {
    logExampleHeader('Requesting all metadata from AppGrid');
    return api.metadata.getAllMetadata(appGridOptions).then(function (metadata) {
      console.log('\t\t Successfully requested all metadata from AppGrid', metadata);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting all metadata from AppGrid!', error);
    });
  };

  var getMetadataByKey = function getMetadataByKey() {
    logExampleHeader('Requesting metadata by key from AppGrid');
    var keyToFetch = 'android'; // NOTE: The key can be any valid metadata property, including subproperties such as: "someKey.someSubKey" and wildcards, such as: "someKe*"
    return api.metadata.getMetadataByKey(appGridOptions, keyToFetch).then(function (metadata) {
      console.log('\t\t Successfully requested metadata by key from AppGrid. Key used: ' + chalk.blue(keyToFetch) + '. \n\t\t Metadata: ', metadata);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting metadata by key from AppGrid!', error);
    });
  };

  var getMetadataByKeys = function getMetadataByKeys() {
    logExampleHeader('Requesting metadata by multiple keys from AppGrid');
    var keysToFetch = ['android', 'color*'];
    return api.metadata.getMetadataByKeys(appGridOptions, keysToFetch).then(function (metadata) {
      console.log('\t\t Successfully requested metadata by multiple keys from AppGrid. Keys used: ' + chalk.blue(keysToFetch.join(', ')) + ' \n\t\t Metadata: ', metadata);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting metadata by multiple keys from AppGrid!', error);
    });
  };

  return getAllMetadata().then(getMetadataByKey).then(getMetadataByKeys).then(function () {
    return logExampleCategoryHeader('End AppGrid Metadata Examples');
  });
};

var exampleAppGridAssets = function exampleAppGridAssets() {
  logExampleCategoryHeader('AppGrid Asset Examples:');

  var getAllAssets = function getAllAssets() {
    logExampleHeader('Requesting all assets from AppGrid');
    return api.assets.getAllAssets(appGridOptions).then(function (assets) {
      console.log('\t\t Successfully requested all assets from AppGrid', assets);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting all assets from AppGrid!', error);
    });
  };

  var getAssetStreamById = function getAssetStreamById() {
    logExampleHeader('Downloading asset by id from AppGrid');
    var idToDownload = '5566eeaa669ad3b700ddbb11bbff003322cc99ddff55bc7b'; // NOTE: You can get a list of all assets including their IDs by calling the 'getAllAssets' API
    var fileName = downloadsDirectoryName + '/appLogoLarge.png';
    return api.assets.getAssetStreamById(idToDownload, appGridOptions).then(function (assetStream) {
      return new Promise(function (resolve, reject) {
        fs.existsSync(downloadsDirectoryName) || fs.mkdirSync(downloadsDirectoryName);
        assetStream.pipe(fs.createWriteStream(fileName)).on('close', resolve).on('error', reject);
      });
    }).then(function () {
      console.log('\t\t Successfully downloaded an asset by id from AppGrid.\n\t\t AssetId used: ' + chalk.blue(idToDownload) + '.\n\t\t Filename: ' + chalk.blue(fileName));
    }).catch(function (error) {
      logError('Oops! There was an error while downloading an asset by id from AppGrid!', error);
    });
  };

  return getAllAssets().then(getAssetStreamById).then(function () {
    return logExampleCategoryHeader('End AppGrid Asset Examples');
  });
};

var exampleAppGridContentEntries = function exampleAppGridContentEntries() {
  logExampleCategoryHeader('AppGrid ContentEntries Examples:');

  var getAllEntries = function getAllEntries() {
    logExampleHeader('Requesting all ContentEntries from AppGrid');
    var offset = 0; // NOTE: This is the pagination offset used by the AppGrid API. Default is: 0.
    var countOfResults = 50; // NOTE: This is used by the AppGrid API to determine the size of the response. Default is: 30
    return api.contentEntries.getAllEntries(appGridOptions, offset, countOfResults).then(function (response) {
      var _response$json = response.json;
      var entries = _response$json.entries;
      var pagination = _response$json.pagination;
      // NOTE: For a production usage, additional pagination-handling logic would be required to ensure that all entries are fetched.

      console.log('\t\t Successfully requested all ContentEntries from AppGrid\n\t\t Count of entries recieved: ' + chalk.blue(entries.length) + ' out of ' + chalk.blue(pagination.total) + ' total entries.');
    }).catch(function (error) {
      logError('Oops! There was an error while requesting all ContentEntries from AppGrid!', error);
    });
  };

  var getEntryById = function getEntryById() {
    logExampleHeader('Requesting a ContentEntry by id from AppGrid');
    var idToFetch = '56ea7bd6935f75032a2fd431';
    var isPreview = false; // NOTE: This is an optional parameter. It can be true or false. If set to true the response will return the latest values for this Entry whether it is published or not. Default is false
    var atUtcTime = new Date(); // NOTE: This is an optional parameter. Used to get Entry preview for specific moment of time in past or future. Value is a Date object. Can not be used if "isPreview" is set to true.
    return api.contentEntries.getEntryById(appGridOptions, idToFetch, isPreview, atUtcTime).then(function (entry) {
      console.log('\t\t Successfully requested a ContentEntry by id from AppGrid. Id used: ' + chalk.blue(idToFetch) + '. \n\t\t ContentEntry: ', entry);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting a ContentEntry by id from AppGrid!', error);
    });
  };

  var getEntriesByIds = function getEntriesByIds() {
    logExampleHeader('Requesting ContentEntries by multiple ids from AppGrid');
    var idsToFetch = ['56ea7bd6935f75032a2fd431', '56ea7c55935f75032a2fd437'];
    var offset = 0; // NOTE: This is the pagination offset used by the AppGrid API. Default is: 0.
    var countOfResults = 50; // NOTE: This is used by the AppGrid API to determine the size of the response. Default is: 30
    var isPreview = false; // NOTE: This is an optional parameter. It can be true or false. If set to true the response will return the latest values for this Entry whether it is published or not. Default is false
    var atUtcTime = new Date(); // NOTE: This is an optional parameter. Used to get Entry preview for specific moment of time in past or future. Value is a Date object. Can not be used if "isPreview" is set to true.
    return api.contentEntries.getEntriesByIds(appGridOptions, idsToFetch, offset, countOfResults, isPreview, atUtcTime).then(function (response) {
      var _response$json2 = response.json;
      var entries = _response$json2.entries;
      var pagination = _response$json2.pagination;
      // NOTE: For a production usage, additional pagination-handling logic would be required to ensure that all entries are fetched.

      console.log('\t\t Successfully requested multiple ContentEntries by ids from AppGrid\n\t\t Count of entries recieved: ' + chalk.blue(entries.length) + ' out of ' + chalk.blue(pagination.total) + ' total entries.');
    }).catch(function (error) {
      logError('Oops! There was an error while requesting ContentEntries by multiple ids from AppGrid!', error);
    });
  };

  var getEntriesByTypeId = function getEntriesByTypeId() {
    logExampleHeader('Requesting ContentEntries by typeId from AppGrid');
    var typeIdToFetch = '56ea7bca935f75032a2fd42c';
    var offset = 0; // NOTE: This is the pagination offset used by the AppGrid API. Default is: 0.
    var countOfResults = 50; // NOTE: This is used by the AppGrid API to determine the size of the response. Default is: 30
    var isPreview = false; // NOTE: This is an optional parameter. It can be true or false. If set to true the response will return the latest values for this Entry whether it is published or not. Default is false
    var atUtcTime = new Date(); // NOTE: This is an optional parameter. Used to get Entry preview for specific moment of time in past or future. Value is a Date object. Can not be used if "isPreview" is set to true.
    return api.contentEntries.getEntriesByTypeId(appGridOptions, typeIdToFetch, offset, countOfResults, isPreview, atUtcTime).then(function (response) {
      var _response$json3 = response.json;
      var entries = _response$json3.entries;
      var pagination = _response$json3.pagination;
      // NOTE: For a production usage, additional pagination-handling logic would be required to ensure that all entries are fetched.

      console.log('\t\t Successfully requested ContentEntries by typeId from AppGrid\n\t\t Count of entries recieved: ' + chalk.blue(entries.length) + ' out of ' + chalk.blue(pagination.total) + ' total entries.');
    }).catch(function (error) {
      logError('Oops! There was an error while requesting ContentEntries by typeId from AppGrid!', error);
    });
  };

  return getAllEntries().then(getEntryById).then(getEntriesByIds).then(getEntriesByTypeId).then(function () {
    return logExampleCategoryHeader('End AppGrid ContentEntries Examples');
  });
};

var exampleAppGridPlugins = function exampleAppGridPlugins() {
  logExampleCategoryHeader('AppGrid Plugins Examples:');

  var getAllEnabledPlugins = function getAllEnabledPlugins() {
    logExampleHeader('Requesting all enabled plugins from AppGrid');
    return api.plugins.getAllEnabledPlugins(appGridOptions).then(function (plugins) {
      console.log('\t\t Successfully requested all enabled plugins from AppGrid', plugins);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting all enabled plugins from AppGrid!', error);
    });
  };

  return getAllEnabledPlugins().then(function () {
    return logExampleCategoryHeader('End AppGrid Asset Examples');
  });
};

var exampleAppGridSessions = function exampleAppGridSessions() {
  logExampleCategoryHeader('AppGrid Session Examples:');
  var getAppGridSession = function getAppGridSession() {
    logExampleHeader('Requesting a new Session from AppGrid');
    return api.session.getSession(appGridOptions).then(function (newSessionId) {
      console.log('\t\t Successfully requested a new Session from AppGrid.\n\t\t   SessionId: ' + chalk.blue(newSessionId));
      appGridOptions.sessionId = newSessionId; // NOTE: Sessions should be reused as much as possible.
    }).catch(function (error) {
      logError('Oops! There was an error while requesting a new Session from AppGrid!', error);
    });
  };
  var getAppGridStatus = function getAppGridStatus() {
    logExampleHeader('Requesting AppGrid\'s Status');
    return api.session.getStatus(appGridOptions).then(function (response) {
      console.log('\t\t Successfully requested the status from AppGrid', response);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting the status from AppGrid!', error);
    });
  };
  var validateAppGridSession = function validateAppGridSession() {
    logExampleHeader('Validating an AppGrid Session for the following SessionId: \n\t\t  ' + chalk.blue(appGridOptions.sessionId));
    return api.session.validateSession(appGridOptions).then(function (isValid) {
      console.log('\t\t Is this AppGrid Session valid? ' + chalk.blue(isValid));
    }).catch(function (error) {
      logError('Oops! There was an error while attempting to validate the AppGrid Session!', error);
    });
  };
  var updateAppGridSessionUuid = function updateAppGridSessionUuid() {
    var newUuid = api.session.generateUuid();
    logExampleHeader('Updating the UUID associated with an AppGrid Session\n\t\t For the following SessionId: ' + chalk.blue(appGridOptions.sessionId) + ' \n\t\t With the following UUID: ' + chalk.blue(newUuid));
    appGridOptions.uuid = newUuid;
    return api.session.updateSessionUuid(appGridOptions).then(function (response) {
      console.log('\t\t Successfully updated the UUID associated with this AppGrid Session', response);
    }).catch(function (error) {
      logError('Oops! There was an error while attempting to update the UUID associated with this AppGrid Session!', error);
    });
  };

  return getAppGridSession().then(getAppGridStatus).then(validateAppGridSession).then(updateAppGridSessionUuid).then(function () {
    logExampleCategoryHeader('End AppGrid Session Examples');
  });
};

var exampleAppGridUserData = function exampleAppGridUserData() {
  logExampleCategoryHeader('AppGrid UserData Examples:');
  var userName = 'exampleUser';
  var dataKeyToRequest = 'name';
  var dataKeyToSet = 'packageName';
  var dataValueToSet = 'platinum';
  var userProfileData = {
    name: 'Johnny AppGridUser',
    email: 'johnny.appgriduser@email.com',
    favoriteVideoIds: ['abc123', '321abc', 'cba321']
  };

  var setApplicationScopeUserData = function setApplicationScopeUserData() {
    logExampleHeader('Setting Application-Scope User Data on AppGrid');
    return api.userData.setApplicationScopeUserData(appGridOptions, userName, userProfileData) // WARNING: This will either create (if not already existing) or *overwrite* any existing data!
    .then(function () {
      console.log('\t\t Successfully set Application-Scope User Data on AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '. \n\t\t User data sent: ', userProfileData);
    }).catch(function (error) {
      logError('Oops! There was an error while setting Application-Scope User Data on AppGrid!', error);
    });
  };

  var setApplicationGroupScopeUserData = function setApplicationGroupScopeUserData() {
    logExampleHeader('Setting ApplicationGroup-Scope User Data on AppGrid');
    return api.userData.setApplicationGroupScopeUserData(appGridOptions, userName, userProfileData) // WARNING: This will either create (if not already existing) or *overwrite* any existing data!
    .then(function () {
      console.log('\t\t Successfully set ApplicationGroup-Scope User Data on AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '. \n\t\t User data sent: ', userProfileData);
    }).catch(function (error) {
      logError('Oops! There was an error while setting ApplicationGroup-Scope User Data on AppGrid!', error);
    });
  };

  var setApplicationScopeUserDataByKey = function setApplicationScopeUserDataByKey() {
    logExampleHeader('Setting Application-Scope User Data by key on AppGrid');
    return api.userData.setApplicationScopeUserDataByKey(appGridOptions, userName, dataKeyToSet, dataValueToSet).then(function () {
      console.log('\t\t Successfully set Application-Scope User Data by key on AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '.\n\t\t Key used: ' + chalk.blue(dataKeyToSet) + ' \n\t\t Value sent: ' + chalk.blue(dataValueToSet));
    }).catch(function (error) {
      logError('Oops! There was an error while setting Application-Scope User Data by key on AppGrid!', error);
    });
  };

  var setApplicationGroupScopeUserDataByKey = function setApplicationGroupScopeUserDataByKey() {
    logExampleHeader('Setting ApplicationGroup-Scope User Data by key on AppGrid');
    return api.userData.setApplicationGroupScopeUserDataByKey(appGridOptions, userName, dataKeyToSet, dataValueToSet).then(function () {
      console.log('\t\t Successfully set ApplicationGroup-Scope User Data by key on AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '.\n\t\t Key used: ' + chalk.blue(dataKeyToSet) + ' \n\t\t Value sent: ' + chalk.blue(dataValueToSet));
    }).catch(function (error) {
      logError('Oops! There was an error while setting ApplicationGroup-Scope User Data by key on AppGrid!', error);
    });
  };

  var getAllApplicationScopeDataByUser = function getAllApplicationScopeDataByUser() {
    logExampleHeader('Requesting All Application-Scope Data by user from AppGrid');
    return api.userData.getAllApplicationScopeDataByUser(appGridOptions, userName).then(function (data) {
      console.log('\t\t Successfully requested all Application-Scope Data by user from AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '. \n\t\t Data: ', data);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting all Application-Scope Data by user from AppGrid!', error);
    });
  };

  var getAllApplicationGroupScopeDataByUser = function getAllApplicationGroupScopeDataByUser() {
    logExampleHeader('Requesting All ApplicationGroup-Scope Data by user from AppGrid');
    return api.userData.getAllApplicationGroupScopeDataByUser(appGridOptions, userName).then(function (data) {
      console.log('\t\t Successfully requested all ApplicationGroup-Scope Data by user from AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '. \n\t\t Data: ', data);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting all ApplicationGroup-Scope Data by user from AppGrid!', error);
    });
  };

  var getApplicationScopeDataByUserAndKey = function getApplicationScopeDataByUserAndKey() {
    logExampleHeader('Requesting Application-Scope Data by user and key from AppGrid');
    return api.userData.getApplicationScopeDataByUserAndKey(appGridOptions, userName, dataKeyToRequest).then(function (data) {
      console.log('\t\t Successfully requested Application-Scope Data by user and key from AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '.\n\t\t Data key used: ' + chalk.blue(dataKeyToRequest) + '. \n\t\t Data: ', data);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting Application-Scope Data by user and key from AppGrid!', error);
    });
  };

  var getApplicationGroupScopeDataByUserAndKey = function getApplicationGroupScopeDataByUserAndKey() {
    logExampleHeader('Requesting ApplicationGroup-Scope Data by user and key from AppGrid');
    return api.userData.getApplicationGroupScopeDataByUserAndKey(appGridOptions, userName, dataKeyToRequest).then(function (data) {
      console.log('\t\t Successfully requested ApplicationGroup-Scope Data by user and key from AppGrid.\n\t\t Username used: ' + chalk.blue(userName) + '.\n\t\t Data key used: ' + chalk.blue(dataKeyToRequest) + '. \n\t\t Data: ', data);
    }).catch(function (error) {
      logError('Oops! There was an error while requesting ApplicationGroup-Scope Data by user and key from AppGrid!', error);
    });
  };

  return setApplicationScopeUserData().then(setApplicationGroupScopeUserData).then(setApplicationScopeUserDataByKey).then(setApplicationGroupScopeUserDataByKey).then(getAllApplicationScopeDataByUser).then(getAllApplicationGroupScopeDataByUser).then(getApplicationScopeDataByUserAndKey).then(getApplicationGroupScopeDataByUserAndKey).then(function () {
    return logExampleCategoryHeader('End AppGrid UserData Examples');
  });
};

var outputLogo = function outputLogo() {
  console.log();
  console.log();
  console.log(chalk.bgBlack.yellow('********************************************************************************'));
  console.log();
  console.log();
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMMMMMMMMMMMNNNhhyysyyyyyyyyyyyshhdNNNMMMMMMMMMMMMMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMMMMMMMNdhyysoooooooooooooooooooooosyyddNMMMMMMMMMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMMMMmmhysoooooooooooooooooooooooooooooosyhNNMMMMMMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMNmysoooooooooooooooooooooooooooooooooooooosymNMMMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMNhyooooooooooooooooooooooooooooooooooooooooooooyhNMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMNhsooooooooooooooooooooooooooooooooooooooooooooooooyhNMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMNhsooooooooooooooooooooooooooooooooooooooooooooooooooo+shNMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMmyooooooooooooooooooooooooooooooooooooooooooooooooooooooooydMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMsyoooooooooooooooooo+++oooooooooooooooo+++ooooooooooooooooooyyMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMdyooooooooooooooo/-`     `-/oooooooo/-`     `-/oooooooooooooooyhMMM '));
  console.log(chalk.bgBlack.yellow('    MMhhoooooooooooooo+.           .+oooo+.           .+ooooooooooooooydMM '));
  console.log(chalk.bgBlack.yellow('    Mdhoooooooooooooo+`             `+oo+`             `+oooooooooooooohdM '));
  console.log(chalk.bgBlack.yellow('    Ndooooooooooooooo:               :oo:               /oooooooooooooooym '));
  console.log(chalk.bgBlack.yellow('    dyooooooooooooooo/               /oo:               /ooooooooooooooosm '));
  console.log(chalk.bgBlack.yellow('    hooooooooooooooooo.             .ooo/`             .oooooooooooooooood '));
  console.log(chalk.bgBlack.yellow('    doooooooooooooooooo:`         `:oo+.             `:ooooooooooooooooood '));
  console.log(chalk.bgBlack.yellow('    d+oooooooooooooooooo+/-.```.-/+o/.    `-/-.```.-/+oooooooooooooooooo+d '));
  console.log(chalk.bgBlack.yellow('    d+oooooooooooooooooooooooooooo/.    `:+oooooooooooooooooooooooossooo+d '));
  console.log(chalk.bgBlack.yellow('    d+oooooooooooooooooo+/-.```.-.    `:+oo+/-.```.-/+oooooooosssyyyyyoo+d '));
  console.log(chalk.bgBlack.yellow('    doooooooooooooooooo:`           `-+oo+:`         `:ooossyyys+:..sysood '));
  console.log(chalk.bgBlack.yellow('    hooooooooooooooooo.             .ooo+.         `.:+syyso/-`     -sysoy '));
  console.log(chalk.bgBlack.yellow('    myooooooooooooooo/               /oo:      .-/osyso/-`     .+o-  :syyd '));
  console.log(chalk.bgBlack.yellow('    myooooooooooooooo:               :oo: `-/osyyyyo.`    -/+` `oys.  /yyh '));
  console.log(chalk.bgBlack.yellow('    Mdhoooooooooooooo+`             `oosssyys+/-`/yy:     .syo` .sys`  /yy '));
  console.log(chalk.bgBlack.yellow('    MMdyoooooooooooooo+.        `.:+syyso/-`      +ys-     -yy+  .syo`.:sy '));
  console.log(chalk.bgBlack.yellow('    MMMhyooooooooooooooo/-. `-/osyysyy+`     /o+  `oys.     :yy/ `+yysyyyy '));
  console.log(chalk.bgBlack.yellow('    MMMMyyooooooooooooooossyyys+/-``+yy-     :sy/  `syo`    `oyysyyyshhdmN '));
  console.log(chalk.bgBlack.yellow('    MMMMMdyooooooooooosyyso/-`   `  `oys.     /so.  .syo.:+syyyssssydNNMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMNysooooooooosyy-     `os+  .sys.     `   `-oyyyyyssooo+smNMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMNhyoooooooosys.     :yy/  .syo`     :+syyyssoooooooshdMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMNhyooooooosys`     /ys:  -sy+`    .syysooooooooshNMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMNmyooooooyyo      +ys:-+syy/`-/+syyysoooooyhmNMMMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMMMMNNyssooyy/   `-+yyyyyssyyyyyssooooossydNMMMMMMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMMMMMMMNmdyyyy++syyysssoooosssooooosyydmNMMMMMMMMMMMMMMMMMM '));
  console.log(chalk.bgBlack.yellow('    MMMMMMMMMMMMMMMMMMMMMNdyyyysyhyyyyyyyyyyhyyddddNMMMMMMMMMMMMMMMMMMMMMM '));
  console.log();
  console.log(chalk.bgBlack.yellow('       $$$$$$\\                       $$$$$$\\            $$\\       $$\\ '));
  console.log(chalk.bgBlack.yellow('      $$  __$$\\                     $$  __$$\\           \\__|      $$ | '));
  console.log(chalk.bgBlack.yellow('      $$ /  $$ | $$$$$$\\   $$$$$$\\  $$ /  \\__| $$$$$$\\  $$\\  $$$$$$$ | '));
  console.log(chalk.bgBlack.yellow('      $$$$$$$$ |$$  __$$\\ $$  __$$\\ $$ |$$$$\\ $$  __$$\\ $$ |$$  __$$ | '));
  console.log(chalk.bgBlack.yellow('      $$  __$$ |$$ /  $$ |$$ /  $$ |$$ |\\_$$ |$$ |  \\__|$$ |$$ /  $$ | '));
  console.log(chalk.bgBlack.yellow('      $$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |  $$ |$$ |      $$ |$$ |  $$ | '));
  console.log(chalk.bgBlack.yellow('      $$ |  $$ |$$$$$$$  |$$$$$$$  |\\$$$$$$  |$$ |      $$ |\\$$$$$$$ | '));
  console.log(chalk.bgBlack.yellow('      \\__|  \\__|$$  ____/ $$  ____/  \\______/ \\__|      \\__| \\_______| '));
  console.log(chalk.bgBlack.yellow('                $$ |      $$ | '));
  console.log(chalk.bgBlack.yellow('                $$ |      $$ | '));
  console.log(chalk.bgBlack.yellow('                \\__|      \\__| '));
  console.log();
  console.log(chalk.bgBlack.yellow('********************************************************************************'));
  console.log();
  console.log();
};

var runAllExamples = function runAllExamples() {
  outputLogo();
  exampleAppGridSessions().then(exampleAppGridLogging).then(exampleAppGridEvents).then(exampleAppGridMetadata).then(exampleAppGridAssets).then(exampleAppGridContentEntries).then(exampleAppGridPlugins).then(exampleAppGridUserData).catch(function (error) {
    logError('Oops! There was an unhandled error during one of the examples!', error);
  }).then(function () {
    console.log();
    console.log(chalk.bgBlack.yellow('********************************************************************************'));
    console.log(chalk.bgBlack.yellow('\t\t\tDONE WITH ALL EXAMPLES'));
    console.log(chalk.bgBlack.yellow('********************************************************************************'));
  });
};
runAllExamples();