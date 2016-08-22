import chai from 'chai';
import factory from '../../src/index';

const should = chai.should();

describe('Session API Tests', () => {
  const client = factory({
    appKey: '56ea6a370db1bf032c9df5cb',
    uuid: 'gregTestingSDK'
  });

  it('getSessionKey should return a falsy value at first', () => {
    const key = client.getSessionKey();
    should.not.equal(true, !!key);
  });

  it('createSession should return a session key', () => {
    return client.createSession()
      .then((response) => {
        response.should.be.a('string');
      });
  });

  it('getSessionKey should return a string value after a session was attached to the client', () => {
    const key = client.getSessionKey();
    key.should.be.a('string');
  });
});
