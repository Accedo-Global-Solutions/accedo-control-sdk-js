const stampit = require('stampit');
const sessionStamp = require('./session');
const { grab } = require('../apiHelper');

const stamp = stampit()
  .methods({
    /**
   * Get the profile information
   * @return {promise}  a promise of the requested data
   */

    getProfileInfo() {
      return this.withSessionHandling(() =>
        grab('/profile', this.props.config)
      );
    },
  })
  // Make sure we have the sessionStamp withSessionHandling method
  .compose(sessionStamp);

module.exports = stamp;
