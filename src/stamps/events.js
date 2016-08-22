import stampit from 'stampit';
import sessionStamp from './session';
import { post } from '../apiHelper';

function sendUsageEvent(eventType, retentionTime) {
  const payload = { eventType };
  if (retentionTime !== undefined) { payload.retentionTime = retentionTime; }
  return this.withSessionHandling(() => post('/event/log', this.props.config, payload));
}

const stamp = stampit()
.methods({
  sendUsageStartEvent() {
    return sendUsageEvent.call(this, 'START');
  },

  sendUsageStopEvent(retentionTimeInSeconds) {
    return sendUsageEvent.call(this, 'QUIT', retentionTimeInSeconds);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
