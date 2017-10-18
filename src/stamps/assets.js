const stampit = require('stampit');
const sessionStamp = require('./session');
const { grab } = require('../apiHelper');

const stamp = stampit()
  .methods({
    /**
   * Lists all the assets.
   * @return {promise}  a promise of a hash of assets (key: asset name, value: asset URL)
   */
    getAllAssets() {
      return this.withSessionHandling(() => grab('/asset', this.props.config));
    },
  })
  // Make sure we have the sessionStamp withSessionHandling method
  .compose(sessionStamp);

module.exports = stamp;
