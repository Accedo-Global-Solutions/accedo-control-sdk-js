import uuidLib from 'uuid';
import stampit from 'stampit';
import { grab } from '../apiHelper';

export const generateUuid = () => uuidLib.v4();

const stamp = stampit().methods({
  getSessionKey() {
    return this.props.config.sessionKey;
  },

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
