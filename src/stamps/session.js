import stampit from 'stampit';
import { grab } from '../apiHelper';

const stamp = stampit().methods({
  /**
   * Returns the currently stored sessionKey for this client instance
   * @return {string}  the sessionKey, if any
   */
  getSessionKey() {
    return this.props.config.sessionKey;
  },

  /**
   * Create a session and store it for reuse in this client instance
   * @return {promise}  a promise of a string, the sessionKey
   */
  createSession() {
    // ignore any existing session
    if (this.props.config.sessionKey) {
      this.props.config.sessionKey = null;
    }
    return grab('/session', this.props.config).then((json) => {
      const { sessionKey } = json;
      // update the context of this client, adding the session key
      this.props.config.sessionKey = sessionKey;
      return sessionKey;
    });
  },

  /**
   * If a sessionKey exists, calls the next function, then:
   * - If this failed with a 401 (unauthorized), create a session then retry
   * - Otherwise returns a promise of that function's results
   * If there was no sessionKey, create one before attempting the next function.
   * @private
   * @param {function} next a function that returns a promise
   * @return {promise}  a promise of the result of the next function
   */
  withSessionHandling(next) {
    // existing session
    if (this.getSessionKey()) {
      return next().catch(res => {
        if (res && res.status === 401) {
          // session expired - recreate one then retry
          return this.createSession().then(next);
        }
        // otherwise propagate the failure
        throw res;
      });
    }
    // no session - create it first, then launch the next action
    return this.createSession().then(next);
  }
});

export default stamp;
