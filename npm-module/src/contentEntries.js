import qs from 'qs';

import { grab } from './apiHelper';
import { getValidatedOptions } from './options';

const defaultCountOfResults = 20;

const getPaginationQueryParams = (offset, countOfResults) => `offset=${offset}&size=${countOfResults}`;

const getEntryRequestUrl = (validatedOptions, relativePath, isPreview, atUtcTime, ids, typeId) => {
  let requestUrl = `${validatedOptions.appGridUrl}/${relativePath}`;
  const qsObject = {};
  if (ids && ids.length) { qsObject.id = `${ids.join(',')}`; }
  if (typeId) { qsObject.typeId = typeId; }
  if (isPreview) { qsObject.preview = true; }
  if (atUtcTime) { qsObject.at = atUtcTime.toISOString(); }
  const queryString = qs.stringify(qsObject);
  requestUrl += `?${queryString}`;
  return requestUrl;
};

export const getAllEntries = (options, offset = 0, countOfResults = defaultCountOfResults) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = `${validatedOptions.appGridUrl}/content/entries?${getPaginationQueryParams(offset, countOfResults)}`;
    validatedOptions.debugLogger(`AppGrid: getAllEntries request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

export const getEntryById = (options, id, isPreview = false, atUtcTime) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    const requestUrl = getEntryRequestUrl(validatedOptions, `content/entry/${id}`, isPreview, atUtcTime);
    validatedOptions.debugLogger(`AppGrid: getEntryById request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

export const getEntriesByIds = (options, ids, offset = 0, countOfResults = defaultCountOfResults, isPreview = false, atUtcTime) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    let requestUrl = getEntryRequestUrl(validatedOptions, 'content/entries', isPreview, atUtcTime, ids);
    requestUrl += `&${getPaginationQueryParams(offset, countOfResults)}`;
    validatedOptions.debugLogger(`AppGrid: getEntriesByIds request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

export const getEntriesByTypeId = (options, typeId, offset = 0, countOfResults = defaultCountOfResults, isPreview = false, atUtcTime) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    let requestUrl = getEntryRequestUrl(validatedOptions, 'content/entries', isPreview, atUtcTime, null, typeId);
    requestUrl += `&${getPaginationQueryParams(offset, countOfResults)}`;
    validatedOptions.debugLogger(`AppGrid: getEntriesByTypeId request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};
