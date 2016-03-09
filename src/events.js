import { post } from './apiHelper';
import { getValidatedOptions } from './options';

export const sendUsageStartEvent = (options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/event/log`;
    const body = {
      eventType: 'START'
    };
    validatedOptions.debugLogger(`AppGrid: sendUsageStartEvent request: ${requestUrl}`);
    return post(requestUrl, validatedOptions, body);
  });
};

export const sendUsageStopEvent = (retentionTimeInSeconds, options) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/event/log`;
    const body = {
      eventType: 'QUIT',
      retentionTime: retentionTimeInSeconds
    };
    validatedOptions.debugLogger(`AppGrid: sendUsageStopEvent request: ${requestUrl}`);
    return post(requestUrl, validatedOptions, body);
  });
};
