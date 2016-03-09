'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllMetadata = undefined;

var _apiHelper = require('./apiHelper');

var _options = require('./options');

// TODO JASON: Finish updating this file!

var getAllMetadata = exports.getAllMetadata = function getAllMetadata(options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/metadata';
    validatedOptions.debugLogger('AppGrid: getAllMetadata request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};