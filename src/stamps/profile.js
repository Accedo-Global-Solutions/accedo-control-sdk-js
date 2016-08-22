import stampit from 'stampit';
import sessionStamp from './session';
import { grab } from '../apiHelper';

/** @function client */
const stamp = stampit()
.methods({
  /**
   * Get the profile information
   * @return {promise}  a promise of the requested data
   * @memberof client
   */

  getProfileInfo() {
    return this.withSessionHandling(() => grab('/profile', this.props.config));
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
