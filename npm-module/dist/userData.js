'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.setApplicationGroupScopeUserDataByKey = exports.setApplicationScopeUserDataByKey = exports.setApplicationGroupScopeUserData = exports.setApplicationScopeUserData = exports.getApplicationGroupScopeDataByUserAndKey = exports.getApplicationScopeDataByUserAndKey = exports.getAllApplicationGroupScopeDataByUser = exports.getAllApplicationScopeDataByUser = undefined;

var _apiHelper = require('./apiHelper');

var _options = require('./options');

var applicationScopePath = 'user';
var applicationGroupScopePath = 'group';

var getAllDataByUser = function getAllDataByUser(options, scope, userName) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/' + scope + '/' + userName;
    validatedOptions.debugLogger('AppGrid: getAllDataByUser request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

var getDataByUserAndKey = function getDataByUserAndKey(options, scope, userName, key) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/' + scope + '/' + userName + '/' + key + '?json=true';
    validatedOptions.debugLogger('AppGrid: getDataByUserAndKey request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

var setUserData = function setUserData(options, scope, userName, data) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/' + scope + '/' + userName;
    validatedOptions.debugLogger('AppGrid: setUserData request: ' + requestUrl);
    return (0, _apiHelper.post)(requestUrl, validatedOptions, data);
  });
};

var setUserDataByKey = function setUserDataByKey(options, scope, userName, key, value) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/' + scope + '/' + userName + '/' + key;
    validatedOptions.debugLogger('AppGrid: setUserDataByKey request: ' + requestUrl);
    return (0, _apiHelper.post)(requestUrl, validatedOptions, value);
  });
};

var getAllApplicationScopeDataByUser = exports.getAllApplicationScopeDataByUser = function getAllApplicationScopeDataByUser(options, userName) {
  return getAllDataByUser(options, applicationScopePath, userName);
};

var getAllApplicationGroupScopeDataByUser = exports.getAllApplicationGroupScopeDataByUser = function getAllApplicationGroupScopeDataByUser(options, userName) {
  return getAllDataByUser(options, applicationGroupScopePath, userName);
};

var getApplicationScopeDataByUserAndKey = exports.getApplicationScopeDataByUserAndKey = function getApplicationScopeDataByUserAndKey(options, userName, key) {
  return getDataByUserAndKey(options, applicationScopePath, userName, key);
};

var getApplicationGroupScopeDataByUserAndKey = exports.getApplicationGroupScopeDataByUserAndKey = function getApplicationGroupScopeDataByUserAndKey(options, userName, key) {
  return getDataByUserAndKey(options, applicationGroupScopePath, userName, key);
};

var setApplicationScopeUserData = exports.setApplicationScopeUserData = function setApplicationScopeUserData(options, userName, data) {
  return setUserData(options, applicationScopePath, userName, data);
};

var setApplicationGroupScopeUserData = exports.setApplicationGroupScopeUserData = function setApplicationGroupScopeUserData(options, userName, data) {
  return setUserData(options, applicationGroupScopePath, userName, data);
};

var setApplicationScopeUserDataByKey = exports.setApplicationScopeUserDataByKey = function setApplicationScopeUserDataByKey(options, userName, key, value) {
  return setUserDataByKey(options, applicationScopePath, userName, key, value);
};

var setApplicationGroupScopeUserDataByKey = exports.setApplicationGroupScopeUserDataByKey = function setApplicationGroupScopeUserDataByKey(options, userName, key, value) {
  return setUserDataByKey(options, applicationGroupScopePath, userName, key, value);
};