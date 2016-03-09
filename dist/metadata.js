'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getMetadataByKeys = exports.getMetadataByKey = exports.getAllMetadata = undefined;

var _apiHelper = require('./apiHelper');

var _options = require('./options');

var getAllMetadata = exports.getAllMetadata = function getAllMetadata(options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/metadata';
    validatedOptions.debugLogger('AppGrid: getAllMetadata request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

var getMetadataByKey = exports.getMetadataByKey = function getMetadataByKey(key, options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/metadata/' + key;
    validatedOptions.debugLogger('AppGrid: getMetadataByKey request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

var getMetadataByKeys = exports.getMetadataByKeys = function getMetadataByKeys(keys, options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/metadata/' + keys.join(',');
    validatedOptions.debugLogger('AppGrid: getMetadataByKeys request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};