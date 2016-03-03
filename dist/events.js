'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.sendUsageStopEvent = exports.sendUsageStartEvent = undefined;

var _apiHelper = require('./apiHelper');

var sendUsageStartEvent = exports.sendUsageStartEvent = function sendUsageStartEvent(options) {
  var queryString = (0, _apiHelper.getQueryString)(options);
  var requestUrl = options.serviceUrl + '/event/start?' + queryString;
  console.debug('AppGrid: sendUsageStartEvent request: ' + requestUrl); // eslint-disable-line no-console
  return (0, _apiHelper.grabWithoutExtractingResult)(requestUrl).catch(function (error) {
    return console.error('AppGrid: sendUsageStartEvent - Exception: ', error);
  }); // eslint-disable-line no-console
}; // TODO JASON: improve the console.debug logging used in this file!

var sendUsageStopEvent = exports.sendUsageStopEvent = function sendUsageStopEvent(retentionTimeInSeconds, options) {
  var queryString = (0, _apiHelper.getQueryString)(options);
  var requestUrl = options.serviceUrl + '/event/quit?retentionTime=' + retentionTimeInSeconds + '&' + queryString;
  console.debug('AppGrid: sendUsageStopEvent request: ' + requestUrl); // eslint-disable-line no-console
  return (0, _apiHelper.grabWithoutExtractingResult)(requestUrl).catch(function (error) {
    return console.error('AppGrid: sendUsageStopEvent - Exception: ', error);
  }); // eslint-disable-line no-console
};