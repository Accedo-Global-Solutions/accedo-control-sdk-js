'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendUsageStopEvent = exports.sendUsageStartEvent = undefined;

var _apiHelper = require('./apiHelper');

var _options = require('./options');

// TODO JASON: improve the console logging used in this file!

var sendUsageStartEvent = exports.sendUsageStartEvent = function sendUsageStartEvent(options) {
  (0, _options.validate)(options);
  var queryString = (0, _apiHelper.getQueryString)(options);
  var requestUrl = options.serviceUrl + '/event/start?' + queryString;
  console.info('AppGrid: sendUsageStartEvent request: ' + requestUrl); // eslint-disable-line no-console
  return (0, _apiHelper.grabWithoutExtractingResult)(requestUrl).catch(function (error) {
    return console.error('AppGrid: sendUsageStartEvent - Exception: ', error);
  }); // eslint-disable-line no-console
};

var sendUsageStopEvent = exports.sendUsageStopEvent = function sendUsageStopEvent(retentionTimeInSeconds, options) {
  (0, _options.validate)(options);
  var queryString = (0, _apiHelper.getQueryString)(options);
  var requestUrl = options.serviceUrl + '/event/quit?retentionTime=' + retentionTimeInSeconds + '&' + queryString;
  console.info('AppGrid: sendUsageStopEvent request: ' + requestUrl); // eslint-disable-line no-console
  return (0, _apiHelper.grabWithoutExtractingResult)(requestUrl).catch(function (error) {
    return console.error('AppGrid: sendUsageStopEvent - Exception: ', error);
  }); // eslint-disable-line no-console
};