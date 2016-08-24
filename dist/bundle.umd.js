(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('uuid'), require('stampit'), require('qs'), require('isomorphic-fetch')) :
  typeof define === 'function' && define.amd ? define(['exports', 'uuid', 'stampit', 'qs', 'isomorphic-fetch'], factory) :
  (factory((global.appgrid = global.appgrid || {}),global.uuidLib,global.stampit,global.qs,global.fetch));
}(this, (function (exports,uuidLib,stampit,qs,fetch) { 'use strict';

uuidLib = 'default' in uuidLib ? uuidLib['default'] : uuidLib;
stampit = 'default' in stampit ? stampit['default'] : stampit;
qs = 'default' in qs ? qs['default'] : qs;
fetch = 'default' in fetch ? fetch['default'] : fetch;

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
var HOST = 'https://appgrid-api.cloud.accedo.tv';
var credentials = 'same-origin'; // NOTE: This option is required in order for Fetch to send cookies
var defaultHeaders = { accept: MIME_TYPE_JSON };

var getForwardedForHeader = function getForwardedForHeader(_ref) {
  var clientIp = _ref.clientIp;

  if (!clientIp) {
    return {};
  }
  return { 'X-FORWARDED-FOR': clientIp };
};

var getSessionHeader = function getSessionHeader(_ref2) {
  var sessionKey = _ref2.sessionKey;

  if (!sessionKey) {
    return {};
  }
  return { 'X-SESSION': sessionKey };
};

var getContentTypeHeader = function getContentTypeHeader() {
  return { 'Content-Type': MIME_TYPE_JSON };
};

var getQueryString = function getQueryString(config) {
  var existingQs = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var defaultQs = {
    appKey: config.appKey,
    uuid: config.deviceId
  };
  if (config.gid) {
    defaultQs.gid = config.gid;
  }
  var qsObject = _extends({}, existingQs, defaultQs);
  var queryString = qs.stringify(qsObject);
  return queryString;
};

var getRequestUrlWithQueryString = function getRequestUrlWithQueryString(path, config) {
  var splitUrl = path.split('?');
  var pathWithoutQs = splitUrl[0];
  var existingQs = qs.parse(splitUrl[1]);
  var queryString = getQueryString(config, existingQs);
  return '' + HOST + pathWithoutQs + '?' + queryString;
};

var getExtraHeaders = function getExtraHeaders(options) {
  return _extends({}, getForwardedForHeader(options), getSessionHeader(options));
};

var getFetch = function getFetch(path, config) {
  var headers = _extends({}, defaultHeaders, getExtraHeaders(config));
  var requestUrl = getRequestUrlWithQueryString(path, config);
  config.log('Sending a GET request to: ' + requestUrl + ' with the following headers', headers);
  return fetch(requestUrl, { credentials: credentials, headers: headers });
};

var grab = function grab(path, config) {
  config.log('Requesting', path);
  return getFetch(path, config).then(function (res) {
    return res.json();
  }).then(function (response) {
    config.log('GET response', response);
    return response;
  });
};

var grabRaw = function grabRaw(path, config) {
  return getFetch(path, config).then(function (response) {
    return response.body;
  });
};

var post = function post(path, config) {
  var body = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var headers = _extends({}, defaultHeaders, getContentTypeHeader(), getExtraHeaders(config));
  var requestUrl = getRequestUrlWithQueryString(path, config);
  config.log('Sending a POST request to: ' + requestUrl + '. With the following headers and body: ', headers, body);
  var options = {
    headers: headers,
    credentials: credentials,
    method: 'post',
    body: JSON.stringify(body)
  };
  return fetch(requestUrl, options).then(function (_ref3) {
    var status = _ref3.status;
    var statusText = _ref3.statusText;

    if (status !== 200) {
      throw new Error('AppGrid POST request returned a non-200 response. Status Code: ' + status + '. Status Text: ' + statusText);
    }
    var result = { status: status, statusText: statusText };
    config.log('POST response: ', { status: status, statusText: statusText });
    return result;
  });
};

var stamp$2 = stampit().methods({
  /**
   * Returns the currently stored sessionKey for this client instance
   * @return {string}  the sessionKey, if any
   */
  getSessionKey: function getSessionKey() {
    return this.props.config.sessionKey;
  },


  /**
   * Create a session and store it for reuse in this client instance
   * @return {promise}  a promise of a string, the sessionKey
   */
  createSession: function createSession() {
    var _this = this;

    // ignore the potential existing session
    this.props.config.sessionKey = null;
    return grab('/session', this.props.config).then(function (json) {
      var sessionKey = json.sessionKey;
      // update the context of this client, adding the session key

      _this.props.config.sessionKey = sessionKey;
      return sessionKey;
    });
  },


  /**
   * If a sessionKey exists, calls the next function, then:
   * - If this failed with a 401 (unauthorized), create a session then retry
   * - Otherwise returns a promise of that function's results
   * If there was no sessionKey, create one before attempting the next function.
   * @private
   * @param {function} next a function that returns a promise
   * @return {promise}  a promise of the result of the next function
   */
  withSessionHandling: function withSessionHandling(next) {
    var _this2 = this;

    // existing session
    if (this.getSessionKey()) {
      return next().then(function (json) {
        var error = json.error;

        if (error && error.status === '401') {
          // expired - recreate one
          return _this2.createSession().then(next);
        }
        // otherwise keep going
        return json;
      });
    }
    // no session - create it first, then launch the next action
    return this.createSession().then(next);
  }
});

function getPathWithQs(path) {
  var params = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];
  var id = params.id;
  var typeId = params.typeId;
  var alias = params.alias;
  var preview = params.preview;
  var at = params.at;
  var offset = params.offset;
  var size = params.size;

  var qsParams = {};
  // The id array must be turned into CSV
  if (id && id.length) {
    qsParams.id = '' + id.join(',');
  }
  // The alias array must be turned into CSV
  if (alias && alias.length) {
    qsParams.alias = '' + alias.join(',');
  }
  // preview is only useful when true
  if (preview) {
    qsParams.preview = true;
  }
  // at is either a string, or a method with toISOString (like a Date) that we use for formatting
  if (typeof at === 'string') {
    qsParams.at = at;
  } else if (at && at.toISOString) {
    qsParams.at = at.toISOString();
  }
  // Add curated and non-curated params
  var queryString = qs.stringify(_extends({}, qsParams, { typeId: typeId, offset: offset, size: size }));
  return path + '?' + queryString;
}

function request(path, params) {
  var _this = this;

  var pathWithQs = getPathWithQs(path, params);
  return this.withSessionHandling(function () {
    return grab(pathWithQs, _this.props.config);
  });
}

var stamp$1 = stampit().methods({
  /**
   * Get all the content entries, based on the given parameters.
   * **DO NOT** use several of id, alias and typeId at the same time - behaviour would be ungaranteed.
   * @param {object} [params] a parameters object
   * @param {boolean} [params.preview] when true, get the preview version
   * @param {string|date} [params.at] when given, get the version at the given time
   * @param {array} [params.id] an array of entry ids (strings)
   * @param {array} [params.alias] an array of entry aliases (strings)
   * @param {string} [params.typeId] only return entries matching this type id
   * @param {number|string} [params.size] limit to that many results per page (limits as per AppGrid API, currently 1 to 50, default 20)
   * @param {number|string} [params.offset] offset the result by that many pages
   * @return {promise}  a promise of an array of entries (objects)
   */
  getEntries: function getEntries(params) {
    return request.call(this, '/content/entries', params);
  },


  /**
   * Get one content entry by id, based on the given parameters.
   * @param {string} id the entry id
   * @param {object} [params] a parameters object
   * @param {boolean} [params.preview] when true, get the preview version
   * @param {string|date} [params.at] when given, get the version at the given time
   * @return {promise}  a promise of an entry (object)
   */
  getEntryById: function getEntryById(id, params) {
    return request.call(this, '/content/entry/' + id, params);
  },


  /**
   * Get one content entry, based on the given parameters.
   * @param {object} alias the entry alias
   * @param {object} [params] a parameters object
   * @param {boolean} [params.preview] when true, get the preview version
   * @param {string|date} [params.at] when given, get the version at the given time
   * @return {promise}  a promise of an entry (object)
   */
  getEntryByAlias: function getEntryByAlias(alias, params) {
    return request.call(this, '/content/entry/alias/' + alias, params);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(stamp$2);

var stamp$3 = stampit().methods({
  /**
   * Get the current application status
   * @return {promise}  a promise of the application status (string)
   */
  getApplicationStatus: function getApplicationStatus() {
    var _this = this;

    return this.withSessionHandling(function () {
      return grab('/status', _this.props.config);
    });
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(stamp$2);

var stamp$4 = stampit().methods({
  /**
   * Lists all the assets.
   * @return {promise}  a promise of a hash of assets (key: asset name, value: asset URL)
   */
  getAllAssets: function getAllAssets() {
    var _this = this;

    return this.withSessionHandling(function () {
      return grab('/asset', _this.props.config);
    });
  },


  /**
   * Get a stream for one asset by id
   * @param {string} id the asset id
   * @return {promise}  a promise of a node stream
   */
  getAssetById: function getAssetById(id) {
    // note this method does not need a session
    return grabRaw('/asset/' + id, this.props.config);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(stamp$2);

function sendUsageEvent(eventType, retentionTime) {
  var _this = this;

  var payload = { eventType: eventType };
  if (retentionTime !== undefined) {
    payload.retentionTime = retentionTime;
  }
  return this.withSessionHandling(function () {
    return post('/event/log', _this.props.config, payload);
  });
}

var stamp$5 = stampit().methods({
  /**
   * Send a usage START event
   * @return {promise}  a promise denoting the success of the operation
   */
  sendUsageStartEvent: function sendUsageStartEvent() {
    return sendUsageEvent.call(this, 'START');
  },


  /**
   * Send a usage QUIT event
   * @param {number|string} [retentionTimeInSeconds] the retention time, in seconds
   * @return {promise}  a promise denoting the success of the operation
   */
  sendUsageStopEvent: function sendUsageStopEvent(retentionTimeInSeconds) {
    return sendUsageEvent.call(this, 'QUIT', retentionTimeInSeconds);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(stamp$2);

var DEBUG = 'debug';
var INFO = 'info';
var WARN = 'warn';
var ERROR = 'error';

var LOG_LEVELS = [DEBUG, INFO, WARN, ERROR];

var getConcatenatedCode = function getConcatenatedCode() {
  var facilityCode = arguments.length <= 0 || arguments[0] === undefined ? 0 : arguments[0];
  var errorCode = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  return parseInt('' + facilityCode + errorCode, 10);
};

var getLogMessage = function getLogMessage(message, metadata) {
  return message + (!metadata ? '' : ' | Metadata: ' + JSON.stringify(metadata));
};

var getLogEvent = function getLogEvent() {
  var details = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var metadata = arguments[1];

  var message = getLogMessage(details.message, metadata);
  var code = getConcatenatedCode(details.facilityCode, details.errorCode);
  var dimensions = {
    dim1: details.dim1,
    dim2: details.dim2,
    dim3: details.dim3,
    dim4: details.dim4
  };
  return {
    code: code,
    message: message,
    dimensions: dimensions
  };
};

var getCurrentTimeOfDayDimValue = function getCurrentTimeOfDayDimValue() {
  var hour = new Date().getHours();
  // NOTE: These strings are expected by AppGrid
  switch (true) {
    case hour >= 1 && hour < 5:
      return '01-05';
    case hour >= 5 && hour < 9:
      return '05-09';
    case hour >= 9 && hour < 13:
      return '09-13';
    case hour >= 13 && hour < 17:
      return '13-17';
    case hour >= 17 && hour < 21:
      return '17-21';
    default:
      return '21-01';
  }
};

function request$1(path) {
  var _this = this;

  return this.withSessionHandling(function () {
    return grab(path, _this.props.config);
  });
}

function postLog(level, log) {
  var _this2 = this;

  return this.withSessionHandling(function () {
    return post('/application/log/' + level, _this2.props.config, log);
  });
}

var stamp$6 = stampit().methods({
  /**
   * Get the current log level
   * @return {promise}  a promise of the log level (string)
   */
  getLogLevel: function getLogLevel() {
    return request$1.call(this, '/application/log/level').then(function (json) {
      return json.logLevel;
    });
  },

  /**
   * Send a log with the given level, details and extra metadata.
   * @param {string} level the log level
   * @param {object} details the log information
   * @param {string} details.message the log message
   * @param {string} details.facilityCode the facility code
   * @param {errorCode} details.errorCode the error code
   * @param {string} details.dim1 the dimension 1 information
   * @param {string} details.dim2 the dimension 2 information
   * @param {string} details.dim3 the dimension 3 information
   * @param {string} details.dim4 the dimension 4 information
   * @param {array} [metadata] an array of extra metadata (will go through JSON.stringify)
   * @return {promise}  a promise of the success of the operation
   */
  sendLog: function sendLog(level, details) {
    if (!LOG_LEVELS.includes(level)) {
      return Promise.reject('Unsupported log level');
    }

    for (var _len = arguments.length, metadata = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      metadata[_key - 2] = arguments[_key];
    }

    var log = getLogEvent(details, metadata);
    return postLog.call(this, level, log);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(stamp$2);

var stamp$7 = stampit().methods({
  /**
   * Get all the enabled plugins
   * @return {promise}  a promise of the requested data
   */
  getAllEnabledPlugins: function getAllEnabledPlugins() {
    var _this = this;

    return this.withSessionHandling(function () {
      return grab('/plugins', _this.props.config);
    });
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(stamp$2);

var stamp$8 = stampit().methods({
  /**
   * Get the profile information
   * @return {promise}  a promise of the requested data
   */

  getProfileInfo: function getProfileInfo() {
    var _this = this;

    return this.withSessionHandling(function () {
      return grab('/profile', _this.props.config);
    });
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(stamp$2);

function request$2(path) {
  var _this = this;

  return this.withSessionHandling(function () {
    return grab(path, _this.props.config);
  });
}

var stamp$9 = stampit().methods({
  /**
   * Get all the metadata
   * @return {promise}  a promise of the requested data
   */
  getAllMetadata: function getAllMetadata() {
    return request$2.call(this, '/metadata');
  },


  /**
   * Get the metadata by a specific key
   * @param {string} key a key to get specific metadata
   * @return {promise}  a promise of the requested data
   */
  getMetadataByKey: function getMetadataByKey(key) {
    return request$2.call(this, '/metadata/' + key);
  },


  /**
   * Get the metadata by specific keys
   * @param {array} keys an array of keys (strings)
   * @return {promise}  a promise of the requested data
   */
  getMetadataByKeys: function getMetadataByKeys(keys) {
    return request$2.call(this, '/metadata/' + keys.join(','));
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(stamp$2);

var APPLICATION_SCOPE = 'user';
var APPLICATION_GROUP_SCOPE = 'group';

function requestGet(path) {
  var _this = this;

  return this.withSessionHandling(function () {
    return grab(path, _this.props.config);
  });
}

function requestPost(path, data) {
  var _this2 = this;

  return this.withSessionHandling(function () {
    return post(path, _this2.props.config, data);
  });
}

function getAllDataByUser(scope, userName) {
  return requestGet.call(this, '/' + scope + '/' + userName);
}

function getDataByUserAndKey(scope, userName, key) {
  return requestGet.call(this, '/' + scope + '/' + userName + '/' + key + '?json=true');
}

function setUserData(scope, userName, data) {
  return requestPost.call(this, '/' + scope + '/' + userName, data);
}

function setUserDataByKey(scope, userName, key, data) {
  return requestPost.call(this, '/' + scope + '/' + userName + '/' + key, data);
}

var stamp$10 = stampit().methods({
  /**
   * Get all the application-scope data for a given user
   * @param {string} userName an appgrid user
   * @return {promise}  a promise of the requested data
   */
  getAllApplicationScopeDataByUser: function getAllApplicationScopeDataByUser(userName) {
    return getAllDataByUser.call(this, APPLICATION_SCOPE, userName);
  },


  /**
   * Get all the application-group-scope data for a given user
   * @param {string} userName an appgrid user
   * @return {promise}  a promise of the requested data
   */
  getAllApplicationGroupScopeDataByUser: function getAllApplicationGroupScopeDataByUser(userName) {
    return getAllDataByUser.call(this, APPLICATION_GROUP_SCOPE, userName);
  },


  /**
   * Get all the application-scope data for a given user and data key
   * @param {string} userName an appgrid user
   * @param {string} key a key to specify what data to obtain
   * @return {promise}  a promise of the requested data
   */
  getApplicationScopeDataByUserAndKey: function getApplicationScopeDataByUserAndKey(userName, key) {
    return getDataByUserAndKey.call(this, APPLICATION_SCOPE, userName, key);
  },


  /**
   * Get all the application-group-scope data for a given user
   * @param {string} userName an appgrid user
   * @param {string} key a key to specify what data to obtain
   * @return {promise}  a promise of the requested data
   */
  getApplicationGroupScopeDataByUserAndKey: function getApplicationGroupScopeDataByUserAndKey(userName, key) {
    return getDataByUserAndKey.call(this, APPLICATION_GROUP_SCOPE, userName, key);
  },


  /**
   * Set the application-scope data for a given user
   * @param {string} userName an appgrid user
   * @param {object} data the data to store
   * @return {promise}  a promise of the requested data
   */
  setApplicationScopeUserData: function setApplicationScopeUserData(userName, data) {
    return setUserData.call(this, APPLICATION_SCOPE, userName, data);
  },


  /**
   * Set the application-group-scope data for a given user
   * @param {string} userName an appgrid user
   * @param {object} data the data to store
   * @return {promise}  a promise of the requested data
   */
  setApplicationGroupScopeUserData: function setApplicationGroupScopeUserData(userName, data) {
    return setUserData.call(this, APPLICATION_GROUP_SCOPE, userName, data);
  },


  /**
   * Set the application-scope data for a given user
   * @param {string} userName an appgrid user
   * @param {string} key a key to specify what data to obtain
   * @param {object} data the data to store
   * @return {promise}  a promise of the requested data
   */
  setApplicationScopeUserDataByKey: function setApplicationScopeUserDataByKey(userName, key, data) {
    return setUserDataByKey.call(this, APPLICATION_SCOPE, userName, key, data);
  },


  /**
   * Set the application-group-scope data for a given user
   * @param {string} userName an appgrid user
   * @param {string} key a key to specify what data to obtain
   * @param {object} data the data to store
   * @return {promise}  a promise of the requested data
   */
  setApplicationGroupScopeUserDataByKey: function setApplicationGroupScopeUserDataByKey(userName, key, data) {
    return setUserDataByKey.call(this, APPLICATION_GROUP_SCOPE, userName, key, data);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(stamp$2);

// Simply compose all the stamps in one single stamp to give access to all methods
var stamp = stampit().compose(stamp$2, stamp$1, stamp$3, stamp$4, stamp$5, stamp$6, stamp$7, stamp$8, stamp$9, stamp$10);

var noop = function noop() {};

/**
 * Globally available (use `import { generateUuid } from 'appgrid'`)
 * Generate a UUID.
 * Use this for a device/appKey tuple when you do not have a sessionKey already.
 * @function
 * @return {string} a new UUID
 */
var generateUuid = function generateUuid() {
  return uuidLib.v4();
};

/**
 * Check the parameters given are good enough to make api calls
 * @function
 * @param  {string} $0.appKey        the application key
 * @param  {string} [$0.deviceId]        a deviceId identifying the client we will make requests for
 * @param  {string} [$0.sessionKey]  a session key corresponding to this deviceId/appKey tuple
 * @return {boolean}                 true when all is well
 * @private
 */
var checkUsability = function checkUsability() {
  var _ref = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var appKey = _ref.appKey;
  var deviceId = _ref.deviceId;
  var sessionKey = _ref.sessionKey;
  return appKey && !deviceId && !sessionKey || appKey && deviceId && !sessionKey || appKey && deviceId && sessionKey;
};

/**
 * Factory function to create an instance of an AppGrid client.
 * You must get an instance before accessing any of the exposed client APIs.
 * @function
 * @param  {object} config the configuration for the new instance
 * @param  {string} config.appKey the application Key
 * @param  {string} [config.deviceId] the device identifier (if not provided, a uuid will be generated instead)
 * @param  {string} [config.sessionKey] the sessionKey (note a new one may be created when not given or expired)
 * @param  {string} [config.log] a function to use to see this SDK's logs
 * @return {client}        an AppGrid client tied to the given params
 * @example
 * import factory from 'appgrid';
 *
 * // when all info is available - use all of it !
 * const client = factory({ appKey: 'MY_APP_KEY', deviceId: 'DEVICE_ID', sessionKey: 'SOME_SESSION_KEY' });
 *
 * // when there is no known sessionKey yet
 * const client2 = factory({ appKey: 'MY_APP_KEY', deviceId: 'DEVICE_ID' });
 *
 * // when there is no known sessionKey or deviceId yet
 * const client3 = factory({ appKey: 'MY_APP_KEY' });
 */
var factory = function factory(config) {
  var gid = config.gid;
  var appKey = config.appKey;
  var sessionKey = config.sessionKey;
  var _config$log = config.log;
  var log = _config$log === undefined ? noop : _config$log;
  var deviceId = config.deviceId;
  // First, check the params are OK

  if (!checkUsability(config)) {
    throw new Error('You must provide an appKey | an appKey and a deviceId | an appKey, a deviceId and a sessionKey');
  }
  // Generate a uuid if no deviceId was given
  if (!deviceId) {
    deviceId = generateUuid();
  }

  return stamp({
    props: { config: { deviceId: deviceId, gid: gid, appKey: appKey, sessionKey: sessionKey, log: log } }
  });
};

exports.generateUuid = generateUuid;
exports['default'] = factory;
exports.getCurrentTimeOfDayDimValue = getCurrentTimeOfDayDimValue;

Object.defineProperty(exports, '__esModule', { value: true });

})));