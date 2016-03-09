'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadAssetById = exports.getAllAssets = undefined;

var _apiHelper = require('./apiHelper');

var _options = require('./options');

var getAllAssets = exports.getAllAssets = function getAllAssets(options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/asset';
    validatedOptions.debugLogger('AppGrid: getAllAssets request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

var downloadAssetById = exports.downloadAssetById = function downloadAssetById(id, options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/asset/' + id;
    validatedOptions.debugLogger('AppGrid: downloadAssetById request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};