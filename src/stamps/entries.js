import qs from 'qs';
import stampit from 'stampit';
import sessionStamp from './session';
import { grab } from '../apiHelper';

function getPathWithQs(path, params = {}) {
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
  return `${path}?${queryString}`;
}

function request(path, params) {
  const pathWithQs = getPathWithQs(path, params);
  return this.withSessionHandling(() => grab(pathWithQs, this.props.config));
}

/** @function client */
const stamp = stampit()
.methods({
  /**
   * Get all the content entries, based on the given parameters.
   * params should contain any/several of { id, alias, preview, at, typeId, offset, size }
   * do not use id, alias or typeId at the same time - behaviour would be ungaranteed
   * @param {object} [params] a parameters object
   * @return {promise}  a promise of an array of entries (objects)
   * @memberof client
   */
  getEntries(params) {
    return request.call(this, '/content/entries', params);
  },

  /**
   * Get one content entry by id, based on the given parameters.
   * params should contain any/several of { preview, at }
   * @param {string} id the entry id
   * @param {object} [params] a parameters object
   * @return {promise}  a promise of an entry (object)
   * @memberof client
   */
  getEntryById(id, params) {
    return request.call(this, `/content/entry/${id}`, params);
  },

  /**
   * Get one content entry, based on the given parameters.
   * params should contain any/several of { preview, at }
   * do not use id, alias or typeId at the same time - behaviour would be ungaranteed
   * @param {object} alias the entry alias
   * @param {object} [params] a parameters object
   * @return {promise}  a promise of an entry (object)
   * @memberof client
   */
  getEntryByAlias(alias, params) {
    return request.call(this, `/content/entry/alias/${alias}`, params);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
