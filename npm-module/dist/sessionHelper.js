'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSessionUuid = exports.validateSession = exports.getStatus = exports.getSession = exports.generateUuid = undefined;

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _apiHelper = require('./apiHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// NOTE: This file contains the "private" Session functions for us by other API files.
// The corresponding "public" functions can be found in: session.js

var getSession = function getSession(options) {
  options.debugLogger('AppGrid: Requesting a new session for the following UUID: ' + options.uuid);
  var requestUrl = options.appGridUrl + '/session';
  return (0, _apiHelper.grab)(requestUrl, options).then(function (response) {
    return response.json.sessionKey;
  });
};

var updateSessionUuid = function updateSessionUuid(options) {
  var requestUrl = options.appGridUrl + '/session';
  return (0, _apiHelper.post)(requestUrl, options).then(function (response) {
    return response;
  });
};

var getStatus = function getStatus(options) {
  var requestUrl = options.appGridUrl + '/status';
  return (0, _apiHelper.grab)(requestUrl, options);
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
  return _uuid2.default.v4();
};

exports.generateUuid = generateUuid;
exports.getSession = getSession;
exports.getStatus = getStatus;
exports.validateSession = validateSession;
exports.updateSessionUuid = updateSessionUuid;