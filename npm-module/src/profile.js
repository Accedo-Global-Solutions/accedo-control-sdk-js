import { grab } from './apiHelper';
import { getValidatedOptions } from './options';

export const getProfileInfo = (options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/profile`;
    validatedOptions.debugLogger(`AppGrid: getProfileInfo request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};
