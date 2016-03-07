'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateSessionUuid = exports.validateSession = exports.getSession = exports.generateUuid = undefined;

var _uuid = require('uuid');

var _uuid2 = _interopRequireDefault(_uuid);

var _apiHelper = require('./apiHelper');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO JASON: Determine what to do with the following commented-lines
// const appGridTimeFormat = 'YYYYMMDDTHH:mm:ssZZ'; // The format AppGrid uses to represent expiration time for sessions
// const appGridOfflineStatus = 'OFFLINE';

// TODO JASON: Finish updating this file

// NOTE: This file contains the "private" Session functions for us by other API files.
// The corresponding "public" functions can be found in: session.js

var getSession = function getSession(options) {
  // TODO JASON: Update this function!
  options.debugLogger('AppGrid: Requesting a new session for the following UUID: ' + options.uuid);
  var requestUrl = options.appGridUrl + '/session';
  // TODO JASON: Figure out how to update the headers here!
  // headers: createHeadersFor(request)
  return (0, _apiHelper.grab)(requestUrl, options).then(function (response) {
    // TODO JASON: Update this function and kill the commented-code!
    console.log('DEBUG ~~~~~~~~~~~~~~ getSession response: '); // eslint-disable-line no-console // TODO JASON: Kill this line!
    console.dir(response); // eslint-disable-line no-console // TODO JASON: Kill this line!
    return response.json.sessionKey;
    // var responseJson = response.body;
    // responseJson.expirationMoment = moment(responseJson.expiration, APPGRID_TIME_FORMAT);
    // delete responseJson.expiration;
    // request.session.appgridSession = responseJson;
    // deferred.resolve(responseJson);
    // delete sessionPromiseCache[uuid];
  });
};

var updateSessionUuid = function updateSessionUuid(options) {
  // TODO JASON: Update this function!
  var requestUrl = options.appGridUrl + '/session';
  (0, _apiHelper.post)(requestUrl, options).then(function (response) {
    console.log('DEBUG ~~~~~~~~~~~~~~ updateSessionUuid response: '); // eslint-disable-line no-console // TODO JASON: Kill this line!
    console.dir(response); // eslint-disable-line no-console // TODO JASON: Kill this line!
    return response; // TODO JASON: Confirm what to return here
  });
};

var validateSession = function validateSession(options) {
  var requestUrl = options.appGridUrl + '/status';
  return (0, _apiHelper.grab)(requestUrl, options).then(function () {
    return true;
  }).catch(function () {
    return false;
  });
};

var generateUuid = function generateUuid() {
  return _uuid2.default.v1();
};

exports.generateUuid = generateUuid;
exports.getSession = getSession;
exports.validateSession = validateSession;
exports.updateSessionUuid = updateSessionUuid;