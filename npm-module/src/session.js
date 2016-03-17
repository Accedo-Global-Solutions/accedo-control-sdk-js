import * as sessionHelper from './sessionHelper';
import { getValidatedOptions } from './options';

const invokeSessionHelperFunctionWithValidatedOptions = (options, helperFunction, isSessionValidationSkipped, failOnInvalidSession) => {
  return getValidatedOptions(options, isSessionValidationSkipped, failOnInvalidSession).then((validatedOptions) => {
    return helperFunction(validatedOptions);
  });
};

const generateUuid = sessionHelper.generateUuid;
const getSession = (options) => invokeSessionHelperFunctionWithValidatedOptions(options, sessionHelper.getSession, true);
const getStatus = (options) => invokeSessionHelperFunctionWithValidatedOptions(options, sessionHelper.getStatus);
const validateSession = (options) => invokeSessionHelperFunctionWithValidatedOptions(options, sessionHelper.validateSession, true);
const updateSessionUuid = (options) => invokeSessionHelperFunctionWithValidatedOptions(options, sessionHelper.updateSessionUuid, false, true);

export { generateUuid, getSession, getStatus, updateSessionUuid, validateSession };
