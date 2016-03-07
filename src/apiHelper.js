import fetch from 'isomorphic-fetch';
import qs from 'qs';

const MIME_TYPE_JSON = 'application/json';
const credentials = 'same-origin'; // NOTE: This option is required in order for Fetch to send cookies
const defaultHeaders = { accept: MIME_TYPE_JSON };

const extractJsonAndAddTimestamp = res => {
  const time = Date.now();
  return res.json()
    .then(json => ({ time, json }));
};

const getForwardedForHeader = ({ clientIp }) => {
  if (!clientIp) { return {}; }
  return { 'X-FORWARDED-FOR': clientIp };
};

const getSessionHeader = ({ sessionId }) => {
  if (!sessionId) { return {}; }
  return { 'X-SESSION': sessionId };
};

const getNoCacheHeader = ({ noCache }) => {
  if (!noCache) { return {}; }
  return { 'X-NO-CACHE': 'true' };
};

const getContentTypeHeader = () => ({ 'Content-Type': MIME_TYPE_JSON });

const getQueryString = (options, existingQs = {}) => {
  const defaultQs = {
    appKey: options.appId,
    uuid: options.uuid
  };
  const qsObject = { ...existingQs, ...defaultQs };
  const queryString = qs.stringify(qsObject);
  return queryString;
};

const getRequestUrlWithQueryString = (url, options) => {
  const splitUrl = url.split('?');
  const urlWithoutQs = splitUrl[0];
  const existingQs = qs.parse(splitUrl[1]);
  const queryString = getQueryString(options, existingQs);
  return `${urlWithoutQs}?${queryString}`;
};

const getExtraHeaders = (options) => {
  return { ...getForwardedForHeader(options), ...getSessionHeader(options), ...getNoCacheHeader(options) };
};

export const grabWithoutExtractingResult = (url, options) => {
  const headers = { ...defaultHeaders, ...getExtraHeaders(options) };
  const requestUrl = getRequestUrlWithQueryString(url, options);
  options.debugLogger(`Sending a GET request to: ${requestUrl}. With the following headers: `, headers);
  return fetch(requestUrl, { credentials, headers });
};

export const grab = (...args) => {
  return grabWithoutExtractingResult(...args)
    .then(extractJsonAndAddTimestamp);
};

export const post = (url, options, body = {}) => {
  const headers = {
    ...defaultHeaders,
    ...getContentTypeHeader(),
    ...getExtraHeaders(options)
  };
  const requestUrl = getRequestUrlWithQueryString(url, options);
  options.debugLogger(`Sending a POST request to: ${requestUrl}. With the following headers: `, headers);
  const requestOptions = {
    headers,
    credentials,
    method: 'post',
    body: JSON.stringify(body)
  };
  return fetch(requestUrl, requestOptions);
};
