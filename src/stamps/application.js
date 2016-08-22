import stampit from 'stampit';
import sessionStamp from './session';
import { grab } from '../apiHelper';

/** @function client */
const stamp = stampit()
.methods({
  /**
   * Get the current application status
   * @return {promise}  a promise of the application status (string)
   * @memberof client
   */
  getApplicationStatus() {
    return this.withSessionHandling(() => grab('/status', this.props.config));
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
