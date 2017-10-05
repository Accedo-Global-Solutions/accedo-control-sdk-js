const stampit = require('stampit');
const sessionStamp = require('./session');
const { grab } = require('../apiHelper');

const stamp = stampit()
  .methods({
    /**
   * Get the current application status
   * @return {promise}  a promise of the application status (string)
   */
    getApplicationStatus() {
      return this.withSessionHandling(() => grab('/status', this.props.config));
    },
  })
  // Make sure we have the sessionStamp withSessionHandling method
  .compose(sessionStamp);

module.exports = stamp;
