import { post } from './apiHelper';
import { getValidatedOptions } from './options';

const sendUsageEvent = (options, eventType, retentionTime) =>
  getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/event/log`;
    const body = { eventType };
    if (retentionTime !== undefined) { body.retentionTime = retentionTime; }
    validatedOptions.debugLogger(`AppGrid: sendUsageStartEvent request: ${requestUrl}`);
    return post(requestUrl, validatedOptions, body);
  })
;

export const sendUsageStartEvent = (options) =>
  sendUsageEvent(options, 'START');

export const sendUsageStopEvent = (options, retentionTimeInSeconds) =>
  sendUsageEvent(options, 'QUIT', retentionTimeInSeconds);
