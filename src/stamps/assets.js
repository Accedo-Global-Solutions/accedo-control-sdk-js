import stampit from 'stampit';
import sessionStamp from './session';
import { grab, grabRaw } from '../apiHelper';

const stamp = stampit()
.methods({
  /**
   * Lists all the assets.
   * @return {promise}  a promise of a hash of assets (key: asset name, value: asset URL)
   */
  getAllAssets() {
    return this.withSessionHandling(() => grab('/asset', this.props.config));
  },

  /**
   * Get a stream for one asset by id
   * @param {string} id the asset id
   * @return {promise}  a promise of a node stream
   */
  getAssetById(id) {
    // note this method does not need a session
    return grabRaw(`/asset/${id}`, this.props.config);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
