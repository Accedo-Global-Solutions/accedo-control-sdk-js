const stampit = require('stampit');
const sessionStamp = require('./session');
const { grab } = require('../apiHelper');

const stamp = stampit()
  .methods({
    /**
   * Get all the enabled plugins
   * @return {promise}  a promise of the requested data
   */
    getAllEnabledPlugins() {
      return this.withSessionHandling(() =>
        grab('/plugins', this.props.config)
      );
    },
  })
  // Make sure we have the sessionStamp withSessionHandling method
  .compose(sessionStamp);

module.exports = stamp;
