import { grab } from './apiHelper';
import { getValidatedOptions } from './options';

export const getAllEnabledPlugins = (options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/plugins`;
    validatedOptions.debugLogger(`AppGrid: getAllEnabledPlugins request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};
