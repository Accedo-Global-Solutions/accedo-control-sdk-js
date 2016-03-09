'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendUsageStopEvent = exports.sendUsageStartEvent = undefined;

var _apiHelper = require('./apiHelper');

var _options = require('./options');

// TODO JASON: Update these calls to include the appKey & sessionId!

var sendUsageStartEvent = exports.sendUsageStartEvent = function sendUsageStartEvent(options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/event/start';
    validatedOptions.debugLogger('AppGrid: sendUsageStartEvent request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

var sendUsageStopEvent = exports.sendUsageStopEvent = function sendUsageStopEvent(retentionTimeInSeconds, options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/event/quit?retentionTime=' + retentionTimeInSeconds;
    validatedOptions.debugLogger('AppGrid: sendUsageStopEvent request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};