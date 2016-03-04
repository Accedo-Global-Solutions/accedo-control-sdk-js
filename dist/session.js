'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateSession = exports.updateSessionUuid = exports.getSession = exports.generateUuid = undefined;

var _sessionHelper = require('./sessionHelper');

var sessionHelper = _interopRequireWildcard(_sessionHelper);

var _options = require('./options');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var generateUuid = sessionHelper.generateUuid;

var getSession = function getSession(options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    return sessionHelper.getSession(validatedOptions);
  });
};

var validateSession = function validateSession(options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    sessionHelper.validateSession(validatedOptions);
  });
};

var updateSessionUuid = function updateSessionUuid(options) {
  return (0, _options.getValidatedOptions)(options).then(function (validatedOptions) {
    sessionHelper.updateSessionUuid(validatedOptions);
  });
};

exports.generateUuid = generateUuid;
exports.getSession = getSession;
exports.updateSessionUuid = updateSessionUuid;
exports.validateSession = validateSession;