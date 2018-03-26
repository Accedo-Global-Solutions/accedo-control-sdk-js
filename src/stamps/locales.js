const sessionStamp = require('./session');
const { grab } = require('../apiHelper');

// Make sure we have the sessionStamp withSessionHandling method
const stamp = sessionStamp.compose({
  methods: {
    /**
     * Get all the available locales
     * @return {promise}  a promise of the requested data
     */
    getAvailableLocales() {
      return this.withSessionHandling(() => grab('/locales', this.config));
    },
  },
});

module.exports = stamp;
