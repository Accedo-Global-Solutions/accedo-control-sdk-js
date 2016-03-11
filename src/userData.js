import { grab, post } from './apiHelper';
import { getValidatedOptions } from './options';


/* *********************
   * GET UserData Calls:
   *********************/

export const getAllApplicationScopeDataByUser = (options, userName) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/user/${userName}`;
    validatedOptions.debugLogger(`AppGrid: getAllApplicationScopeDataByUser request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

export const getApplicationScopeDataByUserAndKey = (options, userName, key) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/user/${userName}/${key}?json=true`;
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
    const requestUrl = `${validatedOptions.appGridUrl}/group/${userName}/${key}?json=true`;
    validatedOptions.debugLogger(`AppGrid: getApplicationScopeDataByUserAndKey request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

/* *******************
 * SET UserData Calls:
 *********************/

export const setApplicationScopeUserData = (options, userName, data) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/user/${userName}`;
    validatedOptions.debugLogger(`AppGrid: setUserData request: ${requestUrl}`);
    return post(requestUrl, validatedOptions, data);
  });
};

export const setApplicationScopeUserDataByKey = (options, userName, key, value) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/user/${userName}/${key}`;
    validatedOptions.debugLogger(`AppGrid: setApplicationScopeUserDataByKey request: ${requestUrl}`);
    return post(requestUrl, validatedOptions, value);
  });
};

// TODO JASON: Finish adding the set API calls for UserData here!

// Set user data (application group scope)
//       POST /group/{user}

// Set user data (group scope) for key
//       POST /group/{user}/{key}
