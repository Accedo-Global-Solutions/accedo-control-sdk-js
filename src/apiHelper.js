import fetch from 'isomorphic-fetch';
import qs from 'qs';

const MIME_TYPE_JSON = 'application/json';
const HOST = 'https://appgrid-api.cloud.accedo.tv';
const credentials = 'same-origin'; // NOTE: This option is required in order for Fetch to send cookies
const defaultHeaders = { accept: MIME_TYPE_JSON };

const getForwardedForHeader = ({ clientIp }) => {
  if (!clientIp) { return {}; }
  return { 'X-FORWARDED-FOR': clientIp };
};

const getSessionHeader = ({ sessionKey }) => {
  if (!sessionKey) { return {}; }
  return { 'X-SESSION': sessionKey };
};

const getContentTypeHeader = () => ({ 'Content-Type': MIME_TYPE_JSON });

const getQueryString = (config, existingQs = {}) => {
  const defaultQs = {
    appKey: config.appKey,
    uuid: config.deviceId
  };
  if (config.gid) { defaultQs.gid = config.gid; }
  const qsObject = { ...existingQs, ...defaultQs };
  const queryString = qs.stringify(qsObject);
  return queryString;
};

const getRequestUrlWithQueryString = (path, config) => {
  const splitUrl = path.split('?');
  const pathWithoutQs = splitUrl[0];
  const existingQs = qs.parse(splitUrl[1]);
  const queryString = getQueryString(config, existingQs);
  return `${HOST}${pathWithoutQs}?${queryString}`;
};

const getExtraHeaders = (options) => {
  return { ...getForwardedForHeader(options), ...getSessionHeader(options) };
};

const getFetch = (path, config) => {
  const headers = { ...defaultHeaders, ...getExtraHeaders(config) };
  const requestUrl = getRequestUrlWithQueryString(path, config);
  config.log(`Sending a GET request to: ${requestUrl} with the following headers`, headers);
  return fetch(requestUrl, { credentials, headers })
    .then(res => {
      if (res.status >= 400) {
        config.log('GET failed with status', res.status);
        throw res;
      }
      return res;
    });
};

export const grab = (path, config) => {
  config.log('Requesting', path);
  return getFetch(path, config)
    .then(res => res.json())
    .then((response) => {
      config.log('GET response', response);
      return response;
    });
};

export const grabRaw = (path, config) => {
  return getFetch(path, config)
    .then((response) => {
      return response.body;
    });
};

export const post = (path, config, body = {}) => {
  const headers = {
    ...defaultHeaders,
    ...getContentTypeHeader(),
    ...getExtraHeaders(config)
  };
  const requestUrl = getRequestUrlWithQueryString(path, config);
  config.log(`Sending a POST request to: ${requestUrl}. With the following headers and body: `, headers, body);
  const options = {
    headers,
    credentials,
    method: 'post',
    body: JSON.stringify(body)
  };
  return fetch(requestUrl, options)
    .then(({ status, statusText }) => {
      if (status !== 200) { throw new Error(`AppGrid POST request returned a non-200 response. Status Code: ${status}. Status Text: ${statusText}`); }
      const result = { status, statusText };
      config.log('POST response: ', { status, statusText });
      return result;
    });
};
