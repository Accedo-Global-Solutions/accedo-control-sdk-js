'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setApplicationScopeUserDataByKey = exports.setApplicationScopeUserData = exports.getApplicationGroupScopeDataByUserAndKey = exports.getAllApplicationGroupScopeDataByUser = exports.getApplicationScopeDataByUserAndKey = exports.getAllApplicationScopeDataByUser = undefined;

var _apiHelper = require('./apiHelper');

var _options = require('./options');

/* *********************
   * GET UserData Calls:
   *********************/

var getAllApplicationScopeDataByUser = exports.getAllApplicationScopeDataByUser = function getAllApplicationScopeDataByUser(options, userName) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/user/' + userName;
    validatedOptions.debugLogger('AppGrid: getAllApplicationScopeDataByUser request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

var getApplicationScopeDataByUserAndKey = exports.getApplicationScopeDataByUserAndKey = function getApplicationScopeDataByUserAndKey(options, userName, key) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/user/' + userName + '/' + key + '?json=true';
    validatedOptions.debugLogger('AppGrid: getApplicationScopeDataByUserAndKey request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

var getAllApplicationGroupScopeDataByUser = exports.getAllApplicationGroupScopeDataByUser = function getAllApplicationGroupScopeDataByUser(options, userName) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/group/' + userName;
    validatedOptions.debugLogger('AppGrid: getAllApplicationGroupScopeDataByUser request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

var getApplicationGroupScopeDataByUserAndKey = exports.getApplicationGroupScopeDataByUserAndKey = function getApplicationGroupScopeDataByUserAndKey(options, userName, key) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/group/' + userName + '/' + key + '?json=true';
    validatedOptions.debugLogger('AppGrid: getApplicationScopeDataByUserAndKey request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

/* *******************
 * SET UserData Calls:
 *********************/

var setApplicationScopeUserData = exports.setApplicationScopeUserData = function setApplicationScopeUserData(options, userName, data) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/user/' + userName;
    validatedOptions.debugLogger('AppGrid: setUserData request: ' + requestUrl);
    return (0, _apiHelper.post)(requestUrl, validatedOptions, data);
  });
};

var setApplicationScopeUserDataByKey = exports.setApplicationScopeUserDataByKey = function setApplicationScopeUserDataByKey(options, userName, key, value) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/user/' + userName + '/' + key;
    validatedOptions.debugLogger('AppGrid: setApplicationScopeUserDataByKey request: ' + requestUrl);
    return (0, _apiHelper.post)(requestUrl, validatedOptions, value);
  });
};

// TODO JASON: Finish adding the set API calls for UserData here!

// Set user data (application group scope)
//       POST /group/{user}

// Set user data (group scope) for key
//       POST /group/{user}/{key}