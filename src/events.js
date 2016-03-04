import { getQueryString, grabWithoutExtractingResult } from './apiHelper';
import { getValidatedOptions } from './options';

export const sendUsageStartEvent = (options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const queryString = getQueryString(validatedOptions);
    const requestUrl = `${validatedOptions.serviceUrl}/event/start?${queryString}`;
    validatedOptions.debugLogger(`AppGrid: sendUsageStartEvent request: ${requestUrl}`); // eslint-disable-line no-console
    return grabWithoutExtractingResult(requestUrl);
  });
};

export const sendUsageStopEvent = (retentionTimeInSeconds, options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const queryString = getQueryString(validatedOptions);
    const requestUrl = `${validatedOptions.serviceUrl}/event/quit?retentionTime=${retentionTimeInSeconds}&${queryString}`;
    validatedOptions.debugLogger(`AppGrid: sendUsageStopEvent request: ${requestUrl}`); // eslint-disable-line no-console
    return grabWithoutExtractingResult(requestUrl);
  });
};
