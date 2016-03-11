import uuid from 'uuid';

import * as sessionHelper from './sessionHelper';

const requiredOptions = [
  'appGridUrl',
  'appId'
];

const optionalOptionDefaults = {
  logLevel: 'info',
  uuid: () => uuid.v1()
};

const validateRequiredOption = (options, option) => {
  if (options[option]) { return; }
  const errorMessage = `AppGrid Fatal Error: Required option: ${option} was not found.`;
  throw new Error(errorMessage);
};

const setDefaultOptionValueIfNeeded = (options, option) => {
  if (options[option]) { return; }
  options[option] = (typeof optionalOptionDefaults[option] === 'function') ?
    options[option] = optionalOptionDefaults[option]() : options[option] = optionalOptionDefaults[option];
  options.debugLogger(`AppGrid: Default value of: ${options[option]} was used for: ${option}`);
};

const getDebugOutput = (options) => {
  const noOp = () => {};
  if (!options || !options.debugLogger || typeof options.debugLogger !== 'function') { return noOp; }
  return options.debugLogger;
};

const getNewSession = (options, failOnInvalidSession) => {
  if (failOnInvalidSession) { throw new Error('This AppGrid API call requires a valid session!'); }
  options.debugLogger('AppGrid: Requesting a new Session');
  return sessionHelper.getSession(options)
    .then((sessionId) => {
      options.sessionId = sessionId;
      return options;
    });
};

const validateAndUpdateSessionIdIfNeeded = (options, isSessionValidationSkipped, failOnInvalidSession) => {
  if (isSessionValidationSkipped) { return Promise.resolve(options); }
  return sessionHelper.validateSession(options)
    .then((isValid) => {
      if (!isValid) { return getNewSession(options, failOnInvalidSession); }
      options.debugLogger('AppGrid: Session is valid.');
      return options;
    });
};

export const getValidatedOptions = (options, isSessionValidationSkipped, failOnInvalidSession) => {
  return new Promise((resolve, reject) => {
    if (!options) {
      reject(new Error('The options object was falsey'));
      return;
    }
    options.debugLogger = getDebugOutput(options);
    requiredOptions.forEach((option) => validateRequiredOption(options, option));
    Object.keys(optionalOptionDefaults).forEach((option) => setDefaultOptionValueIfNeeded(options, option));
    validateAndUpdateSessionIdIfNeeded(options, isSessionValidationSkipped, failOnInvalidSession)
      .then((validatedOptions) => {
        resolve(validatedOptions);
      })
      .catch(reject);
  });
};
