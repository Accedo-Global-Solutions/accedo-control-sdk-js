import { grab } from './apiHelper';
import { getValidatedOptions } from './options';

export const getAllApplicationScopeDataByUser = (options, userName) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/user/${userName}`;
    validatedOptions.debugLogger(`AppGrid: getAllApplicationScopeDataByUser request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

export const getApplicationScopeDataByUserAndKey = (options, userName, key) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/user/${userName}/${key}`;
    validatedOptions.debugLogger(`AppGrid: getApplicationScopeDataByUserAndKey request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

export const getAllApplicationGroupScopeDataByUser = (options, userName) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/group/${userName}`;
    validatedOptions.debugLogger(`AppGrid: getAllApplicationGroupScopeDataByUser request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

export const getApplicationGroupScopeDataByUserAndKey = (options, userName, key) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/group/${userName}/${key}`;
    validatedOptions.debugLogger(`AppGrid: getApplicationScopeDataByUserAndKey request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

// TODO JASON: Finish adding the set API calls for UserData here!
