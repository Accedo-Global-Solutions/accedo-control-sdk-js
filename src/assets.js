import { grab } from './apiHelper';
import { getValidatedOptions } from './options';

export const getAllAssets = (options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/asset`;
    validatedOptions.debugLogger(`AppGrid: getAllAssets request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

export const downloadAssetById = (id, options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/asset/${id}`;
    validatedOptions.debugLogger(`AppGrid: downloadAssetById request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions); // TODO JASON: Figure out how to update this to handle downloading an asset.
  });
};
