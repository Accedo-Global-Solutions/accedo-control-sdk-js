const sessionStamp = require('./session');
const { grab } = require('../apiHelper');

// Make sure we have the sessionStamp withSessionHandling method
const stamp = sessionStamp.compose({
  methods: {
    /**
     * Get the current application status
     * @return {promise}  a promise of the application status (string)
     */
    getApplicationStatus() {
      return this.withSessionHandling(() => grab('/status', this.config));
    },
  },
});

module.exports = stamp;
