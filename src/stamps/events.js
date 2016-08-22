import stampit from 'stampit';
import sessionStamp from './session';
import { post } from '../apiHelper';

function sendUsageEvent(eventType, retentionTime) {
  const payload = { eventType };
  if (retentionTime !== undefined) { payload.retentionTime = retentionTime; }
  return this.withSessionHandling(() => post('/event/log', this.props.config, payload));
}

/** @function client */
const stamp = stampit()
.methods({
  /**
   * Send a usage START event
   * @return {promise}  a promise denoting the success of the operation
   * @memberof client
   */
  sendUsageStartEvent() {
    return sendUsageEvent.call(this, 'START');
  },

  /**
   * Send a usage QUIT event
   * @param {number|string} [retentionTimeInSeconds] the retention time, in seconds
   * @return {promise}  a promise denoting the success of the operation
   * @memberof client
   */
  sendUsageStopEvent(retentionTimeInSeconds) {
    return sendUsageEvent.call(this, 'QUIT', retentionTimeInSeconds);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
