import * as sessionHelper from './sessionHelper';

const requiredOptions = [
  'appGridUrl',
  'appId'
];

const optionalOptionDefaults = {
  logLevel: 'info',
  uuid: () => sessionHelper.generateUuid()
};

const validateRequiredOption = (options, option) => {
  if (options[option]) { return; }
  const errorMessage = `AppGrid Fatal Error: Required option: ${option} was not found.`;
  throw new Error(errorMessage);
};

const setDefaultOptionValueIfNeeded = (options, option) => {
  if (options[option]) { return; }
  const defaultOption = optionalOptionDefaults[option];
  options[option] = (typeof defaultOption === 'function') ? defaultOption() : defaultOption;
  options.debugLogger(`AppGrid: Default value of: ${options[option]} was used for: ${option}`);
};

const getDebugOutput = (options) => {
  const noOp = () => {};
  if (!options || typeof options.debugLogger !== 'function') { return noOp; }
  return options.debugLogger;
};

const getNewSession = (options) => {
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
      if (!isValid) {
        if (failOnInvalidSession) { throw new Error('This AppGrid API call requires a valid session!'); }
        return getNewSession(options);
      }
      options.debugLogger('AppGrid: Session is valid.');
      return options;
    });
};

export const getValidatedOptions = (options, isSessionValidationSkipped, failOnInvalidSession) => {
  if (!options) {
    return Promise.reject(new Error('The options object was falsey'));
  }

  options.debugLogger = getDebugOutput(options);
  requiredOptions.forEach((option) => validateRequiredOption(options, option));
  Object.keys(optionalOptionDefaults).forEach((option) => setDefaultOptionValueIfNeeded(options, option));
  return validateAndUpdateSessionIdIfNeeded(options, isSessionValidationSkipped, failOnInvalidSession);
};
