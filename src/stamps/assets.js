import stampit from 'stampit';
import sessionStamp from './session';
import { grab, grabRaw } from '../apiHelper';

const stamp = stampit()
.methods({
  getAllAssets() {
    return this.withSessionHandling(() => grab('/asset', this.props.config));
  },

  getAssetStreamById(id) {
    // note this method does not need a session
    return grabRaw(`/asset/${id}`, this.props.config);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
