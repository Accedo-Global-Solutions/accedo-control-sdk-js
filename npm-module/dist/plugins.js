'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAllEnabledPlugins = undefined;

var _apiHelper = require('./apiHelper');

var _options = require('./options');

var getAllEnabledPlugins = exports.getAllEnabledPlugins = function getAllEnabledPlugins(options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/plugins';
    validatedOptions.debugLogger('AppGrid: getAllEnabledPlugins request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};