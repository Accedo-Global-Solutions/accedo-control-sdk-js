const stampit = require('stampit');
const sessionStamp = require('./session');
const { grab } = require('../apiHelper');

const stamp = stampit()
.methods({
  /**
   * Get all the available locales
   * @return {promise}  a promise of the requested data
   */
  getAvailableLocales() {
    return this.withSessionHandling(() => grab('/locales', this.props.config));
  }

})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

module.exports = stamp;
