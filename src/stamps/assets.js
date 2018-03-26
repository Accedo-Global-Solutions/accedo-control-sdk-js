const sessionStamp = require('./session');
const { grab } = require('../apiHelper');

// Make sure we have the sessionStamp withSessionHandling method
const stamp = sessionStamp.compose({
  methods: {
    /**
     * Lists all the assets.
     * @return {promise}  a promise of a hash of assets (key: asset name, value: asset URL)
     */
    getAllAssets() {
      return this.withSessionHandling(() => grab('/asset', this.config));
    },
  },
});

module.exports = stamp;
