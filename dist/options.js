'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// TODO JASON: Figure out how to refactor the console.debug() calls to something better...

var requiredOptions = ['serviceUrl'];

var optionalOptionDefaults = {
  logLevel: 'info',
  deviceType: 'desktop' // NOTE: This is the assumed-default value for deviceType, corresponding to Web
};

var validateRequiredOption = function validateRequiredOption(options, option) {
  if (options[option]) {
    return;
  }
  throw new Error('AppGrid Fatal Error: Required option: ' + option + ' was not found.');
};

var setDefaultOptionValueIfNeeded = function setDefaultOptionValueIfNeeded(options, option) {
  if (options[option]) {
    return;
  }
  options[option] = optionalOptionDefaults[option];
  console.debug('AppGrid: Default value of: ' + options[option] + ' was used for: ' + option); // eslint-disable-line no-console
};

var validate = exports.validate = function validate(options) {
  if (!options) {
    throw new Error('The options object was falsey');
  }
  requiredOptions.forEach(function (option) {
    return validateRequiredOption(options, option);
  });
  Object.keys(optionalOptionDefaults).forEach(function (option) {
    return setDefaultOptionValueIfNeeded(options, option);
  });
};