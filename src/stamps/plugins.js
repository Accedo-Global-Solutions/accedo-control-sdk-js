const sessionStamp = require('./session');
const { grab } = require('../apiHelper');

// Make sure we have the sessionStamp withSessionHandling method
const stamp = sessionStamp.compose({
  methods: {
    /**
     * Get all the enabled plugins
     * @return {promise}  a promise of the requested data
     */
    getAllEnabledPlugins() {
      return this.withSessionHandling(() => grab('/plugins', this.config));
    },
  },
});

module.exports = stamp;
