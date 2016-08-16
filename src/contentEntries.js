import qs from 'qs';

import { grab } from './apiHelper';
import { getValidatedOptions } from './options';

const getRequestUrl = (url, path, params = {}) => {
  const { id, typeId, alias, preview, at, offset, size } = params;
  const qsParams = {};
  // The id array must be turned into CSV
  if (id && id.length) { qsParams.id = `${id.join(',')}`; }
  // The alias array must be turned into CSV
  if (alias && alias.length) { qsParams.alias = `${alias.join(',')}`; }
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

const validateAndRequest = (opts, path, params) =>
  getValidatedOptions(opts).then((options) => {
    const requestUrl = getRequestUrl(options.appGridUrl, path, params);
    options.debugLogger(`AppGrid request: ${requestUrl}`);
    return grab(requestUrl, options);
  });

// params should contain any/several of { id, alias, preview, at, typeId, offset, size }
// do not use id, alias or typeId at the same time - behaviour would be ungaranteed
export const getEntries = (opts, params) =>
  validateAndRequest(opts, 'content/entries', params);

// params should contain any/several of { preview, at }
export const getEntryById = (opts, id, params) =>
  validateAndRequest(opts, `content/entry/${id}`, params);

// params should contain any/several of { preview, at }
export const getEntryByAlias = (opts, alias, params) =>
  validateAndRequest(opts, `content/entry/alias/${alias}`, params);
