import { grab, post } from './apiHelper';
import { getValidatedOptions } from './options';

const applicationScopePath = 'user';
const applicationGroupScopePath = 'group';

const getAllDataByUser = (options, scope, userName) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/${scope}/${userName}`;
    validatedOptions.debugLogger(`AppGrid: getAllDataByUser request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

const getDataByUserAndKey = (options, scope, userName, key) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/${scope}/${userName}/${key}?json=true`;
    validatedOptions.debugLogger(`AppGrid: getDataByUserAndKey request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

const setUserData = (options, scope, userName, data) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/${scope}/${userName}`;
    validatedOptions.debugLogger(`AppGrid: setUserData request: ${requestUrl}`);
    return post(requestUrl, validatedOptions, data);
  });
};

const setUserDataByKey = (options, scope, userName, key, value) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/${scope}/${userName}/${key}`;
    validatedOptions.debugLogger(`AppGrid: setUserDataByKey request: ${requestUrl}`);
    return post(requestUrl, validatedOptions, value);
  });
};

export const getAllApplicationScopeDataByUser = (options, userName) => getAllDataByUser(options, applicationScopePath, userName);

export const getAllApplicationGroupScopeDataByUser = (options, userName) => getAllDataByUser(options, applicationGroupScopePath, userName);

export const getApplicationScopeDataByUserAndKey = (options, userName, key) => getDataByUserAndKey(options, applicationScopePath, userName, key);

export const getApplicationGroupScopeDataByUserAndKey = (options, userName, key) => getDataByUserAndKey(options, applicationGroupScopePath, userName, key);

export const setApplicationScopeUserData = (options, userName, data) => setUserData(options, applicationScopePath, userName, data);

export const setApplicationGroupScopeUserData = (options, userName, data) => setUserData(options, applicationGroupScopePath, userName, data);

export const setApplicationScopeUserDataByKey = (options, userName, key, value) => setUserDataByKey(options, applicationScopePath, userName, key, value);

export const setApplicationGroupScopeUserDataByKey = (options, userName, key, value) => setUserDataByKey(options, applicationGroupScopePath, userName, key, value);
