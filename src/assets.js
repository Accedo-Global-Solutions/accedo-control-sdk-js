import { grab, grabRaw } from './apiHelper';
import { getValidatedOptions } from './options';

export const getAllAssets = (options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/asset`;
    validatedOptions.debugLogger(`AppGrid: getAllAssets request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

export const getAssetStreamById = (id, options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/asset/${id}`;
    validatedOptions.debugLogger(`AppGrid: getAssetStreamById request: ${requestUrl}`);
    return grabRaw(requestUrl, validatedOptions);
  });
};
