// TODO JASON: improve the console logging used in this file!

import { getQueryString, grabWithoutExtractingResult } from './apiHelper';
import { validate } from './options';

export const sendUsageStartEvent = (options) => {
  validate(options);
  const queryString = getQueryString(options);
  const requestUrl = `${options.serviceUrl}/event/start?${queryString}`;
  console.info(`AppGrid: sendUsageStartEvent request: ${requestUrl}`); // eslint-disable-line no-console
  return grabWithoutExtractingResult(requestUrl)
    .catch(error => console.error('AppGrid: sendUsageStartEvent - Exception: ', error)); // eslint-disable-line no-console
};

export const sendUsageStopEvent = (retentionTimeInSeconds, options) => {
  validate(options);
  const queryString = getQueryString(options);
  const requestUrl = `${options.serviceUrl}/event/quit?retentionTime=${retentionTimeInSeconds}&${queryString}`;
  console.info(`AppGrid: sendUsageStopEvent request: ${requestUrl}`); // eslint-disable-line no-console
  return grabWithoutExtractingResult(requestUrl)
    .catch(error => console.error('AppGrid: sendUsageStopEvent - Exception: ', error)); // eslint-disable-line no-console
};
