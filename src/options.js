// TODO JASON: Figure out how to refactor the console.debug() calls to something better...

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
  throw new Error(`AppGrid Fatal Error: Required option: ${option} was not found.`);
};

const setDefaultOptionValueIfNeeded = (options, option) => {
  if (options[option]) { return; }
  options[option] = optionalOptionDefaults[option];
  console.debug(`AppGrid: Default value of: ${options[option]} was used for: ${option}`); // eslint-disable-line no-console
};

export const validate = (options) => {
  if (!options) { throw new Error('The options object was falsey'); }
  requiredOptions.forEach((option) => validateRequiredOption(options, option));
  Object.keys(optionalOptionDefaults).forEach((option) => setDefaultOptionValueIfNeeded(options, option));
};
