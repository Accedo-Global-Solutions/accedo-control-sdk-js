'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getApplicationGroupScopeDataByUserAndKey = exports.getAllApplicationGroupScopeDataByUser = exports.getApplicationScopeDataByUserAndKey = exports.getAllApplicationScopeDataByUser = undefined;

var _apiHelper = require('./apiHelper');

var _options = require('./options');

var getAllApplicationScopeDataByUser = exports.getAllApplicationScopeDataByUser = function getAllApplicationScopeDataByUser(options, userName) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/user/' + userName;
    validatedOptions.debugLogger('AppGrid: getAllApplicationScopeDataByUser request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

var getApplicationScopeDataByUserAndKey = exports.getApplicationScopeDataByUserAndKey = function getApplicationScopeDataByUserAndKey(options, userName, key) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/user/' + userName + '/' + key;
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
    var requestUrl = validatedOptions.appGridUrl + '/group/' + userName + '/' + key;
    validatedOptions.debugLogger('AppGrid: getApplicationScopeDataByUserAndKey request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

// TODO JASON: Finish adding the set API calls for UserData here!