// NOTE: This file contains the "private" Session functions for use by other API files.
// The corresponding "public" functions can be found in: session.js

import uuid from 'uuid';
import { rawGetStatus } from './application';

import { grab, post } from './apiHelper';

const getSession = (options) => {
  options.debugLogger(`AppGrid: Requesting a new session for the following UUID: ${options.uuid}`);
  const requestUrl = `${options.appGridUrl}/session`;
  return grab(requestUrl, options).then((response) => {
    return response.json.sessionKey;
  });
};

const updateSessionUuid = (options) => {
  const requestUrl = `${options.appGridUrl}/session`;
  return post(requestUrl, options).then((response) => {
    return response;
  });
};

const validateSession = (options) => {
  if (!options.sessionId) { return Promise.resolve(false); }
  return rawGetStatus(options)
    .then((response) => {
      return !response.json.error;
    })
    .catch(() => false);
};

const generateUuid = () => uuid.v4();

export { generateUuid, getSession, validateSession, updateSessionUuid };
