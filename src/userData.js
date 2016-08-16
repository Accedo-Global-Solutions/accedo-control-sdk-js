import { grab, post } from './apiHelper';
import { getValidatedOptions } from './options';

const APPLICATION_SCOPE = 'user';
const APPLICATION_GROUP_SCOPE = 'group';

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

export const getAllApplicationScopeDataByUser = (options, userName) => getAllDataByUser(options, APPLICATION_SCOPE, userName);

export const getAllApplicationGroupScopeDataByUser = (options, userName) => getAllDataByUser(options, APPLICATION_GROUP_SCOPE, userName);

export const getApplicationScopeDataByUserAndKey = (options, userName, key) => getDataByUserAndKey(options, APPLICATION_SCOPE, userName, key);

export const getApplicationGroupScopeDataByUserAndKey = (options, userName, key) => getDataByUserAndKey(options, APPLICATION_GROUP_SCOPE, userName, key);

export const setApplicationScopeUserData = (options, userName, data) => setUserData(options, APPLICATION_SCOPE, userName, data);

export const setApplicationGroupScopeUserData = (options, userName, data) => setUserData(options, APPLICATION_GROUP_SCOPE, userName, data);

export const setApplicationScopeUserDataByKey = (options, userName, key, value) => setUserDataByKey(options, APPLICATION_SCOPE, userName, key, value);

export const setApplicationGroupScopeUserDataByKey = (options, userName, key, value) => setUserDataByKey(options, APPLICATION_GROUP_SCOPE, userName, key, value);
