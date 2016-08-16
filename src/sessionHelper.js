// NOTE: This file contains the "private" Session functions for use by other API files.
// The corresponding "public" functions can be found in: session.js

import uuid from 'uuid';

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
  return post(requestUrl, options);
};

const validateSession = (options) => {
  // just check there is a session id for now
  return Promise.resolve(!!options.sessionId);
};

const generateUuid = () => uuid.v4();

export { generateUuid, getSession, validateSession, updateSessionUuid };
