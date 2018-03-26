const qs = require('qs');
const sessionStamp = require('./session');
const { grab } = require('../apiHelper');

function getPathWithQs(path, params = {}) {
  const {
    id,
    typeId,
    alias,
    typeAlias,
    preview,
    at,
    offset,
    size,
    locale,
  } = params;
  const qsParams = {};
  // The id array must be turned into CSV
  if (id && Array.isArray(id)) {
    qsParams.id = id.join(',');
  }
  // The alias array must be turned into CSV
  if (alias && Array.isArray(alias)) {
    qsParams.alias = alias.join(',');
  }
  // typeId must be turned into CSV
  if (typeId && Array.isArray(typeId)) {
    qsParams.typeId = typeId.join(',');
  }
  // preview is only useful when true
  if (preview) {
    qsParams.preview = true;
  }
  // at is either a string, or a method with toISOString (like a Date) that we use for formatting
  if (typeof at === 'string') {
    qsParams.at = at;
  } else if (at && at.toISOString) {
    qsParams.at = at.toISOString();
  }
  // Add curated and non-curated params
  const queryString = qs.stringify(
    Object.assign({}, qsParams, { typeAlias, offset, size, locale })
  );
  return `${path}?${queryString}`;
}

function request(path, params) {
  const pathWithQs = getPathWithQs(path, params);
  return this.withSessionHandling(() => grab(pathWithQs, this.config));
}

// Make sure we have the sessionStamp withSessionHandling method AND appLogCommon
const stamp = sessionStamp.compose({
  methods: {
    /**
     * Get all the content entries, based on the given parameters.
     * **DO NOT** use several of the id, alias, typeId and typeAlias options at the same time - behaviour would be ungaranteed.
     * @param {object} [params] a parameters object
     * @param {boolean} [params.preview] when true, get the preview version
     * @param {string|date} [params.at] when given, get the version at the given time
     * @param {array} [params.id] an array of entry ids (strings)
     * @param {array} [params.alias] an array of entry aliases (strings)
     * @param {array} [params.typeId] only return entries of the given type ids (strings)
     * @param {string} [params.typeAlias] only return entries whose entry type has this alias
     * @param {number|string} [params.size] limit to that many results per page (limits as per Accedo One API, currently 1 to 50, default 20)
     * @param {number|string} [params.offset] offset the result by that many pages
     * @param {string} [params.locale] if available, get the version for the given locale (defaults to the default locale)
     * @return {promise}  a promise of an array of entries (objects)
     */
    getEntries(params) {
      return request.call(this, '/content/entries', params);
    },

    /**
     * Get one content entry by id, based on the given parameters.
     * @param {string} id the entry id
     * @param {object} [params] a parameters object
     * @param {boolean} [params.preview] when true, get the preview version
     * @param {string|date} [params.at] when given, get the version at the given time
     * @param {string} [params.locale] if available, get the version for the given locale (defaults to the default locale)
     * @return {promise}  a promise of an entry (object)
     */
    getEntryById(id, params) {
      return request.call(this, `/content/entry/${id}`, params);
    },

    /**
     * Get one content entry, based on the given parameters.
     * @param {object} alias the entry alias
     * @param {object} [params] a parameters object
     * @param {boolean} [params.preview] when true, get the preview version
     * @param {string|date} [params.at] when given, get the version at the given time
     * @param {string} [params.locale] if available, get the version for the given locale (defaults to the default locale)
     * @return {promise}  a promise of an entry (object)
     */
    getEntryByAlias(alias, params) {
      return request.call(this, `/content/entry/alias/${alias}`, params);
    },
  },
});

module.exports = stamp;
