import stampit from 'stampit';
import sessionStamp from './session';
import { grab } from '../apiHelper';

/** @function client */
const stamp = stampit()
.methods({
  /**
   * Get all the enabled plugins
   * @return {promise}  a promise of the requested data
   * @memberof client
   */
  getAllEnabledPlugins() {
    return this.withSessionHandling(() => grab('/plugins', this.props.config));
  }

})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
