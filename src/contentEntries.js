import { grab } from './apiHelper';
import { getValidatedOptions } from './options';

const defaultCountOfResults = 20;

const getPaginationQueryParams = (offset, countOfResults) => `offset=${offset}&size=${countOfResults}`;

const getEntryRequestUrl = (validatedOptions, relativePath, isPreview, atUtcTime, ids) => {
  let requestUrl = `${validatedOptions.appGridUrl}/${relativePath}?`;
  const queryStrings = [];
  if (ids && ids.length) { queryStrings.push(`ids=${ids.join(',')}`); }
  if (isPreview) { queryStrings.push('preview=true'); }
  if (atUtcTime) { queryStrings.push(`at=${atUtcTime.toISOString()}`); }
  requestUrl += queryStrings.join('&');
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

// TODO JASON: Test this out!

export const getEntriesByIds = (options, ids, offset = 0, countOfResults = defaultCountOfResults, isPreview = false, atUtcTime) => {
  return getValidatedOptions(options).then((validatedOptions) => {
    let requestUrl = getEntryRequestUrl(validatedOptions, 'content/entries', isPreview, atUtcTime, ids);
    requestUrl += `&${getPaginationQueryParams(offset, countOfResults)}`;
    validatedOptions.debugLogger(`AppGrid: getEntriesByIds request: ${requestUrl}`);
    return grab(requestUrl, validatedOptions);
  });
};

// TODO JASON: Add functions and examples for the following (refer to AppGrid Docs for details):
// Get Entries by Entry Type ID
