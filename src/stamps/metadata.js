const sessionStamp = require('./session');
const { grab } = require('../apiHelper');

function request(path) {
  return this.withSessionHandling(() => grab(path, this.config));
}

// Make sure we have the sessionStamp withSessionHandling method
const stamp = sessionStamp.compose({
  methods: {
    /**
     * Get all the metadata
     * @return {promise}  a promise of the requested data
     */
    getAllMetadata() {
      return request.call(this, '/metadata');
    },

    /**
     * Get the metadata by a specific key
     * @param {string} key a key to get specific metadata
     * @return {promise}  a promise of the requested data
     */
    getMetadataByKey(key) {
      return request.call(this, `/metadata/${key}`);
    },

    /**
     * Get the metadata by specific keys
     * @param {array} keys an array of keys (strings)
     * @return {promise}  a promise of the requested data
     */
    getMetadataByKeys(keys) {
      return request.call(this, `/metadata/${keys.join(',')}`);
    },
  },
});

module.exports = stamp;
