// TODO JASON: Update these calls to include the appKey & sessionId!

import { getQueryString, grabWithoutExtractingResult } from './apiHelper';
import { getValidatedOptions } from './options';

export const sendUsageStartEvent = (options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const queryString = getQueryString(validatedOptions);
    const requestUrl = `${validatedOptions.appGridUrl}/event/start?${queryString}`;
    validatedOptions.debugLogger(`AppGrid: sendUsageStartEvent request: ${requestUrl}`);
    return grabWithoutExtractingResult(requestUrl);
  });
};

export const sendUsageStopEvent = (retentionTimeInSeconds, options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const queryString = getQueryString(validatedOptions);
    const requestUrl = `${validatedOptions.appGridUrl}/event/quit?retentionTime=${retentionTimeInSeconds}&${queryString}`;
    validatedOptions.debugLogger(`AppGrid: sendUsageStopEvent request: ${requestUrl}`);
    return grabWithoutExtractingResult(requestUrl);
  });
};
