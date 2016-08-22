import stampit from 'stampit';
import { grab } from '../apiHelper';

/**
 * @function client
 */
const stamp = stampit().methods({
  /**
   * Returns the currently stored sessionKey for this client instance
   * @return {string}  the sessionKey, if any
   * @memberof client
   */
  getSessionKey() {
    return this.props.config.sessionKey;
  },

  /**
   * Create a session and store it for reuse in this client instance
   * @return {promise}  a promise of a string, the sessionKey
   * @memberof client
   */
  createSession() {
    // ignore the potential existing session
    this.props.config.sessionKey = null;
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
   * @memberof client
   */
  withSessionHandling(next) {
    // existing session
    if (this.getSessionKey()) {
      return next().then(json => {
        const { error } = json;
        if (error && error.status === '401') {
          // expired - recreate one
          return this.createSession().then(next);
        }
        // otherwise keep going
        return json;
      });
    }
    // no session - create it first, then launch the next action
    return this.createSession().then(next);
  }
});

export default stamp;
