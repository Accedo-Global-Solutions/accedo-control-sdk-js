// TODO JASON: Figure out how to refactor the console logging calls to something better...

const requiredOptions = [
  'serviceUrl',
  'appId'
];

const optionalOptionDefaults = {
  logLevel: 'info'
};

const validateRequiredOption = (options, option) => {
  if (options[option]) { return; }
  const errorMessage = `AppGrid Fatal Error: Required option: ${option} was not found.`;
  throw new Error(errorMessage);
};

const setDefaultOptionValueIfNeeded = (options, option) => {
  if (options[option]) { return; }
  options[option] = optionalOptionDefaults[option];
  console.info(`AppGrid: Default value of: ${options[option]} was used for: ${option}`); // eslint-disable-line no-console
};

const getDebugOutput = (options) => {
  const noOp = () => {};
  if (!options || !options.debugLogger || typeof options.debugLogger !== 'function') { return noOp; }
  return options.debugLogger;
};

export const getValidatedOptions = (options) => {
  return new Promise((resolve, reject) => {
    if (!options) {
      reject(new Error('The options object was falsey'));
      return;
    }
    requiredOptions.forEach((option) => validateRequiredOption(options, option));
    Object.keys(optionalOptionDefaults).forEach((option) => setDefaultOptionValueIfNeeded(options, option));
    options.debugLogger = getDebugOutput(options);
    resolve(options);
  });
};
