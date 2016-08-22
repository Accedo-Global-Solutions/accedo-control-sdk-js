import uuidLib from 'uuid';
import stampit from 'stampit';
import qs from 'qs';
import fetch from 'isomorphic-fetch';

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
    uuid: config.uuid
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
  getSessionKey: function getSessionKey() {
    return this.props.config.sessionKey;
  },
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
  // params should contain any/several of { id, alias, preview, at, typeId, offset, size }
  // do not use id, alias or typeId at the same time - behaviour would be ungaranteed

  getEntries: function getEntries(params) {
    return request.call(this, '/content/entries', params);
  },


  // params should contain any/several of { preview, at }
  getEntryById: function getEntryById(id, params) {
    return request.call(this, '/content/entry/' + id, params);
  },


  // params should contain any/several of { preview, at }
  getEntryByAlias: function getEntryByAlias(alias, params) {
    return request.call(this, '/content/entry/alias/' + alias, params);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(stamp$2);

var stamp$3 = stampit().methods({
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
  getAllAssets: function getAllAssets() {
    var _this = this;

    return this.withSessionHandling(function () {
      return grab('/asset', _this.props.config);
    });
  },
  getAssetStreamById: function getAssetStreamById(id) {
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
  sendUsageStartEvent: function sendUsageStartEvent() {
    return sendUsageEvent.call(this, 'START');
  },
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
  var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var metadata = arguments[1];

  var message = getLogMessage(options.message, metadata);
  var code = getConcatenatedCode(options.facilityCode, options.errorCode);
  var dimensions = {
    dim1: options.dim1,
    dim2: options.dim2,
    dim3: options.dim3,
    dim4: options.dim4
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
  getLogLevel: function getLogLevel() {
    return request$1.call(this, '/application/log/level').then(function (json) {
      return json.logLevel;
    });
  },
  sendLog: function sendLog(level, options) {
    if (!LOG_LEVELS.includes(level)) {
      return Promise.reject('Unsupported log level');
    }

    for (var _len = arguments.length, metadata = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      metadata[_key - 2] = arguments[_key];
    }

    var log = getLogEvent(options, metadata);
    return postLog.call(this, level, log);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(stamp$2);

var stamp$7 = stampit().methods({
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
  getAllMetadata: function getAllMetadata() {
    return request$2.call(this, '/metadata');
  },
  getMetadataByKey: function getMetadataByKey(key) {
    return request$2.call(this, '/metadata/' + key);
  },
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
  getAllApplicationScopeDataByUser: function getAllApplicationScopeDataByUser(userName) {
    return getAllDataByUser.call(this, APPLICATION_SCOPE, userName);
  },
  getAllApplicationGroupScopeDataByUser: function getAllApplicationGroupScopeDataByUser(userName) {
    return getAllDataByUser.call(this, APPLICATION_GROUP_SCOPE, userName);
  },
  getApplicationScopeDataByUserAndKey: function getApplicationScopeDataByUserAndKey(userName, key) {
    return getDataByUserAndKey.call(this, APPLICATION_SCOPE, userName, key);
  },
  getApplicationGroupScopeDataByUserAndKey: function getApplicationGroupScopeDataByUserAndKey(userName, key) {
    return getDataByUserAndKey.call(this, APPLICATION_GROUP_SCOPE, userName, key);
  },
  setApplicationScopeUserData: function setApplicationScopeUserData(userName, data) {
    return setUserData.call(this, APPLICATION_SCOPE, userName, data);
  },
  setApplicationGroupScopeUserData: function setApplicationGroupScopeUserData(userName, data) {
    return setUserData.call(this, APPLICATION_GROUP_SCOPE, userName, data);
  },
  setApplicationScopeUserDataByKey: function setApplicationScopeUserDataByKey(userName, key, value) {
    return setUserDataByKey.call(this, APPLICATION_SCOPE, userName, key, value);
  },
  setApplicationGroupScopeUserDataByKey: function setApplicationGroupScopeUserDataByKey(userName, key, value) {
    return setUserDataByKey.call(this, APPLICATION_GROUP_SCOPE, userName, key, value);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(stamp$2);

var stamp = stampit().compose(stamp$2, stamp$1, stamp$3, stamp$4, stamp$5, stamp$6, stamp$7, stamp$8, stamp$9, stamp$10);

var noop = function noop() {};

// an AppGrid Client is usable if there is a known sessionKey or both an uuid and an appKey
var checkUsability = function checkUsability() {
  var config = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  return !!config.sessionKey || config.uuid && config.appKey;
};

var factory = function factory(config) {
  var uuid = config.uuid;
  var gid = config.gid;
  var appKey = config.appKey;
  var sessionKey = config.sessionKey;
  var _config$log = config.log;
  var log = _config$log === undefined ? noop : _config$log;

  if (!checkUsability(config)) {
    throw new Error('You must provide at least a sessionKey, or both a uuid and an appKey');
  }

  return stamp({
    props: { config: { uuid: uuid, gid: gid, appKey: appKey, sessionKey: sessionKey, log: log } }
  });
};

var generateUuid = function generateUuid() {
  return uuidLib.v4();
};

export { generateUuid, getCurrentTimeOfDayDimValue };export default factory;