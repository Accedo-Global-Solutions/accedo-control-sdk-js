// TODO JASON: Determine what to remove from this file

// TODO JASON: Figure out how to include the AppGrid service URI and appId into the options

// TODO JASON: Add validation here

import fetch from 'isomorphic-fetch';
import qs from 'qs';

const MIME_TYPE_JSON = 'application/json';
const credentials = 'same-origin'; // NOTE: This option is required in order for Fetch to send cookies
const defaultHeaders = { accept: MIME_TYPE_JSON }; // NOTE: never mutate this default object !

const checkStatus = res => { // TODO JASON: Determine whether this is needed, and update it if so
  if (res.status >= 200 && res.status < 300) { return res; }
  const errorMessage = `AppGrid Response Error: ${res.statusText}`;
  throw new Error(errorMessage);
};

const extractJsonAndAddTimestamp = res => {
  const time = Date.now();
  return res.json()
    .then(json => ({ time, json }));
};

export const noCacheHeaderName = 'X-NO-CACHE';
const getNoCacheHeader = () => ({ [noCacheHeaderName]: 'true' });

export const grabWithoutExtractingResult = (requestUrl, extraHeaders) => {
  const headers = !extraHeaders ? defaultHeaders : { ...defaultHeaders, ...extraHeaders };
  return fetch(requestUrl, { credentials, headers })
    .then(checkStatus);
};

export const grab = (...args) => {
  return grabWithoutExtractingResult(...args)
    .then(extractJsonAndAddTimestamp);
};

export const post = (requestUrl, body) => {
  const options = {
    headers: { 'Content-Type': MIME_TYPE_JSON },
    credentials,
    method: 'post',
    body: JSON.stringify(body)
  };
  return fetch(requestUrl, options)
    .then(checkStatus);
};

export const getExtraHeaders = options => { // TODO JASON: Determine whether this is needed, and update it if so
  if (!options || options.noCache !== 'true') { return; }
  return getNoCacheHeader();
};

export const getQueryString = options => { // TODO JASON: Determine whether this is needed, and update it if so
  if (!options) { return; }
  const queryString = qs.stringify({
    clientIp: options.clientIp,
    gid: options.gid,
    text: options.text,
    pageSize: options.pageSize,
    pageNumber: options.pageNumber
  });
  return queryString;
};

export const getOptions = ({ apiOptions, state }) => { // TODO JASON: Determine whether this is needed, and update it if so
  const { routing: { location: { query: queryParams = {} } = {} } = {} } = state || {};
  return {
    clientIp: apiOptions && apiOptions.clientIp,
    gid: (apiOptions && apiOptions.gid) || queryParams.gid,
    noCache: (apiOptions && apiOptions.noCache) || queryParams.nocache
  };
};
