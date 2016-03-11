'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateSession = exports.updateSessionUuid = exports.getStatus = exports.getSession = exports.generateUuid = undefined;

var _sessionHelper = require('./sessionHelper');

var sessionHelper = _interopRequireWildcard(_sessionHelper);

var _options = require('./options');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

var invokeSessionHelperFunctionWithValidatedOptions = function invokeSessionHelperFunctionWithValidatedOptions(options, helperFunction, isSessionValidationSkipped, failOnInvalidSession) {
  return (0, _options.getValidatedOptions)(options, isSessionValidationSkipped, failOnInvalidSession).then(function (validatedOptions) {
    return helperFunction(validatedOptions);
  });
};

var generateUuid = sessionHelper.generateUuid;
var getSession = function getSession(options) {
  return invokeSessionHelperFunctionWithValidatedOptions(options, sessionHelper.getSession, true);
};
var getStatus = function getStatus(options) {
  return invokeSessionHelperFunctionWithValidatedOptions(options, sessionHelper.getStatus);
};
var validateSession = function validateSession(options) {
  return invokeSessionHelperFunctionWithValidatedOptions(options, sessionHelper.validateSession, true);
};
var updateSessionUuid = function updateSessionUuid(options) {
  return invokeSessionHelperFunctionWithValidatedOptions(options, sessionHelper.updateSessionUuid, false, true);
};

exports.generateUuid = generateUuid;
exports.getSession = getSession;
exports.getStatus = getStatus;
exports.updateSessionUuid = updateSessionUuid;
exports.validateSession = validateSession;