import fetch from 'isomorphic-fetch';
import qs from 'qs';
import uuid from 'uuid';

var _extends = Object.assign || function (target) {
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
  var qsObject = _extends({}, existingQs, defaultQs);
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
  return _extends({}, getForwardedForHeader(options), getSessionHeader(options), getNoCacheHeader(options));
};

var getFetchRequest = function getFetchRequest(url, options) {
  var headers = _extends({}, defaultHeaders, getExtraHeaders(options));
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

  var headers = _extends({}, defaultHeaders, getContentTypeHeader(), getExtraHeaders(options));
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

var rawGetStatus = function rawGetStatus(options) {
  return grab(options.appGridUrl + '/status', options);
};

var getStatus = function getStatus(options) {
  return getValidatedOptions(options).then(rawGetStatus);
};



var application = Object.freeze({
  getStatus: getStatus,
  rawGetStatus: rawGetStatus
});

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

var validateSession = function validateSession(options) {
  if (!options.sessionId) {
    return Promise.resolve(false);
  }
  return rawGetStatus(options).then(function (response) {
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

var getProfileInfo = function getProfileInfo(options) {
  return getValidatedOptions(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/profile';
    validatedOptions.debugLogger('AppGrid: getProfileInfo request: ' + requestUrl);
    return grab(requestUrl, validatedOptions);
  });
};

var profile = Object.freeze({
  getProfileInfo: getProfileInfo
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

var getSession$1 = function getSession$$(options) {
  return invokeSessionHelperFunctionWithValidatedOptions(options, getSession, true);
};
var validateSession$1 = function validateSession$$(options) {
  return invokeSessionHelperFunctionWithValidatedOptions(options, validateSession, true);
};
var updateSessionUuid$1 = function updateSessionUuid$$(options) {
  return invokeSessionHelperFunctionWithValidatedOptions(options, updateSessionUuid, false, true);
};



var session = Object.freeze({
  getSession: getSession$1,
  updateSessionUuid: updateSessionUuid$1,
  validateSession: validateSession$1,
  generateUuid: generateUuid
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
  profile: profile,
  plugins: plugins,
  session: session,
  application: application,
  userData: userData
};

export default api;