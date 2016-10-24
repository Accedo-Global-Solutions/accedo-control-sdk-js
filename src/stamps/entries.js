import qs from 'qs';
import stampit from 'stampit';
import sessionStamp from './session';
import { grab } from '../apiHelper';

function getPathWithQs(path, params = {}) {
  const { id, typeId, alias, typeAlias, preview, at, offset, size } = params;
  const qsParams = {};
  // The id array must be turned into CSV
  if (id && id.length) { qsParams.id = id.join(','); }
  // The alias array must be turned into CSV
  if (alias && alias.length) { qsParams.alias = alias.join(','); }
  // typeId must be turned into CSV if it is an array, but it could be a string too
  if (typeId && typeId.length) {
    qsParams.typeId = (typeof typeId === 'string') ?
      typeId :
      typeId.join(',');
  }
  // preview is only useful when true
  if (preview) { qsParams.preview = true; }
  // at is either a string, or a method with toISOString (like a Date) that we use for formatting
  if (typeof at === 'string') {
    qsParams.at = at;
  } else if (at && at.toISOString) {
    qsParams.at = at.toISOString();
  }
  // Add curated and non-curated params
  const queryString = qs.stringify(Object.assign({}, qsParams, { typeAlias, offset, size }));
  return `${path}?${queryString}`;
}

function request(path, params) {
  const pathWithQs = getPathWithQs(path, params);
  return this.withSessionHandling(() => grab(pathWithQs, this.props.config));
}

const stamp = stampit()
.methods({
  /**
   * Get all the content entries, based on the given parameters.
   * **DO NOT** use several of id, alias, typeId and typeAlias at the same time - behaviour would be ungaranteed.
   * @param {object} [params] a parameters object
   * @param {boolean} [params.preview] when true, get the preview version
   * @param {string|date} [params.at] when given, get the version at the given time
   * @param {array} [params.id] an array of entry ids (strings)
   * @param {array} [params.alias] an array of entry aliases (strings)
   * @param {string|array} [params.typeId] only return entries of the given type id(s).
   *                                       It can be passed as a single-value string `'type1'`,
   *                                       a CSV string `'type1,type2'` or an array of strings `['type1', 'type2']`
   * @param {string} [params.typeAlias] only return entries whose entry type has this alias
   * @param {number|string} [params.size] limit to that many results per page (limits as per AppGrid API, currently 1 to 50, default 20)
   * @param {number|string} [params.offset] offset the result by that many pages
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
   * @return {promise}  a promise of an entry (object)
   */
  getEntryByAlias(alias, params) {
    return request.call(this, `/content/entry/alias/${alias}`, params);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
