import qs from 'qs';

import { grab } from './apiHelper';
import { getValidatedOptions } from './options';

const getRequestUrl = (url, path, { id, preview, at, typeId, offset, size }) => {
  const qsParams = {};
  // The id array must be turned into CSV
  if (id && id.length) { qsParams.id = `${id.join(',')}`; }
  // preview is only useful when true
  if (preview) { qsParams.preview = true; }
  // at is either a string, or a method with toISOString (like a Date) that we use for formatting
  if (typeof at === 'string') {
    qsParams.at = at;
  } else if (at && at.toISOString) {
    qsParams.at = at.toISOString();
  }
  // Add curated and non-curated params
  const queryString = qs.stringify({ ...qsParams, typeId, offset, size });
  return `${url}/${path}?${queryString}`;
};

// params should contain any/several of { id, preview, at, typeId, offset, size }
export const getEntries = (unValidatedOptions, params) => {
  return getValidatedOptions(unValidatedOptions).then((options) => {
    const requestUrl = getRequestUrl(options.appGridUrl, 'content/entries', params);
    options.debugLogger(`AppGrid: getEntries request: ${requestUrl}`);
    return grab(requestUrl, options);
  });
};

// params should contain any/several of { preview, at }
export const getEntryById = (unValidatedOptions, id, params) => {
  return getValidatedOptions(unValidatedOptions).then((options) => {
    const requestUrl = getRequestUrl(options.appGridUrl, `content/entry/${id}`, params);
    options.debugLogger(`AppGrid: getEntryById request: ${requestUrl}`);
    return grab(requestUrl, options);
  });
};
