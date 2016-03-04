'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// TODO JASON: Figure out how to refactor the console logging calls to something better...

var requiredOptions = ['serviceUrl', 'appId'];

var optionalOptionDefaults = {
  logLevel: 'info'
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
  options[option] = optionalOptionDefaults[option];
  console.info('AppGrid: Default value of: ' + options[option] + ' was used for: ' + option); // eslint-disable-line no-console
};

var getDebugOutput = function getDebugOutput(options) {
  var noOp = function noOp() {};
  if (!options || !options.debugLogger || typeof options.debugLogger !== 'function') {
    return noOp;
  }
  return options.debugLogger;
};

var getValidatedOptions = exports.getValidatedOptions = function getValidatedOptions(options) {
  return new Promise(function (resolve, reject) {
    if (!options) {
      reject(new Error('The options object was falsey'));
      return;
    }
    requiredOptions.forEach(function (option) {
      return validateRequiredOption(options, option);
    });
    Object.keys(optionalOptionDefaults).forEach(function (option) {
      return setDefaultOptionValueIfNeeded(options, option);
    });
    options.debugLogger = getDebugOutput(options);
    resolve(options);
  });
};