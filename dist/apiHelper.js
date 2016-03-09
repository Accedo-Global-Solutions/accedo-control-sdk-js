'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.post = exports.grab = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var MIME_TYPE_JSON = 'application/json';
var credentials = 'same-origin'; // NOTE: This option is required in order for Fetch to send cookies
var defaultHeaders = { accept: MIME_TYPE_JSON };

var extractJsonAndAddTimestamp = function extractJsonAndAddTimestamp(response) {
  var time = Date.now();
  return response.json().then(function (json) {
    if (json.error) {
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
  var queryString = _qs2.default.stringify(qsObject);
  return queryString;
};

var getRequestUrlWithQueryString = function getRequestUrlWithQueryString(url, options) {
  var splitUrl = url.split('?');
  var urlWithoutQs = splitUrl[0];
  var existingQs = _qs2.default.parse(splitUrl[1]);
  var queryString = getQueryString(options, existingQs);
  return urlWithoutQs + '?' + queryString;
};

var getExtraHeaders = function getExtraHeaders(options) {
  return _extends({}, getForwardedForHeader(options), getSessionHeader(options), getNoCacheHeader(options));
};

var grab = exports.grab = function grab(url, options) {
  var headers = _extends({}, defaultHeaders, getExtraHeaders(options));
  var requestUrl = getRequestUrlWithQueryString(url, options);
  options.debugLogger('Sending a GET request to: ' + requestUrl + '. With the following headers: ', headers);
  return (0, _isomorphicFetch2.default)(requestUrl, { credentials: credentials, headers: headers }).then(extractJsonAndAddTimestamp).then(function (response) {
    options.debugLogger('GET response: ', response);
    return response;
  });
};

var post = exports.post = function post(url, options) {
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
  return (0, _isomorphicFetch2.default)(requestUrl, requestOptions).then(function (_ref4) {
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