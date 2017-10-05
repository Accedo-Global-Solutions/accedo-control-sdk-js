const stampit = require('stampit');
const { grab } = require('../apiHelper');

module.exports = stampit()
  .init(({ instance }) => {
    // the promise of a session being created
    let creatingSessionPromise;
    /**
     * Create a session and store it for reuse in this client instance
     * Note you do not usually need to worry about this. Other methods will call it
     * automatically for you when it is needed.
     * @return {promise}  a promise of a string, the sessionKey
     */
    instance.createSession = function createSession() {
      // if we have a promise of a session, return it
      if (creatingSessionPromise) {
        return creatingSessionPromise;
      }

      // ignore any existing session
      if (this.props.config.sessionKey) {
        this.props.config.sessionKey = null;
      }

      // launch a request, update the promise
      creatingSessionPromise = grab('/session', this.props.config)
        .then(json => {
          const { sessionKey } = json;
          // update the context of this client, adding the session key
          this.props.config.sessionKey = sessionKey;
          // we're no longer creating a session
          creatingSessionPromise = null;
          return sessionKey;
        })
        .catch(err => {
          // we're no longer creating a session
          creatingSessionPromise = null;
          throw err;
        });

      return creatingSessionPromise;
    };
  })
  .methods({
    /**
   * Returns the currently stored sessionKey for this client instance
   * @return {string}  the sessionKey, if any
   */
    getSessionKey() {
      return this.props.config.sessionKey;
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
    },
  });
