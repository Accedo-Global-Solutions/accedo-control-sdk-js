/* eslint no-console: 0 */

const DEFAULT_GET_MAP = {
  '/session': {
    sessionKey: '123',
    expiration: '20301005T09:11:22+0000',
  },
  '/application/log/level': { logLevel: 'info' },
};
const DEFAULT_POST_MAP = {
  '/application/log/debug': { status: 200, statusText: 'OK' },
  '/application/log/info': { status: 200, statusText: 'OK' },
  '/application/log/warn': { status: 200, statusText: 'OK' },
  '/application/log/error': { status: 200, statusText: 'OK' },
  '/application/logs': { status: 200, statusText: 'OK' },
  '/event/log': { status: 200, statusText: 'OK' },
};
let getToJsonMap = DEFAULT_GET_MAP;
let postToResMap = DEFAULT_POST_MAP;

module.exports.grab = path => {
  const json = getToJsonMap[path];
  if (json) {
    return Promise.resolve(json);
  }
  console.warn(`MOCK grab: test will fail, no mock for the path ${path}`);
  return Promise.reject({
    status: 418,
  });
};

module.exports.post = path => {
  const res = postToResMap[path];
  if (res) {
    return Promise.resolve(res);
  }
  console.warn(`MOCK post: test will fail, no mock for the path ${path}`);
  return Promise.reject({
    status: 418,
  });
};

module.exports.__changeMaps = (getMap = {}, postMap = {}) => {
  getToJsonMap = { ...DEFAULT_GET_MAP, ...getMap };
  postToResMap = { ...DEFAULT_POST_MAP, ...postMap };
};
