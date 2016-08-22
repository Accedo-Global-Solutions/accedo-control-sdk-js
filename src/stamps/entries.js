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

const stamp = stampit()
.methods({
  // params should contain any/several of { id, alias, preview, at, typeId, offset, size }
  // do not use id, alias or typeId at the same time - behaviour would be ungaranteed
  getEntries(params) {
    return request.call(this, '/content/entries', params);
  },

  // params should contain any/several of { preview, at }
  getEntryById(id, params) {
    return request.call(this, `/content/entry/${id}`, params);
  },

  // params should contain any/several of { preview, at }
  getEntryByAlias(alias, params) {
    return request.call(this, `/content/entry/alias/${alias}`, params);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
