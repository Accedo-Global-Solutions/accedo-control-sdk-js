import * as sessionHelper from './sessionHelper';
import { getValidatedOptions } from './options';

const generateUuid = sessionHelper.generateUuid;

const getSession = (options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    return sessionHelper.getSession(validatedOptions);
  });
};

const validateSession = (options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    sessionHelper.validateSession(validatedOptions);
  });
};

const updateSessionUuid = (options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    sessionHelper.updateSessionUuid(validatedOptions);
  });
};

export { generateUuid, getSession, updateSessionUuid, validateSession };
