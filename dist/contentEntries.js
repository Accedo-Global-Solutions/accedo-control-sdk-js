'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getEntriesByIds = exports.getEntryById = exports.getAllEntries = undefined;

var _apiHelper = require('./apiHelper');

var _options = require('./options');

var defaultCountOfResults = 20;

var getPaginationQueryParams = function getPaginationQueryParams(offset, countOfResults) {
  return 'offset=' + offset + '&size=' + countOfResults;
};

var getEntryRequestUrl = function getEntryRequestUrl(validatedOptions, relativePath, isPreview, atUtcTime, ids) {
  var requestUrl = validatedOptions.appGridUrl + '/' + relativePath + '?';
  var queryStrings = [];
  if (ids && ids.length) {
    queryStrings.push('ids=' + ids.join(','));
  }
  if (isPreview) {
    queryStrings.push('preview=true');
  }
  if (atUtcTime) {
    queryStrings.push('at=' + atUtcTime.toISOString());
  }
  requestUrl += queryStrings.join('&');
  return requestUrl;
};

var getAllEntries = exports.getAllEntries = function getAllEntries(options) {
  var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
  var countOfResults = arguments.length <= 2 || arguments[2] === undefined ? defaultCountOfResults : arguments[2];

  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = validatedOptions.appGridUrl + '/content/entries?' + getPaginationQueryParams(offset, countOfResults);
    validatedOptions.debugLogger('AppGrid: getAllEntries request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

var getEntryById = exports.getEntryById = function getEntryById(options, id) {
  var isPreview = arguments.length <= 2 || arguments[2] === undefined ? false : arguments[2];
  var atUtcTime = arguments[3];

  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = getEntryRequestUrl(validatedOptions, 'content/entry/' + id, isPreview, atUtcTime);
    validatedOptions.debugLogger('AppGrid: getEntryById request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

// TODO JASON: Test this out!

var getEntriesByIds = exports.getEntriesByIds = function getEntriesByIds(options, ids) {
  var offset = arguments.length <= 2 || arguments[2] === undefined ? 0 : arguments[2];
  var countOfResults = arguments.length <= 3 || arguments[3] === undefined ? defaultCountOfResults : arguments[3];
  var isPreview = arguments.length <= 4 || arguments[4] === undefined ? false : arguments[4];
  var atUtcTime = arguments[5];

  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    var requestUrl = getEntryRequestUrl(validatedOptions, 'content/entries', isPreview, atUtcTime, ids);
    requestUrl += '&' + getPaginationQueryParams(offset, countOfResults);
    validatedOptions.debugLogger('AppGrid: getEntriesByIds request: ' + requestUrl);
    return (0, _apiHelper.grab)(requestUrl, validatedOptions);
  });
};

// TODO JASON: Add functions and examples for the following (refer to AppGrid Docs for details):
// Get Entries by Entry Type ID