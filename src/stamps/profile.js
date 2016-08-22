import stampit from 'stampit';
import sessionStamp from './session';
import { grab } from '../apiHelper';

const stamp = stampit()
.methods({
  getProfileInfo() {
    return this.withSessionHandling(() => grab('/profile', this.props.config));
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
