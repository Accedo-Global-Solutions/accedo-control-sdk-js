'use strict';

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var uuidLib = _interopDefault(require('uuid'));
var stampit = _interopDefault(require('stampit'));
var qs = _interopDefault(require('qs'));
var fetch = _interopDefault(require('isomorphic-fetch'));

const MIME_TYPE_JSON = 'application/json';
const HOST = 'https://appgrid-api.cloud.accedo.tv';
const credentials = 'same-origin'; // NOTE: This option is required in order for Fetch to send cookies
const defaultHeaders = { accept: MIME_TYPE_JSON };

const getForwardedForHeader = ({ ip }) => {
  if (!ip) { return {}; }
  return { 'X-FORWARDED-FOR': ip };
};

const getSessionHeader = ({ sessionKey }) => {
  if (!sessionKey) { return {}; }
  return { 'X-SESSION': sessionKey };
};

const getContentTypeHeader = () => ({ 'Content-Type': MIME_TYPE_JSON });

const getQueryString = (config, existingQs = {}) => {
  const defaultQs = {
    appKey: config.appKey,
    uuid: config.deviceId
  };
  if (config.gid) { defaultQs.gid = config.gid; }
  const qsObject = Object.assign({}, existingQs, defaultQs);
  const queryString = qs.stringify(qsObject);
  return queryString;
};

const getRequestUrlWithQueryString = (path, config) => {
  const splitUrl = path.split('?');
  const pathWithoutQs = splitUrl[0];
  const existingQs = qs.parse(splitUrl[1]);
  const queryString = getQueryString(config, existingQs);
  return `${HOST}${pathWithoutQs}?${queryString}`;
};

const getExtraHeaders = (config) => {
  return Object.assign({}, getForwardedForHeader(config), getSessionHeader(config));
};

const getFetch = (path, config) => {
  const headers = Object.assign({}, defaultHeaders, getExtraHeaders(config));
  const requestUrl = getRequestUrlWithQueryString(path, config);
  config.log(`Sending a GET request to: ${requestUrl} with the following headers`, headers);
  return fetch(requestUrl, { credentials, headers })
    .then(res => {
      if (res.status >= 400) {
        config.log('GET failed with status', res.status);
        throw res;
      }
      return res;
    });
};

const grab = (path, config) => {
  config.log('Requesting', path);
  return getFetch(path, config)
    .then(res => res.json())
    .then((response) => {
      config.log('GET response', response);
      return response;
    });
};

const grabRaw = (path, config) => {
  return getFetch(path, config)
    .then((response) => {
      return response.body;
    });
};

const post = (path, config, body = {}) => {
  const headers = Object.assign({},
    defaultHeaders,
    getContentTypeHeader(),
    getExtraHeaders(config)
  );
  const requestUrl = getRequestUrlWithQueryString(path, config);
  config.log(`Sending a POST request to: ${requestUrl}. With the following headers and body: `, headers, body);
  const options = {
    headers,
    credentials,
    method: 'post',
    body: JSON.stringify(body)
  };
  return fetch(requestUrl, options)
    .then(({ status, statusText }) => {
      if (status !== 200) { throw new Error(`AppGrid POST request returned a non-200 response. Status Code: ${status}. Status Text: ${statusText}`); }
      const result = { status, statusText };
      config.log('POST response: ', { status, statusText });
      return result;
    });
};

var sessionStamp = stampit()
.init(({ stamp }) => {
  // the promise of a session being created
  let creatingSessionPromise;
  /**
   * Create a session and store it for reuse in this client instance
   * @return {promise}  a promise of a string, the sessionKey
   */
  stamp.fixed.methods.createSession = function createSession() {
    // if we have a promise of a session, return it
    if (creatingSessionPromise) { return creatingSessionPromise; }

    // ignore any existing session
    if (this.props.config.sessionKey) {
      this.props.config.sessionKey = null;
    }

    // launch a request, update the promise
    creatingSessionPromise = grab('/session', this.props.config)
    .then((json) => {
      const { sessionKey } = json;
      // update the context of this client, adding the session key
      this.props.config.sessionKey = sessionKey;
      // we're no longer creating a session
      creatingSessionPromise = null;
      return sessionKey;
    })
    .catch((err) => {
      // we're no longer creating a session
      creatingSessionPromise = null;
      throw err;
    });

    return creatingSessionPromise;
  };
})
.methods({
  /**
   * Returns the currently stored sessionKey for this client instance
   * @return {string}  the sessionKey, if any
   */
  getSessionKey() {
    return this.props.config.sessionKey;
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
  withSessionHandling(next) {
    // existing session
    if (this.getSessionKey()) {
      return next().catch(res => {
        if (res && res.status === 401) {
          // session expired - recreate one then retry
          return this.createSession().then(next);
        }
        // otherwise propagate the failure
        throw res;
      });
    }
    // no session - create it first, then launch the next action
    return this.createSession().then(next);
  }
});

function getPathWithQs(path, params = {}) {
  const { id, typeId, alias, typeAlias, preview, at, offset, size } = params;
  const qsParams = {};
  // The id array must be turned into CSV
  if (id && id.length) { qsParams.id = id.join(','); }
  // The alias array must be turned into CSV
  if (alias && alias.length) { qsParams.alias = alias.join(','); }
  // typeId must be turned into CSV if it is an array, but it could be a string too
  if (typeId && typeId.length) {
    qsParams.typeId = (typeof typeId === 'string') ?
      typeId :
      typeId.join(',');
  }
  // preview is only useful when true
  if (preview) { qsParams.preview = true; }
  // at is either a string, or a method with toISOString (like a Date) that we use for formatting
  if (typeof at === 'string') {
    qsParams.at = at;
  } else if (at && at.toISOString) {
    qsParams.at = at.toISOString();
  }
  // Add curated and non-curated params
  const queryString = qs.stringify(Object.assign({}, qsParams, { typeAlias, offset, size }));
  return `${path}?${queryString}`;
}

function request(path, params) {
  const pathWithQs = getPathWithQs(path, params);
  return this.withSessionHandling(() => grab(pathWithQs, this.props.config));
}

const stamp$2 = stampit()
.methods({
  /**
   * Get all the content entries, based on the given parameters.
   * **DO NOT** use several of id, alias, typeId and typeAlias at the same time - behaviour would be ungaranteed.
   * @param {object} [params] a parameters object
   * @param {boolean} [params.preview] when true, get the preview version
   * @param {string|date} [params.at] when given, get the version at the given time
   * @param {array} [params.id] an array of entry ids (strings)
   * @param {array} [params.alias] an array of entry aliases (strings)
   * @param {string|array} [params.typeId] only return entries of the given type id(s).
   *                                       It can be passed as a single-value string `'type1'`,
   *                                       a CSV string `'type1,type2'` or an array of strings `['type1', 'type2']`
   * @param {string} [params.typeAlias] only return entries whose entry type has this alias
   * @param {number|string} [params.size] limit to that many results per page (limits as per AppGrid API, currently 1 to 50, default 20)
   * @param {number|string} [params.offset] offset the result by that many pages
   * @return {promise}  a promise of an array of entries (objects)
   */
  getEntries(params) {
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
  getEntryById(id, params) {
    return request.call(this, `/content/entry/${id}`, params);
  },

  /**
   * Get one content entry, based on the given parameters.
   * @param {object} alias the entry alias
   * @param {object} [params] a parameters object
   * @param {boolean} [params.preview] when true, get the preview version
   * @param {string|date} [params.at] when given, get the version at the given time
   * @return {promise}  a promise of an entry (object)
   */
  getEntryByAlias(alias, params) {
    return request.call(this, `/content/entry/alias/${alias}`, params);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

const stamp$3 = stampit()
.methods({
  /**
   * Get the current application status
   * @return {promise}  a promise of the application status (string)
   */
  getApplicationStatus() {
    return this.withSessionHandling(() => grab('/status', this.props.config));
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

const stamp$4 = stampit()
.methods({
  /**
   * Lists all the assets.
   * @return {promise}  a promise of a hash of assets (key: asset name, value: asset URL)
   */
  getAllAssets() {
    return this.withSessionHandling(() => grab('/asset', this.props.config));
  },

  /**
   * Get a stream for one asset by id
   * @param {string} id the asset id
   * @return {promise}  a promise of a node stream
   */
  getAssetById(id) {
    // note this method does not need a session
    return grabRaw(`/asset/${id}`, this.props.config);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

function sendUsageEvent(eventType, retentionTime) {
  const payload = { eventType };
  if (retentionTime !== undefined) { payload.retentionTime = retentionTime; }
  return this.withSessionHandling(() => post('/event/log', this.props.config, payload));
}

const stamp$5 = stampit()
.methods({
  /**
   * Send a usage START event
   * @return {promise}  a promise denoting the success of the operation
   */
  sendUsageStartEvent() {
    return sendUsageEvent.call(this, 'START');
  },

  /**
   * Send a usage QUIT event
   * @param {number|string} [retentionTimeInSeconds] the retention time, in seconds
   * @return {promise}  a promise denoting the success of the operation
   */
  sendUsageStopEvent(retentionTimeInSeconds) {
    return sendUsageEvent.call(this, 'QUIT', retentionTimeInSeconds);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

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

function request$1(path) {
  return this.withSessionHandling(() => grab(path, this.props.config));
}

function postLog(level, log) {
  return this.withSessionHandling(() => post(`/application/log/${level}`, this.props.config, log));
}

function postLogs(logs) {
  return this.withSessionHandling(() => post('/application/logs', this.props.config, logs));
}

const stamp$6 = stampit()
.methods({
  /**
   * Get the current log level
   * @return {promise}  a promise of the log level (string)
   */
  getLogLevel() {
    return request$1.call(this, '/application/log/level').then(json => json.logLevel);
  },
  /**
   * Send a log with the given level, details and extra metadata.
   * @param {'debug'|'info'|'warn'|'error'} level the log level
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
   * @param {object[]} logs Log description objects
   * @param {'debug'|'info'|'warn'|'error'} logs[].logType the log type
   * @param {string|number} logs[].timestamp the timestamp for the log,
   *                                           as a UTC ISO 8601 string (ie. '2016-07-04T06:17:21Z'),
   *                                           or a POSIX millisecond number
   * @param {string} logs[].message the log message
   * @param {string} logs[].facilityCode the facility code
   * @param {string} logs[].errorCode the error code
   * @param {string} logs[].dim1 the dimension 1 information
   * @param {string} logs[].dim2 the dimension 2 information
   * @param {string} logs[].dim3 the dimension 3 information
   * @param {string} logs[].dim4 the dimension 4 information
   * @param {any} [logs[].metadata] extra metadata (will go through JSON.stringify).
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

const stamp$7 = stampit()
.methods({
  /**
   * Get all the enabled plugins
   * @return {promise}  a promise of the requested data
   */
  getAllEnabledPlugins() {
    return this.withSessionHandling(() => grab('/plugins', this.props.config));
  }

})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

const stamp$8 = stampit()
.methods({
  /**
   * Get the profile information
   * @return {promise}  a promise of the requested data
   */

  getProfileInfo() {
    return this.withSessionHandling(() => grab('/profile', this.props.config));
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

function request$2(path) {
  return this.withSessionHandling(() => grab(path, this.props.config));
}

const stamp$9 = stampit()
.methods({
  /**
   * Get all the metadata
   * @return {promise}  a promise of the requested data
   */
  getAllMetadata() {
    return request$2.call(this, '/metadata');
  },

  /**
   * Get the metadata by a specific key
   * @param {string} key a key to get specific metadata
   * @return {promise}  a promise of the requested data
   */
  getMetadataByKey(key) {
    return request$2.call(this, `/metadata/${key}`);
  },

  /**
   * Get the metadata by specific keys
   * @param {array} keys an array of keys (strings)
   * @return {promise}  a promise of the requested data
   */
  getMetadataByKeys(keys) {
    return request$2.call(this, `/metadata/${keys.join(',')}`);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

const APPLICATION_SCOPE = 'user';
const APPLICATION_GROUP_SCOPE = 'group';

function requestGet(path) {
  return this.withSessionHandling(() => grab(path, this.props.config));
}

function requestPost(path, data) {
  return this.withSessionHandling(() => post(path, this.props.config, data));
}

function getAllDataByUser(scope, userName) {
  return requestGet.call(this, `/${scope}/${userName}`);
}

function getDataByUserAndKey(scope, userName, key) {
  return requestGet.call(this, `/${scope}/${userName}/${key}?json=true`);
}

function setUserData(scope, userName, data) {
  return requestPost.call(this, `/${scope}/${userName}`, data);
}

function setUserDataByKey(scope, userName, key, data) {
  return requestPost.call(this, `/${scope}/${userName}/${key}`, data);
}

const stamp$10 = stampit()
.methods({
  /**
   * Get all the application-scope data for a given user
   * @param {string} userName an appgrid user
   * @return {promise}  a promise of the requested data
   */
  getAllApplicationScopeDataByUser(userName) {
    return getAllDataByUser.call(this, APPLICATION_SCOPE, userName);
  },

  /**
   * Get all the application-group-scope data for a given user
   * @param {string} userName an appgrid user
   * @return {promise}  a promise of the requested data
   */
  getAllApplicationGroupScopeDataByUser(userName) {
    return getAllDataByUser.call(this, APPLICATION_GROUP_SCOPE, userName);
  },

  /**
   * Get all the application-scope data for a given user and data key
   * @param {string} userName an appgrid user
   * @param {string} key a key to specify what data to obtain
   * @return {promise}  a promise of the requested data
   */
  getApplicationScopeDataByUserAndKey(userName, key) {
    return getDataByUserAndKey.call(this, APPLICATION_SCOPE, userName, key);
  },

  /**
   * Get all the application-group-scope data for a given user
   * @param {string} userName an appgrid user
   * @param {string} key a key to specify what data to obtain
   * @return {promise}  a promise of the requested data
   */
  getApplicationGroupScopeDataByUserAndKey(userName, key) {
    return getDataByUserAndKey.call(this, APPLICATION_GROUP_SCOPE, userName, key);
  },

  /**
   * Set the application-scope data for a given user
   * @param {string} userName an appgrid user
   * @param {object} data the data to store
   * @return {promise}  a promise of the requested data
   */
  setApplicationScopeUserData(userName, data) {
    return setUserData.call(this, APPLICATION_SCOPE, userName, data);
  },

  /**
   * Set the application-group-scope data for a given user
   * @param {string} userName an appgrid user
   * @param {object} data the data to store
   * @return {promise}  a promise of the requested data
   */
  setApplicationGroupScopeUserData(userName, data) {
    return setUserData.call(this, APPLICATION_GROUP_SCOPE, userName, data);
  },

  /**
   * Set the application-scope data for a given user
   * @param {string} userName an appgrid user
   * @param {string} key a key to specify what data to obtain
   * @param {object} data the data to store
   * @return {promise}  a promise of the requested data
   */
  setApplicationScopeUserDataByKey(userName, key, data) {
    return setUserDataByKey.call(this, APPLICATION_SCOPE, userName, key, data);
  },

  /**
   * Set the application-group-scope data for a given user
   * @param {string} userName an appgrid user
   * @param {string} key a key to specify what data to obtain
   * @param {object} data the data to store
   * @return {promise}  a promise of the requested data
   */
  setApplicationGroupScopeUserDataByKey(userName, key, data) {
    return setUserDataByKey.call(this, APPLICATION_GROUP_SCOPE, userName, key, data);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

// Simply compose all the stamps in one single stamp to give access to all methods
const stamp = stampit().compose(
  sessionStamp,
  stamp$2,
  stamp$3,
  stamp$4,
  stamp$5,
  stamp$6,
  stamp$7,
  stamp$8,
  stamp$9,
  stamp$10
);

const noop = () => {};

/**
 * Check the parameters given are good enough to make api calls
 * @function
 * @param  {string} $0.appKey        the application key
 * @param  {string} [$0.deviceId]        a deviceId identifying the client we will make requests for
 * @param  {string} [$0.sessionKey]  a session key corresponding to this deviceId/appKey tuple
 * @return {boolean}                 true when all is well
 * @private
 */
const checkUsability = ({ appKey, deviceId, sessionKey } = {}) =>
  (appKey && !deviceId && !sessionKey) ||
  (appKey && deviceId && !sessionKey) ||
  (appKey && deviceId && sessionKey);

/**
 * Factory function to create an instance of an AppGrid client.
 *
 * You must get an instance before accessing any of the exposed client APIs.
 * @function
 * @param  {object} config the configuration for the new instance
 * @param  {string} config.appKey the application Key
 * @param  {string} [config.deviceId] the device identifier (if not provided, a uuid will be generated instead)
 * @param  {string} [config.sessionKey] the sessionKey (note a new one may be created when not given or expired)
 * @param  {string} [config.ip] the user's IP, given to AppGrid for every request this client will trigger (for geolocation).
 * @param  {function} [config.log] a function to use to see this SDK's logs
 * @param  {function} [config.onDeviceIdGenerated] callback to obtain the new deviceId, if one gets generated
 * @param  {function} [config.onSessionKeyChanged] callback to obtain the sessionKey, anytime a new one gets generated
 * @return {client}        an AppGrid client tied to the given params
 * @example
 * import appgrid from 'appgrid';
 *
 * // when all info is available - use all of it !
 * const client = appgrid({ appKey: 'MY_APP_KEY', deviceId: 'DEVICE_ID', sessionKey: 'SOME_SESSION_KEY' });
 *
 * // when there is no known sessionKey yet
 * const client2 = appgrid({ appKey: 'MY_APP_KEY', deviceId: 'DEVICE_ID' });
 *
 * // when there is no known sessionKey or deviceId yet
 * const client3 = appgrid({ appKey: 'MY_APP_KEY' });
 */
const appgrid = (config) => {
  const { gid, appKey, ip, log = noop, onDeviceIdGenerated = noop, onSessionKeyChanged = noop } = config;
  let { deviceId, sessionKey } = config;
  // First, check the params are OK
  if (!checkUsability(config)) {
    throw new Error('You must provide an appKey | an appKey and a deviceId | an appKey, a deviceId and a sessionKey');
  }
  // Generate a uuid if no deviceId was given
  if (!deviceId) {
    deviceId = appgrid.generateUuid();
    // trigger the callback
    onDeviceIdGenerated(deviceId);
  }

  const stampConfig = { deviceId, gid, ip, appKey, log, onSessionKeyChanged };
  Object.defineProperty(stampConfig, 'sessionKey', {
    set(val) { sessionKey = val; onSessionKeyChanged(val); },
    get() { return sessionKey; }
  });

  return stamp({
    props: { config: stampConfig }
  });
};

/**
 * Generate a UUID.
 *
 * Use this for a device/appKey tuple when you do not have a sessionKey already.
 *
 * This utility method is not used through an appgrid client instance, but available statically
 * @function
 * @return {string} a new UUID
 */
appgrid.generateUuid = () => uuidLib.v4();

module.exports = appgrid;
