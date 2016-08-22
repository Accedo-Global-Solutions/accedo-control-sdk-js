import stampit from 'stampit';
import sessionStamp from './session';
import { grab } from '../apiHelper';

function request(path) {
  return this.withSessionHandling(() => grab(path, this.props.config));
}

const stamp = stampit()
.methods({
  getAllMetadata() {
    return request.call(this, '/metadata');
  },

  getMetadataByKey(key) {
    return request.call(this, `/metadata/${key}`);
  },

  getMetadataByKeys(keys) {
    return request.call(this, `/metadata/${keys.join(',')}`);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
