import stampit from 'stampit';
import sessionStamp from './session';
import { grab } from '../apiHelper';

const stamp = stampit()
.methods({
  /**
   * Get all the available locales
   * @return {promise}  a promise of the requested data
   */
  getAvailableLocales() {
    return this.withSessionHandling(() => grab('/locales', this.props.config));
  }

})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
