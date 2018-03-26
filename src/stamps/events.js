const sessionStamp = require('./session');
const { post } = require('../apiHelper');

function sendUsageEvent(eventType, retentionTime) {
  const payload = { eventType };
  if (retentionTime !== undefined) {
    payload.retentionTime = retentionTime;
  }
  return this.withSessionHandling(() =>
    post('/event/log', this.config, payload)
  );
}

// Make sure we have the sessionStamp withSessionHandling method
const stamp = sessionStamp.compose({
  methods: {
    /**
     * Send a usage START event
     * @return {promise}  a promise denoting the success of the operation
     */
    sendUsageStartEvent() {
      return sendUsageEvent.call(this, 'START');
    },

    /**
     * Send a usage QUIT event
     * @param {number|string} [retentionTimeInSeconds] the retention time, in seconds
     * @return {promise}  a promise denoting the success of the operation
     */
    sendUsageStopEvent(retentionTimeInSeconds) {
      return sendUsageEvent.call(this, 'QUIT', retentionTimeInSeconds);
    },
  },
});

module.exports = stamp;
