// TODO JASON: Finish updating this file!

import { grab } from './apiHelper';
import { getValidatedOptions } from './options';

export const getAllMetadata = (options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/metadata`;
    validatedOptions.debugLogger(`AppGrid: getAllMetadata request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};
