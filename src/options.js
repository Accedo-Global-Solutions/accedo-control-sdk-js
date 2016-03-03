// TODO JASON: Figure out how to refactor the console logging calls to something better...

const requiredOptions = [
  'serviceUrl',
  'appId'
];

const optionalOptionDefaults = {
  logLevel: 'info',
  deviceType: 'desktop' // NOTE: This is the assumed-default value for deviceType, corresponding to Web
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

export const validate = (options) => {
  if (!options) { throw new Error('The options object was falsey'); }
  requiredOptions.forEach((option) => validateRequiredOption(options, option));
  Object.keys(optionalOptionDefaults).forEach((option) => setDefaultOptionValueIfNeeded(options, option));
};
