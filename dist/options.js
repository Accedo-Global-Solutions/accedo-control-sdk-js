'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getValidatedOptions = undefined;

var _uuid2 = require('uuid');

var _uuid3 = _interopRequireDefault(_uuid2);

var _sessionHelper = require('./sessionHelper');

var sessionHelper = _interopRequireWildcard(_sessionHelper);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var requiredOptions = ['appGridUrl', 'appId'];

var optionalOptionDefaults = {
  logLevel: 'info',
  uuid: function uuid() {
    return _uuid3.default.v1();
  }
};

var validateRequiredOption = function validateRequiredOption(options, option) {
  if (options[option]) {
    return;
  }
  var errorMessage = 'AppGrid Fatal Error: Required option: ' + option + ' was not found.';
  throw new Error(errorMessage);
};

var setDefaultOptionValueIfNeeded = function setDefaultOptionValueIfNeeded(options, option) {
  if (options[option]) {
    return;
  }
  options[option] = typeof optionalOptionDefaults[option] === 'function' ? options[option] = optionalOptionDefaults[option]() : options[option] = optionalOptionDefaults[option];
  options.debugLogger('AppGrid: Default value of: ' + options[option] + ' was used for: ' + option);
};

var getDebugOutput = function getDebugOutput(options) {
  var noOp = function noOp() {};
  if (!options || !options.debugLogger || typeof options.debugLogger !== 'function') {
    return noOp;
  }
  return options.debugLogger;
};

var getNewSession = function getNewSession(options) {
  options.debugLogger('AppGrid: Requesting a new Session');
  return sessionHelper.getSession(options).then(function (sessionId) {
    options.sessionId = sessionId;
    return options;
  });
};

var validateAndUpdateSessionIdIfNeeded = function validateAndUpdateSessionIdIfNeeded(options) {
  // TODO JASON: Excersize this function...
  if (!options.sessionId) {
    return getNewSession(options);
  }
  return sessionHelper.validateSession(options).then(function (isValid) {
    if (!isValid) {
      return getNewSession(options);
    }
    options.debugLogger('AppGrid: Session is valid.');
    return options;
  });
};

var getValidatedOptions = exports.getValidatedOptions = function getValidatedOptions(options) {
  return new Promise(function (resolve, reject) {
    if (!options) {
      reject(new Error('The options object was falsey'));
      return;
    }
    options.debugLogger = getDebugOutput(options);
    requiredOptions.forEach(function (option) {
      return validateRequiredOption(options, option);
    });
    Object.keys(optionalOptionDefaults).forEach(function (option) {
      return setDefaultOptionValueIfNeeded(options, option);
    });
    validateAndUpdateSessionIdIfNeeded(options).then(function (validatedOptions) {
      resolve(validatedOptions);
    }).catch(reject);
  });
};