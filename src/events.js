// TODO JASON: Update these calls to include the appKey & sessionId!

import { grabWithoutExtractingResult } from './apiHelper';
import { getValidatedOptions } from './options';

export const sendUsageStartEvent = (options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/event/start`;
    validatedOptions.debugLogger(`AppGrid: sendUsageStartEvent request: ${requestUrl}`);
    return grabWithoutExtractingResult(requestUrl, validatedOptions);
  });
};

export const sendUsageStopEvent = (retentionTimeInSeconds, options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/event/quit?retentionTime=${retentionTimeInSeconds}`;
    validatedOptions.debugLogger(`AppGrid: sendUsageStopEvent request: ${requestUrl}`);
    return grabWithoutExtractingResult(requestUrl, validatedOptions);
  });
};
