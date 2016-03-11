'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAssetStreamById = exports.getAllAssets = undefined;

var _apiHelper = require('./apiHelper');

var _options = require('./options');

var getAllAssets = exports.getAllAssets = function getAllAssets(options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/asset';
    validatedOptions.debugLogger('AppGrid: getAllAssets request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

var getAssetStreamById = exports.getAssetStreamById = function getAssetStreamById(id, options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/asset/' + id;
    validatedOptions.debugLogger('AppGrid: getAssetStreamById request: ' + requestUrl);
    return (0, _apiHelper.grabRaw)(requestUrl, validatedOptions);
  });
};