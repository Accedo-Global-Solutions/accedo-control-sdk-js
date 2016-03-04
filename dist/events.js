'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendUsageStopEvent = exports.sendUsageStartEvent = undefined;

var _apiHelper = require('./apiHelper');

var _options = require('./options');

var sendUsageStartEvent = exports.sendUsageStartEvent = function sendUsageStartEvent(options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var queryString = (0, _apiHelper.getQueryString)(validatedOptions);
    var requestUrl = validatedOptions.serviceUrl + '/event/start?' + queryString;
    validatedOptions.debugLogger('AppGrid: sendUsageStartEvent request: ' + requestUrl); // eslint-disable-line no-console
    return (0, _apiHelper.grabWithoutExtractingResult)(requestUrl);
  });
};

var sendUsageStopEvent = exports.sendUsageStopEvent = function sendUsageStopEvent(retentionTimeInSeconds, options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var queryString = (0, _apiHelper.getQueryString)(validatedOptions);
    var requestUrl = validatedOptions.serviceUrl + '/event/quit?retentionTime=' + retentionTimeInSeconds + '&' + queryString;
    validatedOptions.debugLogger('AppGrid: sendUsageStopEvent request: ' + requestUrl); // eslint-disable-line no-console
    return (0, _apiHelper.grabWithoutExtractingResult)(requestUrl);
  });
};