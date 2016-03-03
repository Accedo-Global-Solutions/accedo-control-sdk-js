'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getOptions = exports.getQueryString = exports.getExtraHeaders = exports.post = exports.grab = exports.grabWithoutExtractingResult = exports.noCacheHeaderName = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

var _qs = require('qs');

var _qs2 = _interopRequireDefault(_qs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; } // TODO JASON: Determine what to remove from this file

// TODO JASON: Figure out how to include the AppGrid service URI and appId into the options

// TODO JASON: Add validation here

var MIME_TYPE_JSON = 'application/json';
var credentials = 'same-origin'; // NOTE: This option is required in order for Fetch to send cookies
var defaultHeaders = { accept: MIME_TYPE_JSON }; // NOTE: never mutate this default object !

var checkStatus = function checkStatus(res) {
  // TODO JASON: Determine whether this is needed, and update it if so
  if (res.status >= 200 && res.status < 300) {
    return res;
  }
  var isServerError = res.status >= 500;
  throw { statusText: res.statusText, isServerError: isServerError }; // eslint-disable-line no-throw-literal
};

var extractJsonAndAddTimestamp = function extractJsonAndAddTimestamp(res) {
  var time = Date.now();
  return res.json().then(function (json) {
    return { time: time, json: json };
  }).catch(function () {
    throw { statusText: 'JSON Parse Exception' }; // eslint-disable-line no-throw-literal
  });
};

var noCacheHeaderName = exports.noCacheHeaderName = 'X-NO-CACHE';
var getNoCacheHeader = function getNoCacheHeader() {
  return _defineProperty({}, noCacheHeaderName, 'true');
};

var grabWithoutExtractingResult = exports.grabWithoutExtractingResult = function grabWithoutExtractingResult(requestUrl, extraHeaders) {
  var headers = !extraHeaders ? defaultHeaders : _extends({}, defaultHeaders, extraHeaders);
  return (0, _isomorphicFetch2.default)(requestUrl, { credentials: credentials, headers: headers }).then(checkStatus);
};

var grab = exports.grab = function grab() {
  return grabWithoutExtractingResult.apply(undefined, arguments).then(extractJsonAndAddTimestamp);
};

var post = exports.post = function post(requestUrl, body) {
  var options = {
    headers: { 'Content-Type': MIME_TYPE_JSON },
    credentials: credentials,
    method: 'post',
    body: JSON.stringify(body)
  };
  return (0, _isomorphicFetch2.default)(requestUrl, options).then(checkStatus);
};

var getExtraHeaders = exports.getExtraHeaders = function getExtraHeaders(options) {
  // TODO JASON: Determine whether this is needed, and update it if so
  if (!options || options.noCache !== 'true') {
    return;
  }
  return getNoCacheHeader();
};

var getQueryString = exports.getQueryString = function getQueryString(options) {
  // TODO JASON: Determine whether this is needed, and update it if so
  if (!options) {
    return;
  }
  var queryString = _qs2.default.stringify({
    clientIp: options.clientIp,
    gid: options.gid,
    text: options.text,
    pageSize: options.pageSize,
    pageNumber: options.pageNumber
  });
  return queryString;
};

var getOptions = exports.getOptions = function getOptions(_ref2) {
  var apiOptions = _ref2.apiOptions;
  var state = _ref2.state;
  // TODO JASON: Determine whether this is needed, and update it if so

  var _ref3 = state || {};

  var _ref3$routing = _ref3.routing;
  _ref3$routing = _ref3$routing === undefined ? {} : _ref3$routing;
  var _ref3$routing$locatio = _ref3$routing.location;
  _ref3$routing$locatio = _ref3$routing$locatio === undefined ? {} : _ref3$routing$locatio;
  var _ref3$routing$locatio2 = _ref3$routing$locatio.query;
  var queryParams = _ref3$routing$locatio2 === undefined ? {} : _ref3$routing$locatio2;

  return {
    clientIp: apiOptions && apiOptions.clientIp,
    gid: apiOptions && apiOptions.gid || queryParams.gid,
    noCache: apiOptions && apiOptions.noCache || queryParams.nocache
  };
};