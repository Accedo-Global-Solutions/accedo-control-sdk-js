import { grab } from './apiHelper';
import { getValidatedOptions } from './options';

export const getAllMetadata = (options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/metadata`;
    validatedOptions.debugLogger(`AppGrid: getAllMetadata request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

export const getMetadataByKey = (options, key) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/metadata/${key}`;
    validatedOptions.debugLogger(`AppGrid: getMetadataByKey request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

export const getMetadataByKeys = (options, keys) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/metadata/${keys.join(',')}`;
    validatedOptions.debugLogger(`AppGrid: getMetadataByKeys request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};
