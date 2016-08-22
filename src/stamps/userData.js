import stampit from 'stampit';
import sessionStamp from './session';
import { grab, post } from '../apiHelper';

const APPLICATION_SCOPE = 'user';
const APPLICATION_GROUP_SCOPE = 'group';

function requestGet(path) {
  return this.withSessionHandling(() => grab(path, this.props.config));
}

function requestPost(path, data) {
  return this.withSessionHandling(() => post(path, this.props.config, data));
}

function getAllDataByUser(scope, userName) {
  return requestGet.call(this, `/${scope}/${userName}`);
}

function getDataByUserAndKey(scope, userName, key) {
  return requestGet.call(this, `/${scope}/${userName}/${key}?json=true`);
}

function setUserData(scope, userName, data) {
  return requestPost.call(this, `/${scope}/${userName}`, data);
}

function setUserDataByKey(scope, userName, key, data) {
  return requestPost.call(this, `/${scope}/${userName}/${key}`, data);
}

const stamp = stampit()
.methods({
  getAllApplicationScopeDataByUser(userName) {
    return getAllDataByUser.call(this, APPLICATION_SCOPE, userName);
  },

  getAllApplicationGroupScopeDataByUser(userName) {
    return getAllDataByUser.call(this, APPLICATION_GROUP_SCOPE, userName);
  },

  getApplicationScopeDataByUserAndKey(userName, key) {
    return getDataByUserAndKey.call(this, APPLICATION_SCOPE, userName, key);
  },

  getApplicationGroupScopeDataByUserAndKey(userName, key) {
    return getDataByUserAndKey.call(this, APPLICATION_GROUP_SCOPE, userName, key);
  },

  setApplicationScopeUserData(userName, data) {
    return setUserData.call(this, APPLICATION_SCOPE, userName, data);
  },

  setApplicationGroupScopeUserData(userName, data) {
    return setUserData.call(this, APPLICATION_GROUP_SCOPE, userName, data);
  },

  setApplicationScopeUserDataByKey(userName, key, value) {
    return setUserDataByKey.call(this, APPLICATION_SCOPE, userName, key, value);
  },

  setApplicationGroupScopeUserDataByKey(userName, key, value) {
    return setUserDataByKey.call(this, APPLICATION_GROUP_SCOPE, userName, key, value);
  }
})
// Make sure we have the sessionStamp withSessionHandling method
.compose(sessionStamp);

export default stamp;
