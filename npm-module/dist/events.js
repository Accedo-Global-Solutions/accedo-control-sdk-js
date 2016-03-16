'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendUsageStopEvent = exports.sendUsageStartEvent = undefined;

var _apiHelper = require('./apiHelper');

var _options = require('./options');

var sendUsageStartEvent = exports.sendUsageStartEvent = function sendUsageStartEvent(options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/event/log';
    var body = {
      eventType: 'START'
    };
    validatedOptions.debugLogger('AppGrid: sendUsageStartEvent request: ' + requestUrl);
    return (0, _apiHelper.post)(requestUrl, validatedOptions, body);
  });
};

var sendUsageStopEvent = exports.sendUsageStopEvent = function sendUsageStopEvent(options, retentionTimeInSeconds) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/event/log';
    var body = {
      eventType: 'QUIT',
      retentionTime: retentionTimeInSeconds
    };
    validatedOptions.debugLogger('AppGrid: sendUsageStopEvent request: ' + requestUrl);
    return (0, _apiHelper.post)(requestUrl, validatedOptions, body);
  });
};