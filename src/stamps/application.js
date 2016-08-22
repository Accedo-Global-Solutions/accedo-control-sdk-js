import stampit from 'stampit';
import sessionStamp from './session';
import { grab } from '../apiHelper';

const stamp = stampit()
.methods({
  getApplicationStatus() {
    return this.withSessionHandling(() => grab('/status', this.props.config));
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
