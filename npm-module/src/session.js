import * as sessionHelper from './sessionHelper';
import { getValidatedOptions } from './options';


const invokeSessionHelperFunctionWithValidatedOptions = (options, helperFunction, isSessionValidationSkipped, failOnInvalidSession) => {
  return getValidatedOptions(options, isSessionValidationSkipped, failOnInvalidSession).then((validatedOptions) => {
    return helperFunction(validatedOptions);
  });
};

const getSession = (options) => invokeSessionHelperFunctionWithValidatedOptions(options, sessionHelper.getSession, true);
const validateSession = (options) => invokeSessionHelperFunctionWithValidatedOptions(options, sessionHelper.validateSession, true);
const updateSessionUuid = (options) => invokeSessionHelperFunctionWithValidatedOptions(options, sessionHelper.updateSessionUuid, false, true);

export { generateUuid } from './sessionHelper.js';
export { getSession, updateSessionUuid, validateSession };
